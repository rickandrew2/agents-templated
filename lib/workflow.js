const WORKFLOW_COMMANDS = [
  {
    cli: 'problem-map',
    slash: '/problem-map',
    purpose: 'problem-framing',
    track: 'planning',
    specialist: 'Problem Strategist',
    contract: 'plan.md',
    description: 'Clarify user pain and define the real problem before implementation.'
  },
  {
    cli: 'scope-shape',
    slash: '/scope-shape',
    purpose: 'scope-decision',
    track: 'planning',
    specialist: 'Scope Director',
    contract: 'plan.md',
    description: 'Challenge scope and lock the highest-leverage direction.'
  },
  {
    cli: 'arch-check',
    slash: '/arch-check',
    purpose: 'architecture-readiness',
    track: 'backend',
    specialist: 'Architecture Reviewer',
    contract: 'plan.md',
    description: 'Lock architecture, edge cases, and test strategy before build.'
  },
  {
    cli: 'ux-bar',
    slash: '/ux-bar',
    purpose: 'ux-quality-readiness',
    track: 'frontend',
    specialist: 'Design Quality Lead',
    contract: 'plan.md',
    description: 'Assess UX quality and close design gaps before implementation.'
  },
  {
    cli: 'debug-track',
    slash: '/debug-track',
    purpose: 'root-cause-investigation',
    track: 'qa',
    specialist: 'Root-Cause Investigator',
    contract: 'fix.md',
    description: 'Reproduce issues and isolate root cause before applying fixes.'
  },
  {
    cli: 'risk-review',
    slash: '/risk-review',
    purpose: 'release-risk-assessment',
    track: 'release-ops',
    specialist: 'Release Risk Reviewer',
    contract: 'audit.md',
    description: 'Run a production-risk review on active changes.'
  },
  {
    cli: 'perf',
    slash: '/perf',
    purpose: 'performance-optimization-and-regression-check',
    track: 'performance',
    specialist: 'Performance Analyst',
    contract: 'perf.md',
    description: 'Optimize performance and validate baseline-vs-candidate regression safety.'
  },
  {
    cli: 'test-data',
    slash: '/test-data',
    purpose: 'test-data-asset-preparation',
    track: 'test-data',
    specialist: 'Test Data Builder',
    contract: 'test.md',
    description: 'Prepare deterministic fixtures, seeds, and synthetic datasets for downstream validation.'
  },
  {
    cli: 'release-ready',
    slash: '/release-ready',
    purpose: 'release-readiness',
    track: 'deployment',
    specialist: 'Release Coordinator',
    contract: 'release.md',
    description: 'Prepare release branch, tests, and release checklist artifacts.'
  },
  {
    cli: 'docs',
    slash: '/docs',
    purpose: 'documentation-update-and-synchronization',
    track: 'release-ops',
    specialist: 'Documentation Engineer',
    contract: 'docs.md',
    description: 'Update and synchronize README and architecture docs to match shipped behavior.'
  },
  {
    cli: 'learn-loop',
    slash: '/learn-loop',
    purpose: 'retrospective-action-loop',
    track: 'release-ops',
    specialist: 'Iteration Lead',
    contract: 'task.md',
    description: 'Capture wins, misses, and next-cycle improvements.'
  }
];

const ORCHESTRATION_TRACKS = {
  planning: {
    subagent: 'planner',
    skills: ['feature-delivery', 'feature-forge'],
    goal: 'Clarify objective and lock scope before implementation.'
  },
  backend: {
    subagent: 'backend-specialist',
    skills: ['secure-code-guardian', 'feature-delivery', 'bug-triage'],
    goal: 'Design and implement API/data/server-side logic.'
  },
  frontend: {
    subagent: 'frontend-specialist',
    skills: ['ui-ux-pro-max', 'emilkowalski-skill', 'raphaelsalaja-userinterface-wiki'],
    goal: 'Design and implement UI, accessibility, and interactions.'
  },
  qa: {
    subagent: 'qa-specialist',
    skills: ['debug-skill', 'bug-triage'],
    goal: 'Verify quality gates, regression checks, and issue triage.'
  },
  'qa-design': {
    subagent: 'qa-specialist',
    skills: ['debug-skill', 'bug-triage'],
    goal: 'Design test strategy before implementation starts.'
  },
  performance: {
    subagent: 'performance-specialist',
    skills: ['debug-skill', 'bug-triage'],
    goal: 'Diagnose bottlenecks and validate load thresholds.'
  },
  'test-data': {
    subagent: 'test-data-builder',
    skills: ['bug-triage', 'feature-delivery'],
    goal: 'Build deterministic data assets for downstream validation and load checks.'
  },
  'release-ops': {
    subagent: 'release-ops-specialist',
    skills: ['app-hardening', 'secure-code-guardian'],
    goal: 'Harden release, validate risk posture, and synchronize docs.'
  },
  deployment: {
    subagent: 'deployment-specialist',
    skills: ['app-hardening', 'secure-code-guardian'],
    goal: 'Prepare and validate deployment execution plans.'
  }
};

