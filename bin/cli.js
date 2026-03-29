#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { version } = require('../package.json');
const {
  LAYOUT,
  resolveRulesDir,
  resolveSkillsDir,
  resolveSubagentsDir,
  hasAnyLayout,
  getLegacyMigrationPlan
} = require('../lib/layout');
const {
  CANONICAL_INSTRUCTION_FILE,
  POINTER_FILES,
  writeGeneratedInstructions,
  validateInstructionDrift,
  scaffoldSkill,
  scaffoldRule,
  scaffoldSubagent
} = require('../lib/instructions');
const {
  WORKFLOW_COMMANDS,
  CONTRACT_FILES,
  SPECIALIST_CONTRACT_FILES,
  formatWorkflowOutput,
  validateWorkflowDefinitions
} = require('../lib/workflow');

// Resolve the templates directory - works in both dev and installed contexts
const getTemplatesDir = () => {
  const nodeModuleDir = path.join(__dirname, '..', 'templates');
  if (fs.existsSync(nodeModuleDir)) {
    return nodeModuleDir;
  }
  // Fallback for installed global package
  const globalDir = path.join(__dirname, '..', 'lib', 'templates');
  if (fs.existsSync(globalDir)) {
    return globalDir;
  }
  // Final fallback - try relative to__dirname
  return path.resolve(__dirname, '..', 'templates');
};

const program = new Command();
const workflowValidationIssues = validateWorkflowDefinitions();

if (workflowValidationIssues.length > 0) {
  console.error(chalk.red('Invalid workflow command definitions detected:'));
  workflowValidationIssues.forEach((issue) => {
    console.error(chalk.red(`  - ${issue}`));
  });
  process.exit(1);
}

program
  .name('agents-templated')
  .description('Technology-agnostic development template with multi-AI agent support')
  .version(version);

