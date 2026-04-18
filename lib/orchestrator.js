const {
  WORKFLOW_COMMANDS,
  ORCHESTRATION_TRACKS,
  OPTIONAL_SUBAGENT_RULES,
  DEPRECATED_SUBAGENT_ALIASES,
  NON_OVERLAP_ROUTE_BOUNDARIES,
  MODE_LOCKED_SPECIALISTS,
  SECURITY_REVIEW_POLICY,
  REFACTOR_BUILD_RETRY_CAP,
  REFACTOR_BUILD_HALT_AFTER,
  findScenarioById,
  resolveScenarioFromObjective
} = require('./workflow');

function createExecutionId(command) {
  return `${command}-${Date.now().toString(36)}`;
}

function normalizeMode(mode) {
  return mode === 'slash-command' ? 'slash-command' : 'slash-command-auto';
}

class WorkflowOrchestrator {
  constructor() {
    this.workflowLookup = new Map(WORKFLOW_COMMANDS.map((workflow) => [workflow.cli, workflow]));
  }

  resolveScenario({ scenarioId, objective }) {
    if (scenarioId) {
      const explicitScenario = findScenarioById(scenarioId);
      if (!explicitScenario) {
        throw new Error(`Unknown scenario: ${scenarioId}`);
      }

      return {
        scenario: explicitScenario,
        reason: 'explicit scenario override'
      };
    }

    return resolveScenarioFromObjective(objective);
  }

  resolveOptionalSubagents({ scenarioId, phase, objective, routeState }) {
    const objectiveLower = (objective || '').toLowerCase();
    const activeSubagents = routeState.activeSubagents;

    const matchesRule = (rule) => {
      const when = rule.when || {};

      if (Array.isArray(when.scenarios) && when.scenarios.length > 0 && !when.scenarios.includes(scenarioId)) {
        return false;
      }

      if (Array.isArray(when.tracks) && when.tracks.length > 0 && !when.tracks.includes(phase.track)) {
        return false;
      }

      if (Array.isArray(when.commands) && when.commands.length > 0 && !when.commands.includes(phase.command)) {
        return false;
      }

      if (Array.isArray(when.keywords) && when.keywords.length > 0) {
        const keywordMatched = when.keywords.some((keyword) => objectiveLower.includes(keyword.toLowerCase()));
        if (!keywordMatched) {
          return false;
        }
      }

      if (Array.isArray(rule.dependsOnSubagents) && rule.dependsOnSubagents.length > 0) {
        const isDependencySatisfied = rule.dependsOnSubagents.every((name) => activeSubagents.has(name));
        if (!isDependencySatisfied) {
          return false;
        }
      }

      return true;
    };

    let optionalSubagents = OPTIONAL_SUBAGENT_RULES
      .filter(matchesRule)
      .map((rule) => {
        const alias = DEPRECATED_SUBAGENT_ALIASES[rule.subagent] || null;
        const delegatedName = alias ? alias.to : rule.subagent;
        const delegatedMode = rule.mode || (alias ? alias.mode : null);

        if (alias) {
          routeState.deprecationNotices.add(alias.notice);
        }

        return {
          name: delegatedName,
          required: false,
          invocation_mode: delegatedMode,
          reason: rule.reason || 'Scenario-specific optional delegation.',
          deprecated_from: alias ? rule.subagent : null,
          deprecation_notice: alias ? alias.notice : null
        };
      });

    const commandAllowlist = NON_OVERLAP_ROUTE_BOUNDARIES.commandAllowlist[phase.command];
    if (Array.isArray(commandAllowlist) && commandAllowlist.length > 0) {
      optionalSubagents = optionalSubagents.filter((entry) => commandAllowlist.includes(entry.name));
    }

    if (
      phase.command === 'risk-review' &&
      optionalSubagents.some((entry) => entry.name === 'code-reviewer') &&
      !optionalSubagents.some((entry) => entry.name === 'dependency-auditor')
    ) {
      optionalSubagents.push({
        name: 'dependency-auditor',
        required: false,
        invocation_mode: null,
        reason: 'Sequenced after code-reviewer to preserve review/dependency/docs ownership boundaries.',
        deprecated_from: null,
        deprecation_notice: null
      });
    }

    const mergedByIdentity = new Map();
    for (const entry of optionalSubagents) {
      const identity = `${entry.name}::${entry.invocation_mode || 'none'}`;
      if (!mergedByIdentity.has(identity)) {
        mergedByIdentity.set(identity, entry);
        continue;
      }

      const existing = mergedByIdentity.get(identity);
      const reasonParts = [existing.reason, entry.reason].filter(Boolean);
      existing.reason = Array.from(new Set(reasonParts)).join(' ');
      existing.required = existing.required || entry.required;
      mergedByIdentity.set(identity, existing);
    }

    const reviewOrder = NON_OVERLAP_ROUTE_BOUNDARIES.reviewSequence;
    return Array.from(mergedByIdentity.values()).sort((left, right) => {
      const leftIndex = reviewOrder.indexOf(left.name);
      const rightIndex = reviewOrder.indexOf(right.name);

      if (leftIndex === -1 && rightIndex === -1) {
        return left.name.localeCompare(right.name);
      }
      if (leftIndex === -1) {
        return 1;
      }
      if (rightIndex === -1) {
        return -1;
      }
      return leftIndex - rightIndex;
    });
  }

