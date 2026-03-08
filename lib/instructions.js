const path = require('path');
const fs = require('fs-extra');

// CLAUDE.md is the single source of truth. Edit it directly — no generation needed.
const CANONICAL_INSTRUCTION_FILE = 'CLAUDE.md';

// Thin compatibility pointer files — policy lives in CLAUDE.md, not here.
const POINTER_FILES = {
  agents: 'AGENTS.MD',
  copilot: '.github/copilot-instructions.md'
};

function buildAgentsPointer() {
  return [
    '# AGENTS Instructions',
    '',
    '> Primary policy: [`CLAUDE.md`](CLAUDE.md).',
    '> This file is a compatibility pointer. All policy lives in CLAUDE.md.',
    '> If this file and CLAUDE.md conflict, CLAUDE.md wins.'
  ].join('\n');
}

function buildCopilotPointer() {
  return [
    '<!-- Tool profile: copilot-compat -->',
    '# GitHub Copilot Instructions',
    '',
    'Primary policy source: `CLAUDE.md`.',
    'Load policy only from the canonical source file above.',
    'If this file and CLAUDE.md conflict, CLAUDE.md wins.'
  ].join('\n');
}

async function writeGeneratedInstructions(targetDir, templateDir, force = false) {
  // Copy CLAUDE.md from template if not present (or forced)
  const targetClaude = path.join(targetDir, CANONICAL_INSTRUCTION_FILE);
  if (!(await fs.pathExists(targetClaude)) || force) {
    const templateClaude = path.join(templateDir, CANONICAL_INSTRUCTION_FILE);
    await fs.copy(templateClaude, targetClaude);
  }

  // Write thin pointer files
  const pointers = {
    [POINTER_FILES.agents]: buildAgentsPointer(),
    [POINTER_FILES.copilot]: buildCopilotPointer()
  };

  for (const [relPath, content] of Object.entries(pointers)) {
    const targetPath = path.join(targetDir, relPath);
    if (!(await fs.pathExists(targetPath)) || force) {
      await fs.ensureDir(path.dirname(targetPath));
      await fs.writeFile(targetPath, content, 'utf8');
    }
  }
}

async function validateInstructionDrift(targetDir) {
  const claudePath = path.join(targetDir, CANONICAL_INSTRUCTION_FILE);
  if (!(await fs.pathExists(claudePath))) {
    return { ok: false, missingCanonical: true, driftFiles: [] };
  }

  const driftFiles = [];
  const expectedPointers = {
    [POINTER_FILES.agents]: buildAgentsPointer(),
    [POINTER_FILES.copilot]: buildCopilotPointer()
  };

  for (const [relPath, expectedContent] of Object.entries(expectedPointers)) {
    const filePath = path.join(targetDir, relPath);
    if (!(await fs.pathExists(filePath))) {
      driftFiles.push(relPath);
      continue;
    }
    const actual = await fs.readFile(filePath, 'utf8');
    if (actual !== expectedContent) {
      driftFiles.push(relPath);
    }
  }

  return { ok: driftFiles.length === 0, missingCanonical: false, driftFiles };
}

async function scaffoldSkill(targetDir, skillName) {
  const skillDir = path.join(targetDir, 'agents', 'skills', skillName);
  const skillFile = path.join(skillDir, 'SKILL.md');

  if (await fs.pathExists(skillFile)) {
    throw new Error(`Skill already exists: agents/skills/${skillName}/SKILL.md`);
  }

  const title = skillName.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const content = [
    `---`,
    `name: ${skillName}`,
    `description: TODO — describe what this skill does.`,
    `---`,
    ``,
    `# ${title}`,
    ``,
    `## Trigger Conditions`,
    ``,
    `- TODO — when should this skill activate?`,
    ``,
    `## Workflow`,
    ``,
    `1. TODO`,
    ``,
    `## Output Contract`,
    ``,
    `- TODO`,
    ``,
    `## Guardrails`,
    ``,
    `- Do not override security or testing constraints.`,
    ``
  ].join('\n');

  await fs.ensureDir(skillDir);
  await fs.writeFile(skillFile, content, 'utf8');
  return `agents/skills/${skillName}/SKILL.md`;
}

async function scaffoldRule(targetDir, ruleName) {
  const rulesDir = path.join(targetDir, 'agents', 'rules');
  const ruleFile = path.join(rulesDir, `${ruleName}.mdc`);

  if (await fs.pathExists(ruleFile)) {
    throw new Error(`Rule already exists: agents/rules/${ruleName}.mdc`);
  }

  const content = [
    `---`,
    `title: "TODO — Rule Title"`,
    `description: "TODO — describe what this rule enforces."`,
    `version: "1.0.0"`,
    `tags: ["${ruleName}"]`,
    `alwaysApply: false`,
    `---`,
    ``,
    `## Purpose`,
    ``,
    `TODO — explain the purpose of this rule.`,
    ``,
    `## Requirements`,
    ``,
    `1. TODO`,
    ``,
    `## Guardrails`,
    ``,
    `- This rule does not override security or testing constraints.`,
    ``
  ].join('\n');

  await fs.ensureDir(rulesDir);
  await fs.writeFile(ruleFile, content, 'utf8');
  return `agents/rules/${ruleName}.mdc`;
}

async function scaffoldSubagent(targetDir, name) {
  const subagentFile = path.join(targetDir, 'agents', 'subagents', `${name}.md`);

  if (await fs.pathExists(subagentFile)) {
    throw new Error(`Subagent already exists: agents/subagents/${name}.md`);
  }

  const title = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const content = [
    `---`,
    `name: ${name}`,
    `description: TODO — describe when this subagent should activate.`,
    `tools: ["Read", "Grep", "Glob"]`,
    `model: claude-sonnet-4-5`,
    `---`,
    ``,
    `# ${title}`,
    ``,
    `## Activation Conditions`,
    ``,
    `- TODO — when should this subagent activate?`,
    ``,
    `## Workflow`,
    ``,
    `1. TODO`,
    ``,
    `## Output Format`,
    ``,
    `- TODO`,
    ``,
    `## Guardrails`,
    ``,
    `- Do not override security or testing constraints.`,
    ``
  ].join('\n');

  await fs.ensureDir(path.dirname(subagentFile));
  await fs.writeFile(subagentFile, content, 'utf8');
  return `agents/subagents/${name}.md`;
}

module.exports = {
  CANONICAL_INSTRUCTION_FILE,
  POINTER_FILES,
  writeGeneratedInstructions,
  validateInstructionDrift,
  scaffoldSkill,
  scaffoldRule,
  scaffoldSubagent
};