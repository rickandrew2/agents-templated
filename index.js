const fs = require('fs-extra');
const path = require('path');
const { LAYOUT } = require('./lib/layout');
const { CANONICAL_INSTRUCTION_FILE, writeGeneratedInstructions } = require('./lib/instructions');

/**
 * Programmatic API for agents-templated
 * Allows integration into other tools and scripts
 */

/**
 * Copy template files to a target directory
 * @param {string} targetDir - Destination directory
 * @param {Object} options - Installation options
 * @param {boolean} options.docs - Install documentation files
 * @param {boolean} options.rules - Install agent rules
 * @param {boolean} options.skills - Install skills
 * @param {boolean} options.github - Install GitHub Copilot instructions
 * @param {boolean} options.subagents - Install agent subagents
 * @param {boolean} options.force - Overwrite existing files
 * @returns {Promise<void>}
 */
async function install(targetDir, options = {}) {
  const templateDir = path.join(__dirname, 'templates');
  const installAll = !options.docs && !options.rules && !options.skills && !options.github && !options.subagents;

  const files = [];

  // Documentation files
  if (installAll || options.docs) {
    files.push(
      'agent-docs/ARCHITECTURE.md',
      'agent-docs/README.md'
    );
  }

  // Copy files
  for (const file of files) {
    const sourcePath = path.join(templateDir, file);
    const targetPath = path.join(targetDir, file);

    if (await fs.pathExists(sourcePath)) {
      if (await fs.pathExists(targetPath) && !options.force) {
        continue;
      }

      await fs.ensureDir(path.dirname(targetPath));
      await fs.copy(sourcePath, targetPath, { overwrite: options.force });
    }
  }

  // Agent rules
  if (installAll || options.rules) {
    await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.rulesDir));
    await copyDirectory(
      path.join(templateDir, 'agents', 'rules'),
      path.join(targetDir, LAYOUT.canonical.rulesDir),
      options.force
    );
  }

  // Skills
  if (installAll || options.skills) {
    await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.skillsDir));
    await copyDirectory(
      path.join(templateDir, 'agents', 'skills'),
      path.join(targetDir, LAYOUT.canonical.skillsDir),
      options.force
    );
  }

  // AI Agent instructions (Cursor, Copilot, Claude)
  if (installAll || options.github) {
    await writeGeneratedInstructions(targetDir, templateDir, options.force);
  }

  // Agent subagents (.claude/agents/)
  if (installAll || options.subagents) {
    await fs.ensureDir(path.join(targetDir, '.claude', 'agents'));
    await copyDirectory(
      path.join(templateDir, '.claude', 'agents'),
      path.join(targetDir, '.claude', 'agents'),
      options.force
    );
  }
}

async function copyDirectory(sourceDir, targetDir, force = false) {
  if (!(await fs.pathExists(sourceDir))) {
    return;
  }

  const files = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file.name);
    const targetPath = path.join(targetDir, file.name);

    if (file.isDirectory()) {
      await fs.ensureDir(targetPath);
      await copyDirectory(sourcePath, targetPath, force);
    } else {
      if (await fs.pathExists(targetPath) && !force) {
        continue;
      }

      await fs.copy(sourcePath, targetPath, { overwrite: force });
    }
  }
}

module.exports = {
  install
};