program
  .command('init')
  .description('Initialize agents template in the current directory')
  .option('-a, --all', 'Install all components')
  .option('-d, --docs', 'Install documentation files only')
  .option('-r, --rules', 'Install agent rules only')
  .option('-s, --skills', 'Install skills only')
  .option('-C, --commands', 'Install deterministic command contracts only')
  .option('-g, --github', 'Install GitHub Copilot instructions')
  .option('-S, --subagents', 'Install agent subagents only')
  .option('-p, --preset <name>', 'Use a preset configuration (nextjs, django-react, express-api, fastapi, go-api)')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (options) => {
    try {
      const targetDir = process.cwd();
      const templateDir = getTemplatesDir();

      console.log(chalk.blue.bold('\nAgents Templated - AI-Powered Development Setup\n'));

      // Handle preset option
      if (options.preset) {
        const presetPath = path.join(templateDir, 'presets', `${options.preset}.json`);
        
        if (await fs.pathExists(presetPath)) {
          const preset = await fs.readJson(presetPath);
          console.log(chalk.blue(`📦 Using preset: ${chalk.bold(preset.name)}\n`));
          console.log(chalk.gray(preset.description + '\n'));
          
          // Install all components from preset
          options.all = true;
          options.docs = preset.components.includes('docs');
          options.rules = preset.components.includes('rules');
          options.skills = preset.components.includes('skills');
          options.github = preset.components.includes('github');
          
          // Show tech stack info
          console.log(chalk.cyan('Tech Stack:'));
          Object.entries(preset.techStack).forEach(([key, value]) => {
            console.log(chalk.white(`  ${key}: ${value}`));
          });
          console.log('');
          
          // Show recommended packages
          if (preset.recommendedPackages) {
            console.log(chalk.cyan('Recommended packages to install:'));
            if (Array.isArray(preset.recommendedPackages)) {
              console.log(chalk.gray(`  npm install ${preset.recommendedPackages.join(' ')}`));
            } else {
              Object.entries(preset.recommendedPackages).forEach(([manager, packages]) => {
                if (manager === 'npm') {
                  console.log(chalk.gray(`  npm install ${packages.join(' ')}`));
                } else if (manager === 'python') {
                  console.log(chalk.gray(`  pip install ${packages.join(' ')}`));
                }
              });
            }
            console.log('');
          }
        } else {
          console.log(chalk.red(`Preset "${options.preset}" not found.`));
          console.log(chalk.yellow('Available presets: nextjs, django-react, express-api, fastapi, go-api\n'));
          process.exit(1);
        }
      }

      let choices = [];
      
      // If no specific options provided, prompt user
      if (!options.all && !options.docs && !options.rules && !options.skills && !options.commands && !options.github) {
        const answers = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'components',
            message: 'Select components to install:',
            choices: [
              { name: 'All components', value: 'all' },
              { name: 'Documentation files (agent-docs/)', value: 'docs' },
              { name: 'Agent rules (.claude/rules/*.md)', value: 'rules' },
              { name: 'Skills (.github/skills/*)', value: 'skills' },
              { name: 'Command contracts (agents/commands/*.md)', value: 'commands' },
              { name: 'AI Agent instructions (Cursor, Copilot, Claude, Generic AGENTS)', value: 'github' },
              { name: 'Agent subagents (.claude/agents/*.md)', value: 'subagents' }
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
        if (options.commands) choices.push('commands');
        if (options.github) choices.push('github');
        if (options.subagents) choices.push('subagents');
      }

      const installAll = choices.includes('all');

      // Install documentation files
      if (installAll || choices.includes('docs')) {
        console.log(chalk.yellow('Installing documentation files...'));
        const sourceDir = path.join(templateDir, 'agent-docs');
        const targetDocsDir = path.join(targetDir, 'agent-docs');
        await fs.ensureDir(targetDocsDir);
        await copyDirectory(sourceDir, targetDocsDir, options.force);
      }

      // Install agent rules
      if (installAll || choices.includes('rules')) {
        console.log(chalk.yellow('Installing agent rules...'));
        await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.rulesDir));
        await copyDirectory(
          path.join(templateDir, 'agents', 'rules'),
          path.join(targetDir, LAYOUT.canonical.rulesDir),
          options.force
        );
      }

      // Install skills
      if (installAll || choices.includes('skills')) {
        console.log(chalk.yellow('Installing skills...'));
        await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.skillsDir));
        await copyDirectory(
          path.join(templateDir, 'agents', 'skills'),
          path.join(targetDir, LAYOUT.canonical.skillsDir),
          options.force
        );
      }

      // Install deterministic command contracts
      if (installAll || choices.includes('commands')) {
        console.log(chalk.yellow('Installing command contracts...'));
        await fs.ensureDir(path.join(targetDir, 'agents', 'commands'));
        await copyDirectory(
          path.join(templateDir, 'agents', 'commands'),
          path.join(targetDir, 'agents', 'commands'),
          options.force
        );
      }

      // Install AI Agent instructions (Cursor, Copilot, Claude, Generic AGENTS)
      if (installAll || choices.includes('github')) {
        console.log(chalk.yellow('Installing AI agent instructions...'));
        await writeGeneratedInstructions(targetDir, templateDir, options.force);
        console.log(chalk.gray('  ✓ Claude (CLAUDE.md — canonical source)'));
        console.log(chalk.gray('  ✓ GitHub Copilot (.github/copilot-instructions.md pointer)'));
        console.log(chalk.gray('  ✓ Cursor (.cursorrules pointer)'));
        console.log(chalk.gray('  ✓ Generic AGENTS (AGENTS.MD pointer)'));
      }

      // Install agent subagents
      if (installAll || choices.includes('subagents')) {
        console.log(chalk.yellow('Installing agent subagents...'));
        await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.subagentsDir));
        await copyDirectory(
          path.join(templateDir, '.claude', 'agents'),
          path.join(targetDir, LAYOUT.canonical.subagentsDir),
          options.force
        );
      }

      console.log(chalk.green.bold('\nInstallation complete!\n'));
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.white('  1. Review CLAUDE.md (canonical AI policy — edit this directly)'));
      console.log(chalk.white('  2. Review agent-docs/ARCHITECTURE.md for project guidelines'));
      console.log(chalk.white('  3. AGENTS.MD and .github/copilot-instructions.md are thin compatibility pointers'));
      console.log(chalk.white('  4. Configure your AI assistant (Copilot, Claude, etc.)'));
      console.log(chalk.white('  5. Adapt the rules to your technology stack\n'));

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('wizard')
  .description('Interactive setup wizard')
  .action(async () => {
    try {
      const templateDir = getTemplatesDir();
      const targetDir = process.cwd();
      console.log(chalk.blue.bold('\n🧙 Agents Templated Setup Wizard\n'));
      console.log(chalk.gray('Let\'s set up your project with the right patterns and guidelines.\n'));

      const hasExistingSetup = await hasInstalledTemplates(targetDir);
      if (hasExistingSetup) {
        console.log(chalk.cyan('Detected an existing agents-templated setup in this project.\n'));

        const modeAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'mode',
            message: 'How would you like to proceed?',
            choices: [
              { name: 'Update existing setup (recommended)', value: 'update' },
              { name: 'Run full setup flow', value: 'setup' }
            ],
            default: 'update'
          }
        ]);

        if (modeAnswer.mode === 'update') {
          const updateAnswers = await inquirer.prompt([
            {
              type: 'checkbox',
              name: 'components',
              message: 'Select components to update:',
              choices: [
                { name: 'All components', value: 'all', checked: true },
                { name: 'Documentation (agent-docs/)', value: 'docs' },
                { name: 'Agent Rules (security, testing, database, etc.)', value: 'rules' },
                { name: 'Skills (reusable agent capabilities)', value: 'skills' },
                { name: 'Command contracts (agents/commands/*.md)', value: 'commands' },
                { name: 'AI Agent instructions (Cursor, Copilot, Claude, Generic AGENTS)', value: 'github' },
                { name: 'Agent subagents (.claude/agents/*.md)', value: 'subagents' }
              ],
              validate: (answer) => {
                if (answer.length === 0) {
                  return 'You must choose at least one component.';
                }
                return true;
              }
            },
            {
              type: 'confirm',
              name: 'overwrite',
              message: 'Overwrite existing files while updating?',
              default: true
            }
          ]);

          console.log(chalk.blue('\n📦 Updating selected components...\n'));
          await updateSelectedComponents(targetDir, templateDir, updateAnswers.components, updateAnswers.overwrite);

          console.log(chalk.green.bold('\n✅ Update complete!\n'));
          console.log(chalk.gray('Tip: run "agents-templated validate" to verify your setup.\n'));
          return;
        }
      }

      // Component selection
      const componentAnswers = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'components',
          message: 'Select components to install:',
          choices: [
            { name: 'Documentation (agent-docs/)', value: 'docs', checked: true },
            { name: 'Agent Rules (security, testing, database, etc.)', value: 'rules', checked: true },
            { name: 'Skills (reusable agent capabilities)', value: 'skills', checked: true },
            { name: 'Command contracts (agents/commands/*.md)', value: 'commands', checked: true },
            { name: 'AI Agent instructions (Cursor, Copilot, Claude, Generic AGENTS)', value: 'github', checked: true },
            { name: 'Agent subagents (.claude/agents/*.md)', value: 'subagents', checked: true }
          ],
          validate: (answer) => {
            if (answer.length === 0) {
              return 'You must choose at least one component.';
            }
            return true;
          }
        },
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Overwrite existing files?',
          default: false
        }
      ]);

      // Step 3: Install components
      console.log(chalk.blue('\n📦 Installing components...\n'));
      
      const options = {
        force: componentAnswers.overwrite,
        docs: componentAnswers.components.includes('docs'),
        rules: componentAnswers.components.includes('rules'),
        skills: componentAnswers.components.includes('skills'),
        commands: componentAnswers.components.includes('commands'),
        github: componentAnswers.components.includes('github'),
        subagents: componentAnswers.components.includes('subagents')
      };

      // Install documentation files
      if (options.docs) {
        console.log(chalk.yellow('Installing documentation files...'));
        const sourceDocsDir = path.join(templateDir, 'agent-docs');
        const targetDocsDir = path.join(targetDir, 'agent-docs');
        await fs.ensureDir(targetDocsDir);
        await copyDirectory(sourceDocsDir, targetDocsDir, options.force);
      }

      // Install agent rules
      if (options.rules) {
        console.log(chalk.yellow('Installing agent rules...'));
        await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.rulesDir));
        await copyDirectory(
          path.join(templateDir, 'agents', 'rules'),
          path.join(targetDir, LAYOUT.canonical.rulesDir),
          options.force
        );
      }

      // Install skills
      if (options.skills) {
        console.log(chalk.yellow('Installing skills...'));
        await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.skillsDir));
        await copyDirectory(
          path.join(templateDir, 'agents', 'skills'),
          path.join(targetDir, LAYOUT.canonical.skillsDir),
          options.force
        );
      }

      // Install deterministic command contracts
      if (options.commands) {
        console.log(chalk.yellow('Installing command contracts...'));
        await fs.ensureDir(path.join(targetDir, 'agents', 'commands'));
        await copyDirectory(
          path.join(templateDir, 'agents', 'commands'),
          path.join(targetDir, 'agents', 'commands'),
          options.force
        );
      }

      // Install AI Agent instructions (Cursor, Copilot, Claude, Generic AGENTS)
      if (options.github) {
        console.log(chalk.yellow('Installing AI agent instructions...'));
        await writeGeneratedInstructions(targetDir, templateDir, options.force);
        console.log(chalk.gray('  ✓ Claude (CLAUDE.md — canonical source)'));
        console.log(chalk.gray('  ✓ GitHub Copilot (.github/copilot-instructions.md pointer)'));
        console.log(chalk.gray('  ✓ Generic AGENTS (AGENTS.MD pointer)'));
      }

      // Install agent subagents
      if (options.subagents) {
        console.log(chalk.yellow('Installing agent subagents...'));
        await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.subagentsDir));
        await copyDirectory(
          path.join(templateDir, '.claude', 'agents'),
          path.join(targetDir, LAYOUT.canonical.subagentsDir),
          options.force
        );
      }

      // Show summary and next steps
      console.log(chalk.green.bold('\n✅ Installation complete!\n'));
      
      console.log(chalk.cyan('\n📚 Next Steps:\n'));
      console.log(chalk.white('   1. Review CLAUDE.md (canonical AI policy — edit this directly)'));
      console.log(chalk.white('   2. Review agent-docs/ARCHITECTURE.md for project guidelines'));
      console.log(chalk.white('   3. AGENTS.MD and .github/copilot-instructions.md are thin pointers to CLAUDE.md'));
      console.log(chalk.white('   4. Customize .claude/rules/*.md for your tech stack'));
      
      console.log(chalk.cyan('\n🔒 Security Reminder:\n'));
      console.log(chalk.white('   • Review .claude/rules/security.md'));
      console.log(chalk.white('   • Validate all inputs with schema validation'));
      console.log(chalk.white('   • Implement rate limiting on public endpoints'));
      console.log(chalk.white('   • Never expose sensitive data in errors\n'));

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available components and presets')
  .action(() => {
    console.log(chalk.blue.bold('\nAvailable Components:\n'));
    console.log(chalk.yellow('docs') + '    - Documentation files (agent-docs/ directory)');
    console.log(chalk.yellow('rules') + '   - Agent rules (.claude/rules/*.md)');
    console.log(chalk.yellow('skills') + '  - Agent skills (.github/skills/*)');
    console.log(chalk.yellow('commands') + ' - Deterministic command contracts (agents/commands/*.md)');
    console.log(chalk.yellow('github') + '  - AI Agent instructions (Cursor, Copilot, Claude, Generic AGENTS)');
    console.log(chalk.yellow('subagents') + ' - Agent subagents (.claude/agents/*.md)');
    console.log(chalk.yellow('all') + '     - All components');

    console.log(chalk.blue.bold('\n\nWorkflow Commands:\n'));
    WORKFLOW_COMMANDS.forEach(({ cli, specialist, description }) => {
      console.log(chalk.cyan(cli) + ` - ${specialist}: ${description}`);
    });
    
    console.log(chalk.blue.bold('\n\nAvailable Presets:\n'));
    console.log(chalk.cyan('nextjs') + '       - Next.js with TypeScript, React, and Tailwind CSS');
    console.log(chalk.cyan('django-react') + ' - Django REST Framework backend with React frontend');
    console.log(chalk.cyan('express-api') + '  - RESTful API with Express.js and TypeScript');
    console.log(chalk.cyan('fastapi') + '      - Modern Python API with FastAPI');
    console.log(chalk.cyan('go-api') + '       - High-performance API with Go and Gin');
    
    console.log(chalk.gray('\nUsage: agents-templated init --preset=<name>\n'));
  });