const ORCHESTRATION_SCENARIOS = [
  {
    id: 'feature-delivery',
    description: 'End-to-end feature lifecycle from framing to release.',
    keywords: ['feature', 'build', 'implement', 'add', 'create'],
    phases: [
      { command: 'problem-map', track: 'planning' },
      { command: 'scope-shape', track: 'planning' },
      { command: 'scope-shape', track: 'qa-design' },
      { command: 'test-data', track: 'test-data' },
      { command: 'arch-check', track: 'backend' },
      { command: 'ux-bar', track: 'frontend' },
      { command: 'debug-track', track: 'qa' },
      { command: 'perf', track: 'performance' },
      { command: 'risk-review', track: 'release-ops' },
      { command: 'release-ready', track: 'deployment' },
      { command: 'docs', track: 'release-ops' }
    ]
  },
  {
    id: 'backend-api',
    description: 'API and backend-focused changes with risk checks.',
    keywords: ['api', 'backend', 'service', 'database', 'endpoint'],
    phases: [
      { command: 'problem-map', track: 'planning' },
      { command: 'problem-map', track: 'qa-design' },
      { command: 'arch-check', track: 'backend' },
      { command: 'test-data', track: 'test-data' },
      { command: 'debug-track', track: 'qa' },
      { command: 'perf', track: 'performance' },
      { command: 'risk-review', track: 'release-ops' },
      { command: 'release-ready', track: 'deployment' }
    ]
  },
  {
    id: 'frontend-feature',
    description: 'UI-focused delivery with quality and release gates.',
    keywords: ['frontend', 'ui', 'ux', 'design', 'component'],
    phases: [
      { command: 'problem-map', track: 'planning' },
      { command: 'scope-shape', track: 'planning' },
      { command: 'scope-shape', track: 'qa-design' },
      { command: 'test-data', track: 'test-data' },
      { command: 'ux-bar', track: 'frontend' },
      { command: 'debug-track', track: 'qa' },
      { command: 'perf', track: 'performance' },
      { command: 'risk-review', track: 'release-ops' },
      { command: 'release-ready', track: 'deployment' }
    ]
  },
  {
    id: 'bug-fix',
    description: 'Defect-focused sequence with regression protection.',
    keywords: ['bug', 'fix', 'issue', 'error', 'regression'],
    phases: [
      { command: 'debug-track', track: 'qa' },
      { command: 'perf', track: 'performance' },
      { command: 'arch-check', track: 'backend' },
      { command: 'risk-review', track: 'release-ops' },
      { command: 'release-ready', track: 'deployment' }
    ]
  },
  {
    id: 'deployment',
    description: 'Deployment-focused path with risk and release checks.',
    keywords: ['deploy', 'deployment', 'ship', 'release', 'production'],
    phases: [
      { command: 'risk-review', track: 'release-ops' },
      { command: 'perf', track: 'performance' },
      { command: 'release-ready', track: 'deployment' },
      { command: 'docs', track: 'release-ops' },
      { command: 'learn-loop', track: 'release-ops' }
    ]
  }
];

