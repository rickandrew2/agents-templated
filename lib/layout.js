const path = require('path');
const fs = require('fs-extra');

const LAYOUT = {
  canonical: {
    docsDir: 'agent-docs',
    rulesDir: '.github/instructions/rules',
    skillsDir: '.github/skills',
    subagentsDir: '.claude/agents'
  },
  legacy: {
    rulesDirs: ['agents/rules'],
    skillsDirs: ['agents/skills']
  },
  compatible: {
    rulesDirs: ['.claude/rules', '.github/instructions'],
    skillsDirs: ['.claude/skills', '.agents/skills']
  }
};

function firstExistingPath(baseDir, relativePaths) {
  return relativePaths.find((relPath) => fs.existsSync(path.join(baseDir, relPath))) || null;
}

function resolveRulesDir(baseDir) {
  const candidates = [
    LAYOUT.canonical.rulesDir,
    ...LAYOUT.compatible.rulesDirs,
    ...LAYOUT.legacy.rulesDirs
  ];
  return firstExistingPath(baseDir, candidates) || LAYOUT.canonical.rulesDir;
}

function resolveSkillsDir(baseDir) {
  const candidates = [
    LAYOUT.canonical.skillsDir,
    ...LAYOUT.compatible.skillsDirs,
    ...LAYOUT.legacy.skillsDirs
  ];
  return firstExistingPath(baseDir, candidates) || LAYOUT.canonical.skillsDir;
}

function resolveSubagentsDir(baseDir) {
  const candidates = [LAYOUT.canonical.subagentsDir, 'agents/subagents'];
  return firstExistingPath(baseDir, candidates) || LAYOUT.canonical.subagentsDir;
}

async function hasAnyLayout(baseDir) {
  const checks = [
    path.join(baseDir, LAYOUT.canonical.rulesDir),
    path.join(baseDir, LAYOUT.canonical.skillsDir),
    path.join(baseDir, LAYOUT.canonical.subagentsDir),
    path.join(baseDir, 'agents', 'subagents'),
    ...LAYOUT.compatible.rulesDirs.map((relPath) => path.join(baseDir, relPath)),
    ...LAYOUT.compatible.skillsDirs.map((relPath) => path.join(baseDir, relPath)),
    ...LAYOUT.legacy.rulesDirs.map((relPath) => path.join(baseDir, relPath)),
    ...LAYOUT.legacy.skillsDirs.map((relPath) => path.join(baseDir, relPath))
  ];

  for (const checkPath of checks) {
    if (await fs.pathExists(checkPath)) {
      return true;
    }
  }

  return false;
}

async function getLegacyMigrationPlan(baseDir) {
  const plan = [];

  for (const relPath of LAYOUT.legacy.rulesDirs) {
    const from = path.join(baseDir, relPath);
    if (await fs.pathExists(from)) {
      plan.push({
        type: 'directory',
        source: relPath,
        target: LAYOUT.canonical.rulesDir
      });
    }
  }

  for (const relPath of LAYOUT.legacy.skillsDirs) {
    const from = path.join(baseDir, relPath);
    if (await fs.pathExists(from)) {
      plan.push({
        type: 'directory',
        source: relPath,
        target: LAYOUT.canonical.skillsDir
      });
    }
  }

  return plan;
}

module.exports = {
  LAYOUT,
  resolveRulesDir,
  resolveSkillsDir,
  resolveSubagentsDir,
  hasAnyLayout,
  getLegacyMigrationPlan
};