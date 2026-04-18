const { WorkflowOrchestrator } = require('../lib/orchestrator');

describe('WorkflowOrchestrator runtime policy', () => {
  let orchestrator;

  beforeEach(() => {
    orchestrator = new WorkflowOrchestrator();
  });

  test('should assign explicit modes for mode-locked specialists', () => {
    const result = orchestrator.orchestrate({ objective: 'build api auth service' });

    expect(result.status).toBe('completed');

    const qaModes = result.artifacts.phases
      .filter((phase) => phase.routed_subagent === 'qa-specialist')
      .map((phase) => phase.invocation_mode);

    expect(qaModes).toContain('design');
    expect(qaModes).toContain('validation');

    const performancePhase = result.artifacts.phases
      .find((phase) => phase.routed_subagent === 'performance-specialist');

    expect(performancePhase).toBeDefined();
    expect(performancePhase.invocation_mode).toBe('load');
  });

  test('should require security reviewer when mandatory threshold is hit', () => {
    const result = orchestrator.orchestrate({ objective: 'build auth token flow with permission checks' });

    expect(result.status).toBe('completed');
    expect(result.artifacts.security_policy.level).toBe('mandatory');

    const hasRequiredSecurityInvocation = result.artifacts.phases.some((phase) =>
      phase.optional_subagents.some((subagent) => subagent.name === 'security-reviewer' && subagent.required === true)
    );

    expect(hasRequiredSecurityInvocation).toBe(true);
  });

  test('should emit explicit skip reason when security threshold is not met', () => {
    const result = orchestrator.orchestrate({ objective: 'update docs formatting only' });

    expect(result.status).toBe('completed');
    expect(result.artifacts.security_policy.level).toBe('skipped');
    expect(result.artifacts.security_policy.skipReason).toContain('no mandatory trigger');
  });

  test('should block when refactor retry cap is exceeded', () => {
    const result = orchestrator.orchestrate({
      objective: 'refactor cleanup core parser module',
      retryCycle: 3
    });

    expect(result.status).toBe('blocked');
    expect(result.stop_condition).toContain('retry cap exceeded');
  });

  test('should route load mode explicitly for performance specialist after test-data handoff', () => {
    const result = orchestrator.orchestrate({
      objective: 'run load throughput validation for deployment rollout',
      scenarioId: 'deployment'
    });

    expect(result.status).toBe('completed');

    const performancePhase = result.artifacts.phases.find((phase) => phase.routed_subagent === 'performance-specialist');

    expect(performancePhase).toBeDefined();
    expect(performancePhase.invocation_mode).toBe('load');
  });

  test('should include test-data phase and downstream handoff metadata', () => {
    const result = orchestrator.orchestrate({ objective: 'build backend feature with fixture seed dataset' });

    expect(result.status).toBe('completed');

    const hasTestDataPhase = result.artifacts.phases.some((phase) => phase.routed_subagent === 'test-data-builder');
    expect(hasTestDataPhase).toBe(true);

    const hasHandoffInput = result.artifacts.phases.some((phase) =>
      Array.isArray(phase.handoff_inputs) && phase.handoff_inputs.includes('test-data-builder')
    );
    expect(hasHandoffInput).toBe(true);
  });

  test('should preserve code-review then dependency order on risk-review boundary chain', () => {
    const result = orchestrator.orchestrate({ objective: 'risk review dependency upgrade for release' });
    expect(result.status).toBe('completed');

    const riskPhase = result.artifacts.phases.find((phase) => phase.command === 'risk-review');
    expect(riskPhase).toBeDefined();

    const names = riskPhase.optional_subagents.map((entry) => entry.name);
    const codeReviewerIndex = names.indexOf('code-reviewer');
    const dependencyAuditorIndex = names.indexOf('dependency-auditor');

    expect(codeReviewerIndex).toBeGreaterThanOrEqual(0);
    expect(dependencyAuditorIndex).toBeGreaterThanOrEqual(0);
    expect(codeReviewerIndex).toBeLessThan(dependencyAuditorIndex);
  });

  test('should emit deprecated subagent redirect notices when legacy aliases are used', () => {
    const result = orchestrator.orchestrate({ objective: 'add api with tdd coverage validation' });
    expect(result.status).toBe('completed');

    expect(Array.isArray(result.artifacts.deprecation_notices)).toBe(true);
    expect(result.artifacts.deprecation_notices.join(' | ')).toContain('tdd-guide is deprecated');
  });
});