program
  .command('validate')
  .description('Validate your project setup and configuration')
  .action(async () => {
    try {
      const targetDir = process.cwd();
      console.log(chalk.blue.bold('\n🔍 Validating Project Setup...\n'));

      let issues = [];
      let warnings = [];
      let passed = [];

      // Check canonical instruction file
      const claudePath = path.join(targetDir, CANONICAL_INSTRUCTION_FILE);
      if (await fs.pathExists(claudePath)) {
        passed.push(`✓ ${CANONICAL_INSTRUCTION_FILE} found (canonical policy source)`);
      } else {
        warnings.push(`⚠ ${CANONICAL_INSTRUCTION_FILE} missing - run 'agents-templated init --github'`);
      }

      const docFiles = ['ARCHITECTURE.md'];
      const docsDir = path.join(targetDir, 'agent-docs');
      
      if (await fs.pathExists(docsDir)) {
        for (const file of docFiles) {
          if (await fs.pathExists(path.join(docsDir, file))) {
            passed.push(`✓ agent-docs/${file} found`);
          } else {
            warnings.push(`⚠ agent-docs/${file} missing`);
          }
        }
      } else {
        warnings.push(`⚠ agent-docs directory missing - run 'agents-templated init --docs'`);
      }

      // Check agent rules
      const ruleFiles = ['core.md', 'security.md', 'testing.md', 'lessons-learned.md', 'frontend.md', 'database.md', 'style.md'];
      const canonicalRulesDir = path.join(targetDir, LAYOUT.canonical.rulesDir);
      const legacyRulesDir = path.join(targetDir, LAYOUT.legacy.rulesDirs[0]);
      const rulesDir = path.join(targetDir, resolveRulesDir(targetDir));

      if (!(await fs.pathExists(canonicalRulesDir)) && await fs.pathExists(legacyRulesDir)) {
        issues.push(`✗ Legacy rules layout detected at ${LAYOUT.legacy.rulesDirs[0]} - run 'agents-templated update --all' to migrate`);
      }

      if (await fs.pathExists(rulesDir)) {
        const relativeRulesDir = path.relative(targetDir, rulesDir) || LAYOUT.canonical.rulesDir;
        for (const file of ruleFiles) {
          if (await fs.pathExists(path.join(rulesDir, file))) {
            passed.push(`✓ ${relativeRulesDir}/${file} found`);
          } else {
            warnings.push(`⚠ ${relativeRulesDir}/${file} missing`);
          }
        }
      } else {
        warnings.push(`⚠ ${LAYOUT.canonical.rulesDir} directory missing - run 'agents-templated init --rules'`);
      }

      // Check skills
      const canonicalSkillsDir = path.join(targetDir, LAYOUT.canonical.skillsDir);
      const legacySkillsDir = path.join(targetDir, LAYOUT.legacy.skillsDirs[0]);
      const skillsDir = path.join(targetDir, resolveSkillsDir(targetDir));

      if (!(await fs.pathExists(canonicalSkillsDir)) && await fs.pathExists(legacySkillsDir)) {
        issues.push(`✗ Legacy skills layout detected at ${LAYOUT.legacy.skillsDirs[0]} - run 'agents-templated update --all' to migrate`);
      }

      if (await fs.pathExists(skillsDir)) {
        const skills = await fs.readdir(skillsDir);
        const relativeSkillsDir = path.relative(targetDir, skillsDir) || LAYOUT.canonical.skillsDir;
        passed.push(`✓ ${skills.length} skills installed in ${relativeSkillsDir}`);
      } else {
        warnings.push(`⚠ ${LAYOUT.canonical.skillsDir} directory missing - run 'agents-templated init --skills'`);
      }

      const commandsDir = path.join(targetDir, 'agents', 'commands');
      if (await fs.pathExists(commandsDir)) {
        for (const contractFile of CONTRACT_FILES) {
          const contractPath = path.join(commandsDir, contractFile);
          if (await fs.pathExists(contractPath)) {
            passed.push(`✓ agents/commands/${contractFile} found`);
          } else {
            warnings.push(`⚠ agents/commands/${contractFile} missing`);
          }
        }

        for (const contractFile of SPECIALIST_CONTRACT_FILES) {
          const contractPath = path.join(commandsDir, contractFile);
          if (await fs.pathExists(contractPath)) {
            passed.push(`✓ agents/commands/${contractFile} found`);
          } else {
            warnings.push(`⚠ agents/commands/${contractFile} missing`);
          }
        }
      } else {
        warnings.push(`⚠ agents/commands directory missing - run 'agents-templated init --commands'`);
      }

      // Check subagents
      const subagentsDir = path.join(targetDir, LAYOUT.canonical.subagentsDir);
      if (await fs.pathExists(subagentsDir)) {
        const subagents = (await fs.readdir(subagentsDir)).filter(f => f.endsWith('.md') && f !== 'README.md');
        passed.push(`✓ ${subagents.length} subagents installed in ${LAYOUT.canonical.subagentsDir}`);
      } else {
        warnings.push(`⚠ ${LAYOUT.canonical.subagentsDir} directory missing - run 'agents-templated init --subagents'`);
      }

      // Check instruction pointer files and drift
      const instructionDrift = await validateInstructionDrift(targetDir);
      if (instructionDrift.missingCanonical) {
        issues.push(`✗ CLAUDE.md missing - run 'agents-templated init --github'`);
      } else if (instructionDrift.driftFiles.length > 0) {
        warnings.push(`⚠ Pointer files out of sync: ${instructionDrift.driftFiles.join(', ')} — run 'agents-templated update --github'`);
      } else {
        passed.push('✓ AGENTS.MD and .github/copilot-instructions.md are in sync');
      }

      const compatCopilotFile = path.join(targetDir, POINTER_FILES.copilot);
      if (await fs.pathExists(compatCopilotFile)) {
        passed.push(`✓ GitHub Copilot configuration found`);
      } else {
        warnings.push(`⚠ GitHub Copilot configuration missing - run 'agents-templated init --github'`);
      }

      // Check for .gitignore
      const gitignore = path.join(targetDir, '.gitignore');
      if (await fs.pathExists(gitignore)) {
        passed.push(`✓ .gitignore file found`);
        
        // Check for common security patterns in .gitignore
        const gitignoreContent = await fs.readFile(gitignore, 'utf-8');
        const securityPatterns = ['.env', '*.key', '*.pem', 'secrets'];
        const missingPatterns = securityPatterns.filter(pattern => 
          !gitignoreContent.includes(pattern)
        );
        
        if (missingPatterns.length > 0) {
          warnings.push(`⚠ .gitignore missing security patterns: ${missingPatterns.join(', ')}`);
        } else {
          passed.push(`✓ .gitignore includes security patterns`);
        }
      } else {
        issues.push(`✗ .gitignore file missing - create one to prevent committing secrets`);
      }

      // Check for package.json (Node.js projects)
      const packageJson = path.join(targetDir, 'package.json');
      if (await fs.pathExists(packageJson)) {
        passed.push(`✓ package.json found (Node.js project)`);
        
        const pkg = await fs.readJson(packageJson);
        
        // Check for test script
        if (pkg.scripts && pkg.scripts.test && !pkg.scripts.test.includes('no test')) {
          passed.push(`✓ Test script configured`);
        } else {
          warnings.push(`⚠ No test script configured in package.json`);
        }
        
        // Check for common security packages
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (allDeps['zod'] || allDeps['joi'] || allDeps['yup']) {
          passed.push(`✓ Schema validation package detected`);
        } else {
          warnings.push(`⚠ Consider adding schema validation (zod, joi, yup)`);
        }
      }

      // Display results
      console.log(chalk.green.bold('Passed Checks:\n'));
      passed.forEach(msg => console.log(chalk.green(`  ${msg}`)));

      if (warnings.length > 0) {
        console.log(chalk.yellow.bold('\nWarnings:\n'));
        warnings.forEach(msg => console.log(chalk.yellow(`  ${msg}`)));
      }

      if (issues.length > 0) {
        console.log(chalk.red.bold('\nIssues:\n'));
        issues.forEach(msg => console.log(chalk.red(`  ${msg}`)));
      }

      // Summary
      console.log(chalk.blue.bold('\n📊 Summary:\n'));
      console.log(chalk.white(`  ${chalk.green(passed.length)} passed`));
      console.log(chalk.white(`  ${chalk.yellow(warnings.length)} warnings`));
      console.log(chalk.white(`  ${chalk.red(issues.length)} issues`));

      if (issues.length === 0 && warnings.length === 0) {
        console.log(chalk.green.bold('\n🎉 Your project setup looks great!\n'));
      } else if (issues.length === 0) {
        console.log(chalk.yellow.bold('\n✨ Your project is set up, but there are some recommendations above.\n'));
      } else {
        console.log(chalk.red.bold('\n⚠️  Please address the issues above.\n'));
        process.exit(1);
      }

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

async function copyFiles(sourceDir, targetDir, files, force = false) {
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (await fs.pathExists(sourcePath)) {
      if (await fs.pathExists(targetPath) && !force) {
        console.log(chalk.gray(`  Skipping ${file} (already exists)`));
        continue;
      }

      await fs.ensureDir(path.dirname(targetPath));
      await fs.copy(sourcePath, targetPath, { overwrite: force });
      console.log(chalk.green(`  + ${file}`));
    }
  }
}

async function copyDirectory(sourceDir, targetDir, force = false) {
  if (!(await fs.pathExists(sourceDir))) {
    console.log(chalk.gray(`  Directory not found: ${sourceDir}`));
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
        console.log(chalk.gray(`  Skipping ${path.relative(process.cwd(), targetPath)} (already exists)`));
        continue;
      }

      await fs.copy(sourcePath, targetPath, { overwrite: force });
      console.log(chalk.green(`  + ${path.relative(process.cwd(), targetPath)}`));
    }
  }
}

