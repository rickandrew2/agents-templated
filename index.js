const fs = require('fs-extra');
const path = require('path');

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
 * @param {boolean} options.force - Overwrite existing files
 * @returns {Promise<void>}
 */
async function install(targetDir, options = {}) {
  const templateDir = path.join(__dirname, 'templates');
  const installAll = !options.docs && !options.rules && !options.skills && !options.github;

  const files = [];

  // Documentation files
  if (installAll || options.docs) {
    files.push(
      'AGENTS.md',
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
    await fs.ensureDir(path.join(targetDir, 'agents', 'rules'));
    await copyDirectory(
      path.join(templateDir, 'agents', 'rules'),
      path.join(targetDir, 'agents', 'rules'),
      options.force
    );
  }

  // Skills
  if (installAll || options.skills) {
    await fs.ensureDir(path.join(targetDir, 'agents', 'skills'));
    await copyDirectory(
      path.join(templateDir, 'agents', 'skills'),
      path.join(targetDir, 'agents', 'skills'),
      options.force
    );
  }

  // AI Agent instructions (Cursor, Copilot, Claude, Gemini)
  if (installAll || options.github) {
    await fs.ensureDir(path.join(targetDir, '.github'));
    
    // Copy all AI agent config files
    const agentConfigs = [
      '.cursorrules',
      'CLAUDE.md',
      'GEMINI.md'
    ];
    
    for (const config of agentConfigs) {
      const sourcePath = path.join(templateDir, config);
      const targetPath = path.join(targetDir, config);
      
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath, { overwrite: options.force });
      }
    }
    
    // Copy GitHub Copilot instructions
    const sourceGithubPath = path.join(templateDir, '.github', 'copilot-instructions.md');
    const targetGithubPath = path.join(targetDir, '.github', 'copilot-instructions.md');
    
    if (await fs.pathExists(sourceGithubPath)) {
      await fs.copy(sourceGithubPath, targetGithubPath, { overwrite: options.force });
    }
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
