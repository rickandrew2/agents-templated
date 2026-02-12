#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

program
  .name('agents-templated')
  .description('Technology-agnostic development template with AI assistant integration')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize agents template in the current directory')
  .option('-a, --all', 'Install all components')
  .option('-d, --docs', 'Install documentation files only')
  .option('-r, --rules', 'Install agent rules only')
  .option('-s, --skills', 'Install skills only')
  .option('-g, --github', 'Install GitHub Copilot instructions')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (options) => {
    try {
      const targetDir = process.cwd();
      const templateDir = path.join(__dirname, '..', 'templates');

      console.log(chalk.blue.bold('\n🤖 Agents Templated - AI-Powered Development Setup\n'));

      let choices = [];
      
      // If no specific options provided, prompt user
      if (!options.all && !options.docs && !options.rules && !options.skills && !options.github) {
        const answers = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'components',
            message: 'Select components to install:',
            choices: [
              { name: 'All components', value: 'all' },
              { name: 'Documentation files (AGENTS.MD, CLAUDE.md, etc.)', value: 'docs' },
              { name: 'Agent rules (agents/rules/*.mdc)', value: 'rules' },
              { name: 'Skills (agents/skills/*)', value: 'skills' },
              { name: 'GitHub Copilot instructions', value: 'github' }
            ],
            default: ['all']
          },
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'Overwrite existing files?',
            default: false,
            when: (answers) => answers.components.length > 0
          }
        ]);

        choices = answers.components;
        options.force = answers.overwrite;
      } else {
        // Use command line options
        if (options.all) choices.push('all');
        if (options.docs) choices.push('docs');
        if (options.rules) choices.push('rules');
        if (options.skills) choices.push('skills');
        if (options.github) choices.push('github');
      }

      const installAll = choices.includes('all');

      // Install documentation files
      if (installAll || choices.includes('docs')) {
        console.log(chalk.yellow('📄 Installing documentation files...'));
        await copyFiles(templateDir, targetDir, [
          'AGENTS.MD',
          'CLAUDE.md',
          'AI_INSTRUCTIONS.md',
          'README.md'
        ], options.force);
      }

      // Install agent rules
      if (installAll || choices.includes('rules')) {
        console.log(chalk.yellow('📋 Installing agent rules...'));
        await fs.ensureDir(path.join(targetDir, 'agents', 'rules'));
        await copyDirectory(
          path.join(templateDir, 'agents', 'rules'),
          path.join(targetDir, 'agents', 'rules'),
          options.force
        );
      }

      // Install skills
      if (installAll || choices.includes('skills')) {
        console.log(chalk.yellow('🎯 Installing skills...'));
        await fs.ensureDir(path.join(targetDir, 'agents', 'skills'));
        await copyDirectory(
          path.join(templateDir, 'agents', 'skills'),
          path.join(targetDir, 'agents', 'skills'),
          options.force
        );
      }

      // Install GitHub Copilot instructions
      if (installAll || choices.includes('github')) {
        console.log(chalk.yellow('🐙 Installing GitHub Copilot instructions...'));
        await fs.ensureDir(path.join(targetDir, '.github'));
        await copyFiles(templateDir, targetDir, [
          '.github/copilot-instructions.md'
        ], options.force);
      }

      console.log(chalk.green.bold('\n✅ Installation complete!\n'));
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.white('  1. Review CLAUDE.md for project guidelines'));
      console.log(chalk.white('  2. Review AGENTS.MD for agent patterns'));
      console.log(chalk.white('  3. Configure your AI assistant (Cursor, Copilot, etc.)'));
      console.log(chalk.white('  4. Adapt the rules to your technology stack\n'));

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available components')
  .action(() => {
    console.log(chalk.blue.bold('\n📦 Available Components:\n'));
    console.log(chalk.yellow('docs') + '    - Documentation files (AGENTS.MD, CLAUDE.md, AI_INSTRUCTIONS.md, README.md)');
    console.log(chalk.yellow('rules') + '   - Agent rules (core, database, frontend, security, testing, style)');
    console.log(chalk.yellow('skills') + '  - Agent skills (find-skills, web-design-guidelines)');
    console.log(chalk.yellow('github') + '  - GitHub Copilot instructions (.github/copilot-instructions.md)');
    console.log(chalk.yellow('all') + '     - All components\n');
  });

async function copyFiles(sourceDir, targetDir, files, force = false) {
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (await fs.pathExists(sourcePath)) {
      if (await fs.pathExists(targetPath) && !force) {
        console.log(chalk.gray(`  ⏭️  Skipping ${file} (already exists)`));
        continue;
      }

      await fs.ensureDir(path.dirname(targetPath));
      await fs.copy(sourcePath, targetPath, { overwrite: force });
      console.log(chalk.green(`  ✓ ${file}`));
    }
  }
}

async function copyDirectory(sourceDir, targetDir, force = false) {
  if (!(await fs.pathExists(sourceDir))) {
    console.log(chalk.gray(`  ⏭️  Directory not found: ${sourceDir}`));
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
        console.log(chalk.gray(`  ⏭️  Skipping ${path.relative(process.cwd(), targetPath)} (already exists)`));
        continue;
      }

      await fs.copy(sourcePath, targetPath, { overwrite: force });
      console.log(chalk.green(`  ✓ ${path.relative(process.cwd(), targetPath)}`));
    }
  }
}

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