async function hasInstalledTemplates(targetDir) {
  return await hasAnyLayout(targetDir) ||
    await fs.pathExists(path.join(targetDir, CANONICAL_INSTRUCTION_FILE)) ||
    await fs.pathExists(path.join(targetDir, POINTER_FILES.agents));
}

async function cleanupLegacyInstructionFiles(targetDir) {
  // Files removed in v2.0.0: orphaned wrappers that contained duplicated policy
  // content and were not managed/validated by the generator.
  const legacyFiles = [
    '.github/instructions/AGENTS.md',
    // Pre-v1.2.13 paths
    '.claude/CLAUDE.md'
  ];

  for (const file of legacyFiles) {
    const filePath = path.join(targetDir, file);
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      console.log(chalk.green(`  ✓ Removed legacy file: ${file}`));
    }
  }

  // Remove deprecated directory if it is now empty.
  const legacyInstructionsDir = path.join(targetDir, '.github', 'instructions');
  if (await fs.pathExists(legacyInstructionsDir)) {
    const entries = await fs.readdir(legacyInstructionsDir);
    if (entries.length === 0) {
      await fs.remove(legacyInstructionsDir);
      console.log(chalk.green('  ✓ Removed legacy directory: .github/instructions/'));
    }
  }
}

async function updateSelectedComponents(targetDir, templateDir, selectedComponents, overwrite = true) {
  const components = selectedComponents.includes('all')
    ? ['docs', 'rules', 'skills', 'commands', 'github', 'subagents']
    : selectedComponents;

  if (components.includes('docs')) {
    console.log(chalk.yellow('Updating documentation files...'));
    await fs.ensureDir(path.join(targetDir, 'agent-docs'));
    await copyDirectory(
      path.join(templateDir, 'agent-docs'),
      path.join(targetDir, 'agent-docs'),
      overwrite
    );
  }

  if (components.includes('rules')) {
    console.log(chalk.yellow('Updating agent rules...'));
    await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.rulesDir));
    await copyDirectory(
      path.join(templateDir, 'agents', 'rules'),
      path.join(targetDir, LAYOUT.canonical.rulesDir),
      overwrite
    );
  }

  if (components.includes('skills')) {
    console.log(chalk.yellow('Updating skills...'));
    await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.skillsDir));
    await copyDirectory(
      path.join(templateDir, 'agents', 'skills'),
      path.join(targetDir, LAYOUT.canonical.skillsDir),
      overwrite
    );
  }

  if (components.includes('commands')) {
    console.log(chalk.yellow('Updating command contracts...'));
    await fs.ensureDir(path.join(targetDir, 'agents', 'commands'));
    await copyDirectory(
      path.join(templateDir, 'agents', 'commands'),
      path.join(targetDir, 'agents', 'commands'),
      overwrite
    );
  }

  if (components.includes('github')) {
    console.log(chalk.yellow('Updating AI agent instructions...'));
    await writeGeneratedInstructions(targetDir, templateDir, overwrite);
    await cleanupLegacyInstructionFiles(targetDir);
  }

  if (components.includes('subagents')) {
    console.log(chalk.yellow('Updating agent subagents...'));
    await fs.ensureDir(path.join(targetDir, LAYOUT.canonical.subagentsDir));
    await copyDirectory(
      path.join(templateDir, '.claude', 'agents'),
      path.join(targetDir, LAYOUT.canonical.subagentsDir),
      overwrite
    );
  }

  if ((components.includes('docs') || components.includes('github')) && !components.includes('github')) {
    await writeGeneratedInstructions(targetDir, templateDir, overwrite);
  }
}