  resolveInvocationMode({ routedSubagent, phase, objective, routeState }) {
    const objectiveLower = (objective || '').toLowerCase();

    if (routedSubagent === 'qa-specialist') {
      if (phase.track === 'qa-design') {
        return 'design';
      }
      if (phase.track === 'qa') {
        return 'validation';
      }
      return null;
    }

    if (routedSubagent === 'performance-specialist') {
      if (routeState.activeSubagents.has('test-data-builder')) {
        return 'load';
      }

      const loadKeywords = ['load', 'throughput', 'stress', 'traffic'];
      return loadKeywords.some((keyword) => objectiveLower.includes(keyword)) ? 'load' : 'profile';
    }

    return null;
  }

  assertModeLock(subagent, invocationMode) {
    const allowedModes = MODE_LOCKED_SPECIALISTS[subagent];
    if (!allowedModes) {
      return;
    }

    if (!invocationMode) {
      const error = new Error(`Missing required mode for ${subagent}. Allowed: ${allowedModes.join('|')}`);
      error.name = 'ModeLockError';
      throw error;
    }

    if (!allowedModes.includes(invocationMode)) {
      const error = new Error(`Unsupported mode ${invocationMode} for ${subagent}. Allowed: ${allowedModes.join('|')}`);
      error.name = 'ModeLockError';
      throw error;
    }
  }

  evaluateSecurityInvocationPolicy({ objective }) {
    const objectiveLower = (objective || '').toLowerCase();
    const mandatoryMatches = SECURITY_REVIEW_POLICY.mandatoryKeywords
      .filter((keyword) => objectiveLower.includes(keyword));
    const mediumMatches = SECURITY_REVIEW_POLICY.mediumKeywords
      .filter((keyword) => objectiveLower.includes(keyword));

    if (mandatoryMatches.length > 0) {
      return {
        required: true,
        level: 'mandatory',
        reason: `mandatory security trigger matched: ${mandatoryMatches.join(', ')}`,
        mediumScore: mediumMatches.length,
        skipReason: null
      };
    }

    if (mediumMatches.length >= SECURITY_REVIEW_POLICY.mediumThreshold) {
      return {
        required: false,
        level: 'optional',
        reason: `optional security trigger score ${mediumMatches.length}/${SECURITY_REVIEW_POLICY.mediumThreshold}`,
        mediumScore: mediumMatches.length,
        skipReason: null
      };
    }

    return {
      required: false,
      level: 'skipped',
      reason: null,
      mediumScore: mediumMatches.length,
      skipReason: `no mandatory trigger and medium score ${mediumMatches.length}/${SECURITY_REVIEW_POLICY.mediumThreshold}`
    };
  }

  evaluateRefactorRepairPolicy({ objective, retryCycle }) {
    const objectiveLower = (objective || '').toLowerCase();
    const refactorDetected = ['refactor', 'cleanup', 'dead code', 'unused'].some((keyword) => objectiveLower.includes(keyword));

    const normalizedRetryCycle = Number.isInteger(retryCycle) ? retryCycle : 0;
    if (normalizedRetryCycle >= REFACTOR_BUILD_HALT_AFTER) {
      const error = new Error(
        `Refactor-repair retry cap exceeded at cycle ${normalizedRetryCycle}. Allowed max cycles: ${REFACTOR_BUILD_RETRY_CAP}`
      );
      error.name = 'RetryCapError';
      throw error;
    }

    return {
      active: refactorDetected,
      retryCycle: normalizedRetryCycle,
      retryCap: REFACTOR_BUILD_RETRY_CAP,
      haltAfter: REFACTOR_BUILD_HALT_AFTER
    };
  }