const OPTIONAL_SUBAGENT_RULES = [
  {
    subagent: 'architect',
    required: false,
    reason: 'Deep architecture trade-off analysis support.',
    when: {
      commands: ['arch-check'],
      keywords: ['architecture', 'design', 'scalability', 'adr']
    }
  },
  {
    subagent: 'tdd-guide',
    required: false,
    reason: 'Test-first guidance when explicit test strategy is requested.',
    deprecatedAliasFor: 'qa-specialist',
    mode: 'design',
    when: {
      tracks: ['backend', 'frontend', 'qa'],
      keywords: ['test', 'tdd', 'coverage', 'unit test']
    }
  },
  {
    subagent: 'test-data-builder',
    required: false,
    reason: 'Prepare deterministic fixtures and seed data for downstream validation phases.',
    when: {
      tracks: ['qa-design', 'backend', 'test-data'],
      keywords: ['test data', 'fixture', 'seed', 'mock', 'dataset', 'migration', 'database']
    }
  },
  {
    subagent: 'code-reviewer',
    required: false,
    reason: 'Static quality review before release risk checkpoints.',
    when: {
      commands: ['risk-review'],
      scenarios: ['feature-delivery', 'bug-fix', 'deployment']
    }
  },
  {
    subagent: 'security-reviewer',
    required: false,
    reason: 'Security audit for auth, secrets, and sensitive data paths.',
    when: {
      tracks: ['backend', 'release-ops', 'deployment'],
      keywords: ['auth', 'token', 'secret', 'security', 'permission', 'pii']
    }
  },
  {
    subagent: 'build-error-resolver',
    required: false,
    reason: 'Targeted build/type/lint failure remediation.',
    when: {
      scenarios: ['bug-fix'],
      keywords: ['build', 'type', 'compile', 'lint', 'error']
    }
  },
  {
    subagent: 'e2e-runner',
    required: false,
    reason: 'E2E execution for journey-level validation after test data handoff.',
    dependsOnSubagents: ['test-data-builder'],
    when: {
      tracks: ['qa', 'frontend'],
      keywords: ['e2e', 'playwright', 'journey', 'end-to-end', 'validation']
    }
  },
  {
    subagent: 'refactor-cleaner',
    required: false,
    reason: 'Safe dead-code cleanup and refactor hygiene pass.',
    when: {
      keywords: ['refactor', 'cleanup', 'dead code', 'unused']
    }
  },
  {
    subagent: 'doc-updater',
    required: false,
    reason: 'Documentation synchronization for release and handoff.',
    when: {
      commands: ['docs']
    }
  },
  {
    subagent: 'performance-specialist',
    required: false,
    reason: 'Performance bottleneck profiling for latency/resource risks.',
    mode: 'profile',
    when: {
      tracks: ['performance'],
      keywords: ['performance', 'latency', 'memory', 'cpu', 'slow', 'profile']
    }
  },
  {
    subagent: 'dependency-auditor',
    required: false,
    reason: 'Dependency and CVE hygiene audit.',
    when: {
      tracks: ['backend', 'release-ops', 'deployment'],
      keywords: ['dependency', 'package', 'cve', 'vulnerability', 'upgrade']
    }
  },
  {
    subagent: 'configuration-validator',
    required: false,
    reason: 'Configuration and environment safety validation.',
    deprecatedAliasFor: 'deployment-specialist',
    mode: 'config-validation',
    when: {
      scenarios: ['deployment'],
      keywords: ['config', 'environment', 'env', 'settings']
    }
  },
  {
    subagent: 'database-migrator',
    required: false,
    reason: 'Schema/data migration planning and rollback checks.',
    when: {
      tracks: ['backend'],
      keywords: ['database', 'schema', 'migration', 'sql']
    }
  },
  {
    subagent: 'performance-specialist',
    required: false,
    reason: 'Load and stress validation near release/deployment phases after test data handoff.',
    mode: 'load',
    dependsOnSubagents: ['test-data-builder'],
    when: {
      tracks: ['performance', 'deployment'],
      keywords: ['load', 'throughput', 'stress', 'traffic']
    }
  },
  {
    subagent: 'compatibility-checker',
    required: false,
    reason: 'Contract and version compatibility checks for API changes.',
    when: {
      tracks: ['backend', 'release-ops'],
      keywords: ['compatibility', 'breaking', 'contract', 'api version']
    }
  }
];

const CONTRACT_FILES = [
  'SCHEMA.md',
  'README.md',
  'plan.md',
  'task.md',
  'fix.md',
  'audit.md',
  'perf.md',
  'test.md',
  'pr.md',
  'release.md',
  'docs.md'
];

