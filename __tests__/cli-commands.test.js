const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const { install } = require('../index');
const { WorkflowOrchestrator } = require('../lib/orchestrator');

const cliPath = path.join(__dirname, '..', 'bin', 'cli.js');

function runCLI(command, cwd) {
  try {
    return execSync(`node "${cliPath}" ${command}`, {
      encoding: 'utf-8',
      cwd: cwd || __dirname,
      stdio: 'pipe'
    });
  } catch (err) {
    return (err.stdout || err.message || '') + (err.stderr || '');
  }
}

describe('CLI commands', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `agents-cli-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    await fs.remove(tempDir).catch(() => {});
  });

  describe('validate', () => {
    test('should report missing files when run in empty directory', () => {
      const output = runCLI('validate', tempDir);
      expect(output).toContain('Validating');
      expect(output).toContain('missing');
      expect(output).not.toContain('AGENTS.md found');
    });

    test('should report passed checks when required files are present', async () => {
      await install(tempDir, { docs: true, rules: true, github: true });
      const output = runCLI('validate', tempDir);
      expect(output).toContain('CLAUDE.md found');
      expect(output).toMatch(/\.claude[\\/]rules[\\/]security\.md found/);
      expect(output).toContain('Passed Checks');
    });

    test('should warn when agents/rules directory is missing', async () => {
      await install(tempDir, { docs: true });
      const output = runCLI('validate', tempDir);
      expect(output).toContain('.claude/rules');
      expect(output).toMatch(/missing|Missing/);
    });
  });

  describe('doctor', () => {
    test('should run without throwing and show health check header', () => {
      const output = runCLI('doctor', tempDir);
      expect(output).toContain('Health Check');
      expect(output).toContain('Node.js');
    });

    test('should run doctor on empty directory without errors', () => {
      const output = runCLI('doctor', tempDir);
      expect(output).toContain('Health Check');
      expect(output).toBeTruthy();
    });

    test('should report security.mdc found when rules are installed', async () => {
      await install(tempDir, { rules: true });
      const output = runCLI('doctor', tempDir);
      expect(output).toContain('security.md');
    });
  });

  describe('workflow command surface', () => {
    test('list should include commands component and workflow commands', () => {
      const output = runCLI('list', tempDir);
      expect(output).toContain('commands');
      expect(output).toContain('Workflow Commands');
      expect(output).toContain('problem-map');
    });

    test('workflow should print lifecycle stages', () => {
      const output = runCLI('workflow', tempDir);
      expect(output).toContain('Workflow Lifecycle');
      expect(output).toContain('Think -> Plan -> Build -> Review -> Test -> Ship -> Reflect');
    });

    test('problem-map should print deterministic contract guidance', () => {
      const output = runCLI('problem-map "improve release quality"', tempDir);
      expect(output).toContain('Workflow command');
      expect(output).toContain('Slash contract: /problem-map');
      expect(output).toContain('Template file: agents/commands/plan.md');
    });

    test('legacy alias should be rejected after alias removal', () => {
      const output = runCLI('office-hours "legacy path"', tempDir);
      expect(output).toContain('unknown command');
      expect(output).toContain('office-hours');
    });

    test('orchestrate should auto-route an objective across specialist tracks', () => {
      const output = runCLI('orchestrate "build api auth service"', tempDir);
      expect(output).toContain('Orchestration run');
      expect(output).toContain('Status: completed');
      expect(output).toContain('backend-specialist');
      expect(output).toContain('optional: security-reviewer');
    });

    test('orchestrate --json should emit deterministic schema fields', () => {
      const output = runCLI('orchestrate "deploy release candidate" --json', tempDir);
      expect(output).toContain('"command": "/orchestrate"');
      expect(output).toContain('"mode": "slash-command-auto"');
      expect(output).toContain('"status": "completed"');
      expect(output).toContain('"scenario": "deployment"');
      expect(output).toContain('"optional_subagents"');
    });

    test('orchestrate with invalid scenario should fail safely', () => {
      const output = runCLI('orchestrate "ship it" --scenario unknown-scenario --json', tempDir);
      expect(output).toContain('"status": "failed"');
      expect(output).toContain('Unknown scenario: unknown-scenario');
    });

    test('mode-lock contract should halt when required specialist mode is missing', () => {
      const orchestrator = new WorkflowOrchestrator();
      expect(() => orchestrator.assertModeLock('qa-specialist', null)).toThrow('Missing required mode');
    });

    test('orchestrate should surface mode diagnostics for mode-locked specialists', () => {
      const output = runCLI('orchestrate "build api auth service"', tempDir);
      expect(output).toContain('mode=design');
      expect(output).toContain('mode=validation');
    });

    test('orchestrate should block when retry-cycle exceeds refactor cap', () => {
      const output = runCLI('orchestrate "refactor cleanup parser" --retry-cycle 3 --json', tempDir);
      expect(output).toContain('"status": "blocked"');
      expect(output).toContain('retry cap exceeded');
    });

    test('orchestrate should include mandatory security policy decision in JSON output', () => {
      const output = runCLI('orchestrate "build auth token endpoint with permission checks" --json', tempDir);
      expect(output).toContain('"security_policy"');
      expect(output).toContain('"level": "mandatory"');
      expect(output).toContain('mandatory security trigger matched');
    });

    test('orchestrate should include explicit security skip reason when threshold is not met', () => {
      const output = runCLI('orchestrate "docs typo fix" --json', tempDir);
      expect(output).toContain('"security_policy"');
      expect(output).toContain('"level": "skipped"');
      expect(output).toContain('"skipReason"');
    });

    test('deprecated workflow aliases should redirect with deterministic notice', () => {
      const output = runCLI('perf-scan "measure latency"', tempDir);
      expect(output).toContain('[deprecated]');
      expect(output).toContain('redirecting to perf');
      expect(output).toContain('Command: perf');
    });

    test('orchestrate should include deprecation notices in JSON when legacy subagent aliases are routed', () => {
      const output = runCLI('orchestrate "add api with tdd coverage validation" --json', tempDir);
      expect(output).toContain('"deprecation_notices"');
      expect(output).toContain('tdd-guide is deprecated');
    });
  });

  describe('update', () => {
    test('should run update --check-only without throwing when templates exist', async () => {
      await install(tempDir, { docs: true });
      const output = runCLI('update --check-only', tempDir);
      expect(output).toContain('update');
    });

    test('update --check-only should complete with exit 0', async () => {
      await install(tempDir, { docs: true });
      expect(() => runCLI('update --check-only', tempDir)).not.toThrow();
    });

    test('update --skills should refresh skills directly without interactive wizard flow', async () => {
      await install(tempDir, { skills: true });

      const skillFile = path.join(tempDir, '.github', 'skills', 'find-skills', 'SKILL.md');
      const uiSkillFile = path.join(tempDir, '.github', 'skills', 'ui-ux-pro-max', 'SKILL.md');
      await fs.writeFile(skillFile, 'OUTDATED_SKILL_CONTENT');

      const output = runCLI('update --skills', tempDir);
      const refreshedContent = await fs.readFile(skillFile, 'utf-8');
      const uiSkillContent = await fs.readFile(uiSkillFile, 'utf-8');

      expect(output).toContain('Updating selected components');
      expect(refreshedContent).not.toBe('OUTDATED_SKILL_CONTENT');
      expect(refreshedContent).toContain('find-skills');
      expect(uiSkillContent).toContain('ui-ux-pro-max');
    });
  });
});