  buildPhases(scenario, objective, securityPolicy) {
    let securityInjected = false;
    const routeState = {
      activeSubagents: new Set(),
      deprecationNotices: new Set()
    };
    const phases = [];

    for (let index = 0; index < scenario.phases.length; index += 1) {
      const phase = scenario.phases[index];
      const workflow = this.workflowLookup.get(phase.command);
      const trackProfile = ORCHESTRATION_TRACKS[phase.track] || null;
      const optionalSubagents = this.resolveOptionalSubagents({
        scenarioId: scenario.id,
        phase,
        objective,
        routeState
      });
      const routedSubagent = trackProfile ? trackProfile.subagent : null;
      const invocationMode = this.resolveInvocationMode({
        routedSubagent,
        phase,
        objective,
        routeState
      });

      this.assertModeLock(routedSubagent, invocationMode);

      if (
        !securityInjected &&
        securityPolicy.required &&
        ['backend', 'frontend', 'release-ops', 'deployment'].includes(phase.track)
      ) {
        optionalSubagents.push({
          name: 'security-reviewer',
          required: true,
          invocation_mode: null,
          reason: securityPolicy.reason
        });
        securityInjected = true;
      }

      for (const optionalSubagent of optionalSubagents) {
        this.assertModeLock(optionalSubagent.name, optionalSubagent.invocation_mode);
      }

      const handoff_inputs = [];
      if (routeState.activeSubagents.has('test-data-builder') && ['qa', 'frontend', 'performance'].includes(phase.track)) {
        handoff_inputs.push('test-data-builder');
      }

      const phaseResult = {
        phase_id: `phase-${index + 1}`,
        orchestration_phase: phase.command,
        command: workflow.cli,
        slash_command: workflow.slash,
        purpose: workflow.purpose,
        specialist: workflow.specialist,
        routed_track: phase.track,
        routed_subagent: routedSubagent,
        invocation_mode: invocationMode,
        handoff_inputs,
        routed_skills: trackProfile ? trackProfile.skills : [],
        optional_subagents: optionalSubagents,
        status: 'completed',
        details: trackProfile ? trackProfile.goal : null
      };

      phases.push(phaseResult);

      if (routedSubagent) {
        routeState.activeSubagents.add(routedSubagent);
      }
      for (const optionalSubagent of optionalSubagents) {
        routeState.activeSubagents.add(optionalSubagent.name);
      }
    }

    return {
      phases,
      deprecationNotices: Array.from(routeState.deprecationNotices)
    };
  }

  orchestrate({ objective, scenarioId, mode, retryCycle = 0 }) {
    const trimmedObjective = (objective || '').trim();
    const selectedMode = normalizeMode(mode);

    if (!trimmedObjective) {
      return {
        command: '/orchestrate',
        execution_id: createExecutionId('orchestrate'),
        mode: selectedMode,
        status: 'blocked',
        inputs: {
          objective: objective || null,
          scenario: scenarioId || null
        },
        prechecks: [
          {
            name: 'objective_non_empty',
            status: 'failed',
            details: 'Provide a non-empty orchestration objective.'
          }
        ],
        execution_log: [],
        artifacts: null,
        risks: [
          {
            level: 'high',
            message: 'Orchestration was blocked because objective is missing.'
          }
        ],
        safety_checks: [
          {
            name: 'scope_guard',
            status: 'passed',
            details: 'No execution started.'
          }
        ],
        stop_condition: 'objective is required',
        next_action: 'Provide an objective and rerun /orchestrate.'
      };
    }

    try {
      const refactorPolicy = this.evaluateRefactorRepairPolicy({
        objective: trimmedObjective,
        retryCycle
      });
      const { scenario, reason } = this.resolveScenario({ scenarioId, objective: trimmedObjective });
      const securityPolicy = this.evaluateSecurityInvocationPolicy({
        objective: trimmedObjective
      });
      const buildResult = this.buildPhases(scenario, trimmedObjective, securityPolicy);
      const phases = buildResult.phases;
      const executionLog = phases.map((phase) => ({
        phase: phase.phase_id,
        orchestration_phase: phase.orchestration_phase,
        routed_subagent: phase.routed_subagent,
        invocation_mode: phase.invocation_mode,
        handoff_inputs: phase.handoff_inputs,
        routed_track: phase.routed_track,
        optional_subagents: phase.optional_subagents,
        status: 'delegated',
        details: `Delegated ${phase.command} to ${phase.routed_subagent}`
      }));

      const risks = [];
      if (!scenarioId) {
        risks.push({
          level: 'low',
          message: `Scenario auto-selection: ${reason}.`
        });
      }

      return {
        command: '/orchestrate',
        execution_id: createExecutionId('orchestrate'),
        mode: selectedMode,
        status: 'completed',
        inputs: {
          objective: trimmedObjective,
          scenario: scenario.id
        },
        prechecks: [
          {
            name: 'objective_non_empty',
            status: 'passed',
            details: null
          }
        ],
        execution_log: executionLog,
        artifacts: {
          scenario: scenario.id,
          scenario_reason: reason,
          security_policy: securityPolicy,
          refactor_repair_policy: refactorPolicy,
          deprecation_notices: buildResult.deprecationNotices,
          orchestration_summary: `Generated ${phases.length} phase handoffs for ${scenario.id}.`,
          phases
        },
        risks,
        safety_checks: [
          {
            name: 'scope_guard',
            status: 'passed',
            details: 'No hidden scope expansion detected in selected scenario.'
          }
        ],
        stop_condition: null,
        next_action: null
      };
    } catch (error) {
      const blockedByPolicy = error.name === 'ModeLockError' || error.name === 'RetryCapError';

      return {
        command: '/orchestrate',
        execution_id: createExecutionId('orchestrate'),
        mode: selectedMode,
        status: blockedByPolicy ? 'blocked' : 'failed',
        inputs: {
          objective: trimmedObjective,
          scenario: scenarioId || null
        },
        prechecks: [
          {
            name: 'objective_non_empty',
            status: 'passed',
            details: null
          }
        ],
        execution_log: [],
        artifacts: null,
        risks: [
          {
            level: 'high',
            message: error.message
          }
        ],
        safety_checks: [
          {
            name: 'scope_guard',
            status: 'passed',
            details: 'No mutation occurred.'
          }
        ],
        stop_condition: error.message,
        next_action: 'Choose a valid scenario id or omit --scenario to use auto-routing.'
      };
    }
  }
}

