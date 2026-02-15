const fs = require('fs-extra');
const path = require('path');
const { install } = require('../index');
const os = require('os');

describe('agents-templated API', () => {
  let tempDir;

  beforeEach(async () => {
    // Create a temporary directory for each test
    tempDir = path.join(os.tmpdir(), `agents-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    // Clean up temporary directory
    await fs.remove(tempDir);
  });

  describe('install()', () => {
    test('should install all components when no options specified', async () => {
      await install(tempDir, {});

      // Check documentation files
      expect(await fs.pathExists(path.join(tempDir, 'AGENTS.md'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'agent-docs/ARCHITECTURE.md'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'agent-docs/ARCHITECTURE.md'))).toBe(true);

      // Check rules
      expect(await fs.pathExists(path.join(tempDir, 'agents/rules/core.mdc'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'agents/rules/security.mdc'))).toBe(true);

      // Check skills
      expect(await fs.pathExists(path.join(tempDir, 'agents/skills/find-skills/SKILL.md'))).toBe(true);

      // Check all AI agent config files
      expect(await fs.pathExists(path.join(tempDir, '.cursorrules'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, '.github/copilot-instructions.md'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'CLAUDE.md'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'GEMINI.md'))).toBe(true);
    });

    test('should install only documentation when docs option is true', async () => {
      await install(tempDir, { docs: true });

      // Check documentation files exist
      expect(await fs.pathExists(path.join(tempDir, 'AGENTS.md'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'agent-docs/ARCHITECTURE.md'))).toBe(true);

      // Check rules don't exist
      expect(await fs.pathExists(path.join(tempDir, 'agents/rules/core.mdc'))).toBe(false);
    });

    test('should install only rules when rules option is true', async () => {
      await install(tempDir, { rules: true });

      // Check rules exist
      expect(await fs.pathExists(path.join(tempDir, 'agents/rules/core.mdc'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'agents/rules/security.mdc'))).toBe(true);

      // Check documentation doesn't exist
      expect(await fs.pathExists(path.join(tempDir, 'AGENTS.md'))).toBe(false);
    });

    test('should install only skills when skills option is true', async () => {
      await install(tempDir, { skills: true });

      // Check skills exist
      expect(await fs.pathExists(path.join(tempDir, 'agents/skills/find-skills/SKILL.md'))).toBe(true);

      // Check documentation doesn't exist
      expect(await fs.pathExists(path.join(tempDir, 'agent-docs'))).toBe(false);
    });

    test('should install AI agent configs (Cursor, Copilot, Claude, Gemini) when github option is true', async () => {
      await install(tempDir, { github: true });

      // Check all AI agent config files exist
      expect(await fs.pathExists(path.join(tempDir, '.cursorrules'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, '.github/copilot-instructions.md'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'CLAUDE.md'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'GEMINI.md'))).toBe(true);

      // Check documentation doesn't exist
      expect(await fs.pathExists(path.join(tempDir, 'agent-docs'))).toBe(false);
    });

    test('should not overwrite existing files without force option', async () => {
      const testFile = path.join(tempDir, 'AGENTS.md');
      const originalContent = '# Original Content';
      
      await fs.ensureDir(path.join(tempDir, '.'));
      await fs.writeFile(testFile, originalContent);
      await install(tempDir, { docs: true, force: false });

      const content = await fs.readFile(testFile, 'utf-8');
      expect(content).toBe(originalContent);
    });

    test('should overwrite existing files with force option', async () => {
      const testFile = path.join(tempDir, 'AGENTS.md');
      const originalContent = '# Original Content';
      
      await fs.ensureDir(path.join(tempDir, '.'));
      await fs.writeFile(testFile, originalContent);
      await install(tempDir, { docs: true, force: true });

      const content = await fs.readFile(testFile, 'utf-8');
      expect(content).not.toBe(originalContent);
      expect(content.length).toBeGreaterThan(0);
    });

    test('should handle multiple options together', async () => {
      await install(tempDir, { docs: true, rules: true, force: false });

      // Check documentation exists
      expect(await fs.pathExists(path.join(tempDir, 'AGENTS.md'))).toBe(true);

      // Check rules exist
      expect(await fs.pathExists(path.join(tempDir, 'agents/rules/core.mdc'))).toBe(true);

      // Check skills don't exist (not specified)
      expect(await fs.pathExists(path.join(tempDir, 'agents/skills'))).toBe(false);
    });

    test('should create necessary directories', async () => {
      await install(tempDir, { rules: true });

      expect(await fs.pathExists(path.join(tempDir, 'agents'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'agents/rules'))).toBe(true);
    });

    test('should handle non-existent target directory', async () => {
      const nonExistentDir = path.join(tempDir, 'nested/new/dir');
      
      await expect(install(nonExistentDir, { docs: true })).resolves.not.toThrow();
      expect(await fs.pathExists(path.join(nonExistentDir, 'AGENTS.md'))).toBe(true);
    });
  });
});