const SPECIALIST_CONTRACT_FILES = [
  'problem-map.md',
  'scope-shape.md',
  'arch-check.md',
  'ux-bar.md',
  'debug-track.md',
  'test-data.md',
  'risk-review.md',
  'release-ready.md',
  'learn-loop.md'
];

const DEPRECATED_COMMAND_ALIASES = [
  {
    from: 'quality-gate',
    to: 'risk-review',
    status: 'deprecated',
    notice: 'quality-gate is deprecated; redirecting to risk-review.'
  },
  {
    from: 'perf-scan',
    to: 'perf',
    status: 'deprecated',
    notice: 'perf-scan is deprecated; redirecting to perf.'
  },
  {
    from: 'docs-sync',
    to: 'docs',
    status: 'deprecated',
    notice: 'docs-sync is deprecated; redirecting to docs.'
  }
];

const DEPRECATED_SUBAGENT_ALIASES = {
  'tdd-guide': {
    to: 'qa-specialist',
    mode: 'design',
    notice: 'tdd-guide is deprecated; redirecting to qa-specialist(mode=design).'
  },
  'performance-profiler': {
    to: 'performance-specialist',
    mode: 'profile',
    notice: 'performance-profiler is deprecated; redirecting to performance-specialist(mode=profile).'
  },
  'load-tester': {
    to: 'performance-specialist',
    mode: 'load',
    notice: 'load-tester is deprecated; redirecting to performance-specialist(mode=load).'
  },
  'configuration-validator': {
    to: 'deployment-specialist',
    mode: 'config-validation',
    notice: 'configuration-validator is deprecated; redirecting to deployment-specialist(mode=config-validation).'
  }
};

const NON_OVERLAP_ROUTE_BOUNDARIES = {
  backendResolutionSubagents: ['build-error-resolver', 'compatibility-checker', 'database-migrator'],
  reviewSequence: ['code-reviewer', 'dependency-auditor', 'doc-updater'],
  commandAllowlist: {
    'arch-check': [
      'architect',
      'security-reviewer',
      'build-error-resolver',
      'compatibility-checker',
      'database-migrator',
      'test-data-builder'
    ],
    'risk-review': ['code-reviewer', 'dependency-auditor', 'security-reviewer', 'compatibility-checker'],
    docs: ['doc-updater', 'security-reviewer']
  }
};

const MODE_LOCKED_SPECIALISTS = {
  'qa-specialist': ['design', 'validation'],
  'performance-specialist': ['profile', 'load']
};

const SECURITY_REVIEW_POLICY = {
  mandatoryKeywords: [
    'auth',
    'authorization',
    'session',
    'token',
    'permission',
    'public endpoint',
    'parser',
    'secret',
    'credential',
    'cve',
    'vulnerability',
    'breaking',
    'api contract',
    'production',
    'threat surface',
    'pii'
  ],
  mediumKeywords: [
    'input',
    'transform',
    'middleware',
    'integration',
    'upload',
    'request',
    'external'
  ],
  mediumThreshold: 3
};

const REFACTOR_BUILD_RETRY_CAP = 2;
const REFACTOR_BUILD_HALT_AFTER = REFACTOR_BUILD_RETRY_CAP + 1;

function findScenarioById(id) {
  if (!id) {
    return null;
  }

  return ORCHESTRATION_SCENARIOS.find((scenario) => scenario.id === id) || null;
}