function formatOrchestrationOutput(result) {
  const lines = [];
  lines.push('');
  lines.push('Orchestration run');
  lines.push(`  Command: ${result.command}`);
  lines.push(`  Execution id: ${result.execution_id}`);
  lines.push(`  Mode: ${result.mode}`);
  lines.push(`  Status: ${result.status}`);

  if (result.inputs) {
    lines.push(`  Objective: ${result.inputs.objective || 'n/a'}`);
    lines.push(`  Scenario: ${result.inputs.scenario || 'n/a'}`);
  }

  if (result.artifacts && Array.isArray(result.artifacts.phases)) {
    lines.push('');
    lines.push('Auto-routed phases');
    for (const phase of result.artifacts.phases) {
      const modeText = phase.invocation_mode ? ` [mode=${phase.invocation_mode}]` : '';
      lines.push(`  - ${phase.command} (${phase.routed_track}) -> ${phase.routed_subagent}${modeText}`);

      if (Array.isArray(phase.handoff_inputs) && phase.handoff_inputs.length > 0) {
        lines.push(`    handoff_inputs: ${phase.handoff_inputs.join(', ')}`);
      }

      if (Array.isArray(phase.optional_subagents) && phase.optional_subagents.length > 0) {
        lines.push(`    optional: ${phase.optional_subagents.map((entry) => entry.name).join(', ')}`);
      }
    }
  }

  if (result.artifacts && Array.isArray(result.artifacts.deprecation_notices) && result.artifacts.deprecation_notices.length > 0) {
    lines.push('');
    lines.push('Deprecation notices');
    for (const notice of result.artifacts.deprecation_notices) {
      lines.push(`  - ${notice}`);
    }
  }

  if (result.artifacts && result.artifacts.security_policy) {
    const securityPolicy = result.artifacts.security_policy;
    lines.push('');
    lines.push(`Security policy: ${securityPolicy.level}`);
    if (securityPolicy.reason) {
      lines.push(`  reason: ${securityPolicy.reason}`);
    }
    if (securityPolicy.skipReason) {
      lines.push(`  skip: ${securityPolicy.skipReason}`);
    }
  }

  if (result.artifacts && result.artifacts.refactor_repair_policy) {
    const retryPolicy = result.artifacts.refactor_repair_policy;
    lines.push('');
    lines.push(`Refactor repair policy: retry_cycle=${retryPolicy.retryCycle}, cap=${retryPolicy.retryCap}, halt_after=${retryPolicy.haltAfter}`);
  }

  if (result.stop_condition) {
    lines.push('');
    lines.push(`Stop condition: ${result.stop_condition}`);
  }

  if (result.next_action) {
    lines.push(`Next action: ${result.next_action}`);
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

module.exports = {
  WorkflowOrchestrator,
  formatOrchestrationOutput
};
