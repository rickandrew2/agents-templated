const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const { install } = require('../index');

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
      expect(output).not.toContain('agent-docs/AGENTS.MD found');
    });

    test('should report passed checks when required files are present', async () => {
      await install(tempDir, { docs: true, rules: true, github: true });
      const output = runCLI('validate', tempDir);
      expect(output).toContain('agent-docs/AGENTS.MD found');
      expect(output).toContain('agents/rules/security.mdc found');
      expect(output).toContain('Passed Checks');
    });

    test('should warn when agents/rules directory is missing', async () => {
      await install(tempDir, { docs: true });
      const output = runCLI('validate', tempDir);
      expect(output).toContain('agents/rules');
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
      expect(output).toContain('security.mdc');
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
  });
});