function resolveScenarioFromObjective(objective) {
  const normalizedObjective = (objective || '').toLowerCase();
  let bestScenario = ORCHESTRATION_SCENARIOS[0];
  let bestScore = -1;

  for (const scenario of ORCHESTRATION_SCENARIOS) {
    let score = 0;
    for (const keyword of scenario.keywords) {
      if (normalizedObjective.includes(keyword)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScenario = scenario;
      bestScore = score;
    }
  }

  return {
    scenario: bestScenario,
    reason: bestScore > 0
      ? `matched ${bestScore} scenario keyword(s)`
      : 'defaulted to feature-delivery because no scenario keywords matched'
  };
}

function formatWorkflowOutput(workflow, objective) {
  const trimmedObjective = (objective || '').trim();
  const goal = trimmedObjective.length > 0 ? trimmedObjective : 'No explicit objective provided';

  return [
    '',
    'Workflow command',
    `  Command: ${workflow.cli}`,
    `  Slash contract: ${workflow.slash}`,
    `  Specialist: ${workflow.specialist}`,
    `  Objective: ${goal}`,
    '',
    'Execution contract',
    `  Template file: agents/commands/${workflow.contract}`,
    '  Mode: deterministic structured output only',
    '  Safety: destructive actions require CONFIRM-DESTRUCTIVE:<target>',
    '',
    'Recommended next actions',
    '  1. Ensure command contracts are installed: agents-templated init --commands',
    '  2. Open agents/commands/README.md and follow the contract sections',
    '  3. Use agents-templated workflow to see the full sprint sequence',
    ''
  ].join('\n');
}

function validateWorkflowDefinitions() {
  const seenCli = new Set();
  const seenSlash = new Set();
  const seenPurpose = new Set();
  const seenScenarioIds = new Set();
  const seenOptionalSubagentRule = new Set();
  const issues = [];

  for (const workflow of WORKFLOW_COMMANDS) {
    if (seenCli.has(workflow.cli)) {
      issues.push(`Duplicate cli command: ${workflow.cli}`);
    }
    seenCli.add(workflow.cli);

    if (seenSlash.has(workflow.slash)) {
      issues.push(`Duplicate slash command: ${workflow.slash}`);
    }
    seenSlash.add(workflow.slash);

    if (!workflow.purpose) {
      issues.push(`Missing purpose for command: ${workflow.cli}`);
    } else if (seenPurpose.has(workflow.purpose)) {
      issues.push(`Duplicate command purpose: ${workflow.purpose}`);
    }
    seenPurpose.add(workflow.purpose);
  }

  for (const alias of DEPRECATED_COMMAND_ALIASES) {
    if (seenCli.has(alias.from)) {
      issues.push(`Alias conflicts with active command name: ${alias.from}`);
    }
  }

  for (const scenario of ORCHESTRATION_SCENARIOS) {
    if (seenScenarioIds.has(scenario.id)) {
      issues.push(`Duplicate orchestration scenario id: ${scenario.id}`);
    }
    seenScenarioIds.add(scenario.id);

    for (const phase of scenario.phases) {
      if (!seenCli.has(phase.command)) {
        issues.push(`Scenario ${scenario.id} references unknown command: ${phase.command}`);
      }

      if (!ORCHESTRATION_TRACKS[phase.track]) {
        issues.push(`Scenario ${scenario.id} references unknown track: ${phase.track}`);
      }
    }
  }

  for (const rule of OPTIONAL_SUBAGENT_RULES) {
    const key = JSON.stringify({
      subagent: rule.subagent,
      when: rule.when || {},
      mode: rule.mode || null,
      deprecatedAliasFor: rule.deprecatedAliasFor || null,
      dependsOnSubagents: rule.dependsOnSubagents || []
    });
    if (seenOptionalSubagentRule.has(key)) {
      issues.push(`Duplicate optional subagent rule: ${rule.subagent}`);
    }
    seenOptionalSubagentRule.add(key);

    if (rule.required !== false) {
      issues.push(`Optional subagent rule must remain non-required: ${rule.subagent}`);
    }
  }

  return issues;
}

module.exports = {
  WORKFLOW_COMMANDS,
  ORCHESTRATION_TRACKS,
  ORCHESTRATION_SCENARIOS,
  OPTIONAL_SUBAGENT_RULES,
  DEPRECATED_SUBAGENT_ALIASES,
  NON_OVERLAP_ROUTE_BOUNDARIES,
  MODE_LOCKED_SPECIALISTS,
  SECURITY_REVIEW_POLICY,
  REFACTOR_BUILD_RETRY_CAP,
  REFACTOR_BUILD_HALT_AFTER,
  CONTRACT_FILES,
  SPECIALIST_CONTRACT_FILES,
  DEPRECATED_COMMAND_ALIASES,
  findScenarioById,
  resolveScenarioFromObjective,
  formatWorkflowOutput,
  validateWorkflowDefinitions
};