async function applyLegacyMigrationPlan(targetDir, migrationPlan, overwrite = true) {
  for (const move of migrationPlan) {
    const sourcePath = path.join(targetDir, move.source);
    const targetPath = path.join(targetDir, move.target);

    if (!(await fs.pathExists(sourcePath))) {
      continue;
    }

    await fs.ensureDir(path.dirname(targetPath));

    if (await fs.pathExists(targetPath)) {
      await copyDirectory(sourcePath, targetPath, overwrite);
      await fs.remove(sourcePath);
      continue;
    }

    await fs.move(sourcePath, targetPath, { overwrite });
  }
}

program
  .command('update')
  .description('Check for and apply template updates')
  .option('-a, --all', 'Update all components (docs, rules, skills, github)')
  .option('-d, --docs', 'Update documentation files only')
  .option('-r, --rules', 'Update agent rules only')
  .option('-s, --skills', 'Update skills only')
  .option('-C, --commands', 'Update deterministic command contracts only')
  .option('-g, --github', 'Update AI agent instruction files only')
  .option('-S, --subagents', 'Update agent subagents only')
  .option('-c, --check-only', 'Only check for updates, don\'t install')
  .option('-f, --force', 'Force overwrite files during update')
  .action(async (options) => {
    try {
      const targetDir = process.cwd();
      const templateDir = getTemplatesDir();
      
      console.log(chalk.blue.bold('\n🔄 Checking for template updates...\n'));

      // Check if templates are installed
      const hasTemplates = await hasInstalledTemplates(targetDir);

      if (!hasTemplates) {
        console.log(chalk.yellow('No templates detected in this directory.'));
        console.log(chalk.gray('Run "agents-templated init" first.\n'));
        process.exit(0);
      }

      const migrationPlan = await getLegacyMigrationPlan(targetDir);
      if (migrationPlan.length > 0) {
        console.log(chalk.yellow('Legacy layout detected. Migration to canonical Copilot-style paths is required.\n'));
        migrationPlan.forEach(({ source, target }) => {
          console.log(chalk.white(`  ${source}  ->  ${target}`));
        });
        console.log('');

        if (options.checkOnly) {
          console.log(chalk.red('Migration required before validation can pass.'));
          console.log(chalk.gray('Run "agents-templated update" and confirm migration.\n'));
          process.exit(1);
        }

        const migrationAnswer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: 'Migrate legacy directories now?',
            default: true
          }
        ]);

        if (!migrationAnswer.proceed) {
          console.log(chalk.red('\nMigration skipped. Setup remains non-canonical.\n'));
          process.exit(1);
        }

        await applyLegacyMigrationPlan(targetDir, migrationPlan, true);
        console.log(chalk.green('✓ Legacy layout migration completed.\n'));
      }

      const hasComponentSelection = options.all || options.docs || options.rules || options.skills || options.commands || options.github || options.subagents;

      // Component refresh mode: update selected parts directly without stack/wizard prompts
      if (hasComponentSelection) {
        const selectedComponents = [];
        if (options.all || options.docs) selectedComponents.push('docs');
        if (options.all || options.rules) selectedComponents.push('rules');
        if (options.all || options.skills) selectedComponents.push('skills');
        if (options.all || options.commands) selectedComponents.push('commands');
        if (options.all || options.github) selectedComponents.push('github');
        if (options.all || options.subagents) selectedComponents.push('subagents');

        console.log(chalk.blue('📦 Updating selected components...\n'));

        await updateSelectedComponents(targetDir, templateDir, selectedComponents, true);

        console.log(chalk.green.bold('\n✅ Selected component updates applied successfully!\n'));
        process.exit(0);
      }

      // List potential updates
      const updates = [];
      const checkFiles = [
        { targetFile: CANONICAL_INSTRUCTION_FILE, templateFile: CANONICAL_INSTRUCTION_FILE, component: 'root' },
        { targetFile: 'agent-docs/ARCHITECTURE.md', templateFile: 'agent-docs/ARCHITECTURE.md', component: 'docs' },
        { targetFile: `${LAYOUT.canonical.rulesDir}/security.md`, templateFile: 'agents/rules/security.md', component: 'rules' },
        { targetFile: `${LAYOUT.canonical.rulesDir}/testing.md`, templateFile: 'agents/rules/testing.md', component: 'rules' },
        { targetFile: `${LAYOUT.canonical.rulesDir}/lessons-learned.md`, templateFile: 'agents/rules/lessons-learned.md', component: 'rules' },
        { targetFile: `${LAYOUT.canonical.rulesDir}/core.md`, templateFile: 'agents/rules/core.md', component: 'rules' },
        { targetFile: `${LAYOUT.canonical.skillsDir}/README.md`, templateFile: 'agents/skills/README.md', component: 'skills' },
        { targetFile: `${LAYOUT.canonical.skillsDir}/find-skills/SKILL.md`, templateFile: 'agents/skills/find-skills/SKILL.md', component: 'skills' },
        { targetFile: `${LAYOUT.canonical.skillsDir}/error-patterns/SKILL.md`, templateFile: 'agents/skills/error-patterns/SKILL.md', component: 'skills' },
        { targetFile: `${LAYOUT.canonical.skillsDir}/ui-ux-pro-max/SKILL.md`, templateFile: 'agents/skills/ui-ux-pro-max/SKILL.md', component: 'skills' },
        { targetFile: `${LAYOUT.canonical.skillsDir}/shadcn-ui/SKILL.md`, templateFile: 'agents/skills/shadcn-ui/SKILL.md', component: 'skills' },
        { targetFile: 'agents/commands/SCHEMA.md', templateFile: 'agents/commands/SCHEMA.md', component: 'commands' },
        { targetFile: 'agents/commands/README.md', templateFile: 'agents/commands/README.md', component: 'commands' }
      ];

      for (const {targetFile, templateFile, component} of checkFiles) {
        const targetPath = path.join(targetDir, targetFile);
        const templatePath = path.join(templateDir, templateFile);
        
        if (await fs.pathExists(targetPath) && await fs.pathExists(templatePath)) {
          const targetContent = await fs.readFile(targetPath, 'utf8');
          const templateContent = await fs.readFile(templatePath, 'utf8');
          
          if (targetContent !== templateContent) {
            updates.push({ targetFile, templateFile, component });
          }
        }
      }

      if (updates.length === 0) {
        console.log(chalk.green('✅ All templates are up to date!\n'));
        process.exit(0);
      }

      console.log(chalk.yellow(`Found ${updates.length} file(s) with updates available:\n`));
      updates.forEach(({ targetFile }) => {
        console.log(chalk.white(`  📄 ${targetFile}`));
      });
      console.log('');

      if (options.checkOnly) {
        console.log(chalk.cyan('To apply updates, run: agents-templated update\n'));
        process.exit(0);
      }

      // Prompt to apply updates
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Apply these updates?',
          default: false
        }
      ]);

      if (!answer.proceed) {
        console.log(chalk.gray('\nUpdate cancelled.\n'));
        process.exit(0);
      }

      // Apply updates
      console.log(chalk.blue('\n📦 Applying updates...\n'));
      
      for (const { targetFile, templateFile } of updates) {
        const targetPath = path.join(targetDir, targetFile);
        const templatePath = path.join(templateDir, templateFile);
        
        // Backup original file
        const backupPath = `${targetPath}.backup`;
        await fs.copy(targetPath, backupPath);
        console.log(chalk.gray(`  Backed up: ${targetFile}.backup`));
        
        // Copy new version
        await fs.copy(templatePath, targetPath, { overwrite: true });
        console.log(chalk.green(`  ✓ Updated: ${targetFile}`));
      }

      await writeGeneratedInstructions(targetDir, templateDir, true);
      console.log(chalk.green('  ✓ Regenerated instruction compatibility files'));
      await cleanupLegacyInstructionFiles(targetDir);

      console.log(chalk.green.bold('\n✅ Updates applied successfully!\n'));
      console.log(chalk.gray('Backup files created with .backup extension\n'));

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('doctor')
  .description('Diagnose common issues and provide recommendations')
  .alias('check')
  .action(async () => {
    try {
      const targetDir = process.cwd();
      const templateDir = getTemplatesDir();
      console.log(chalk.blue.bold('\n🩺 Running Project Health Check...\n'));

      let recommendations = [];

      // Check Node.js version
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      if (majorVersion < 14) {
        recommendations.push({
          type: 'critical',
          message: `Node.js ${nodeVersion} is outdated. Upgrade to Node.js 18+ for best compatibility.`
        });
      } else if (majorVersion < 18) {
        recommendations.push({
          type: 'warning',
          message: `Node.js ${nodeVersion} works but consider upgrading to Node.js 18+ LTS.`
        });
      } else {
        console.log(chalk.green(`✓ Node.js ${nodeVersion} (good)`));
      }

      // Check for common pitfalls
      const packageJson = path.join(targetDir, 'package.json');
      if (await fs.pathExists(packageJson)) {
        const pkg = await fs.readJson(packageJson);
        
        // Check for outdated dependencies
        if (pkg.dependencies) {
          const deps = Object.keys(pkg.dependencies);
          console.log(chalk.green(`✓ ${deps.length} dependencies found`));
          
          // Check for missing type definitions
          if (deps.includes('express') && !pkg.devDependencies?.['@types/express']) {
            recommendations.push({
              type: 'info',
              message: 'Consider adding @types/express for better TypeScript support'
            });
          }
        }
      }

      // Check AI assistant configs
      const configs = [
        { file: '.github/copilot-instructions.md', name: 'GitHub Copilot' }
      ];

      for (const config of configs) {
        if (await fs.pathExists(path.join(targetDir, config.file))) {
          console.log(chalk.green(`✓ ${config.name} configuration found`));
        }
      }

      // Display recommendations
      if (recommendations.length > 0) {
        console.log(chalk.blue.bold('\n💡 Recommendations:\n'));
        
        recommendations.forEach(rec => {
          const icon = rec.type === 'critical' ? '🔴' : rec.type === 'warning' ? '⚠️' : 'ℹ️';
          const color = rec.type === 'critical' ? chalk.red : rec.type === 'warning' ? chalk.yellow : chalk.cyan;
          console.log(color(`  ${icon} ${rec.message}`));
        });
      } else {
        console.log(chalk.green.bold('\n✅ Everything looks healthy!\n'));
      }

      console.log(chalk.blue('\n📚 Quick Tips:\n'));
      console.log(chalk.white('  • Run "agents-templated validate" to check setup'));
      console.log(chalk.white('  • Run "agents-templated wizard" for guided setup'));
      console.log(chalk.white('  • Review .claude/rules/security.md for security patterns\n'));

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('workflow')
  .description('Show the lifecycle workflow and specialist commands')
  .alias('sprint')
  .action(() => {
    console.log(chalk.blue.bold('\nWorkflow Lifecycle\n'));
    console.log(chalk.white('Think -> Plan -> Build -> Review -> Test -> Ship -> Reflect\n'));
    WORKFLOW_COMMANDS.forEach(({ cli, specialist, slash, description }) => {
      console.log(chalk.cyan(cli) + ` (${slash})`);
      console.log(chalk.gray(`  ${specialist} - ${description}`));
    });
    console.log(chalk.gray('\nRun any workflow command with an objective, for example:'));
    console.log(chalk.white('  agents-templated problem-map "daily briefing app for founders"\n'));
  });

for (const workflow of WORKFLOW_COMMANDS) {
  program
    .command(`${workflow.cli} [objective...]`)
    .description(`${workflow.specialist}: ${workflow.description}`)
    .action((objective) => {
      const objectiveText = Array.isArray(objective) ? objective.join(' ') : '';
      process.stdout.write(formatWorkflowOutput(workflow, objectiveText));
    });
}

program
  .command('new-skill <name>')
  .description('Scaffold a new skill in .github/skills/<name>/SKILL.md')
  .action(async (name) => {
    try {
      const targetDir = process.cwd();
      const relPath = await scaffoldSkill(targetDir, name);
      console.log(chalk.green(`\n+ ${relPath}\n`));
      console.log(chalk.gray('Fill in Trigger Conditions, Workflow, and Output Contract.'));
      console.log(chalk.gray('Then add it to the Reference Index in CLAUDE.md.\n'));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('new-rule <name>')
  .description('Scaffold a new rule in .claude/rules/<name>.md')
  .action(async (name) => {
    try {
      const targetDir = process.cwd();
      const relPath = await scaffoldRule(targetDir, name);
      console.log(chalk.green(`\n+ ${relPath}\n`));
      console.log(chalk.gray('Fill in Purpose and Requirements sections.'));
      console.log(chalk.gray('Then add it to the Reference Index in CLAUDE.md.\n'));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('new-subagent <name>')
  .description('Scaffold a new subagent in .claude/agents/<name>.md')
  .action(async (name) => {
    try {
      const targetDir = process.cwd();
      const relPath = await scaffoldSubagent(targetDir, name);
      console.log(chalk.green(`\n+ ${relPath}\n`));
      console.log(chalk.gray('Fill in Activation Conditions, Workflow, and Output Format.'));
      console.log(chalk.gray('Then add it to the Subagent modules table in CLAUDE.md.\n'));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
