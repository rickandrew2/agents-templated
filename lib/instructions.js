const path = require('path');
const fs = require('fs-extra');

const CORE_SOURCE_REL_PATH = 'instructions/source/core.md';

const GENERATED_INSTRUCTION_PATHS = {
  canonical: {
    generic: '.github/instructions/AGENTS.md'
  },
  compatibility: {
    generic: 'AGENTS.MD',
    copilot: '.github/copilot-instructions.md',
    claude: 'CLAUDE.md',
    cursor: '.cursorrules'
  }
};

// Files that MUST NOT exist — legacy/orphaned files that contain or may contain
// duplicated policy content. Their presence is reported as a violation by validateInstructionDrift.
const KNOWN_ORPHAN_PATHS = [
  '.github/instructions/CLAUDE.md',
  '.github/instructions/GEMINI.md',
  '.github/instructions/agents.instructions.md',
  '.github/instructions/copilot-instructions.md',
  '.claude/rules/claude.instructions.md',
  'GEMINI.md'
];

function getLegacyCoreCandidates() {
  return ['AGENTS.MD', 'AGENTS.md'];
}

function buildHeaders(toolName) {
  return [
    '<!-- GENERATED FILE - DO NOT EDIT DIRECTLY -->',
    `<!-- Source of truth: ${CORE_SOURCE_REL_PATH} -->`,
    `<!-- Tool profile: ${toolName} -->`,
    ''
  ].join('\n');
}

function buildCompatInstruction(toolName, corePath) {
  const titles = {
    generic: '# AGENTS Instructions',
    copilot: '# GitHub Copilot Instructions',
    claude: '# Claude Instructions',
    cursor: '# Cursor Rules'
  };

  return [
    `${titles[toolName]}`,
    '',
    `Primary policy source: \`${corePath}\`.`,
    'Load policy only from the canonical source file above.',
    'Do not duplicate, summarize, or inline rules in this file.',
    'If this file and the canonical source conflict, the canonical source wins.',
    ''
  ].join('\n');
}

function buildGeneratedArtifacts() {
  const corePath = CORE_SOURCE_REL_PATH;
  const files = {};

  files[GENERATED_INSTRUCTION_PATHS.canonical.generic] = `${buildHeaders('generic-wrapper')}${buildCompatInstruction('generic', corePath)}`;
  files[GENERATED_INSTRUCTION_PATHS.compatibility.generic] = `${buildHeaders('generic-compat')}${buildCompatInstruction('generic', corePath)}`;
  files[GENERATED_INSTRUCTION_PATHS.compatibility.copilot] = `${buildHeaders('copilot-compat')}${buildCompatInstruction('copilot', corePath)}`;
  files[GENERATED_INSTRUCTION_PATHS.compatibility.claude] = `${buildHeaders('claude-compat')}${buildCompatInstruction('claude', corePath)}`;
  files[GENERATED_INSTRUCTION_PATHS.compatibility.cursor] = `${buildHeaders('cursor-compat')}${buildCompatInstruction('cursor', corePath)}`;

  return files;
}

async function resolveCoreContent(targetDir, templateDir) {
  const canonicalPath = path.join(targetDir, CORE_SOURCE_REL_PATH);
  if (await fs.pathExists(canonicalPath)) {
    return fs.readFile(canonicalPath, 'utf8');
  }

  for (const legacyFile of getLegacyCoreCandidates()) {
    const legacyPath = path.join(targetDir, legacyFile);
    if (await fs.pathExists(legacyPath)) {
      const legacyContent = await fs.readFile(legacyPath, 'utf8');
      const isWrapper =
        legacyContent.includes(`Source of truth: ${CORE_SOURCE_REL_PATH}`) ||
        legacyContent.includes('Primary policy source: `instructions/source/core.md`.');

      if (!isWrapper) {
        return legacyContent;
      }
    }
  }

  const templateCorePath = path.join(templateDir, CORE_SOURCE_REL_PATH);
  return fs.readFile(templateCorePath, 'utf8');
}

async function ensureCoreSource(targetDir, templateDir, force = false) {
  const targetCorePath = path.join(targetDir, CORE_SOURCE_REL_PATH);

  if (await fs.pathExists(targetCorePath) && !force) {
    return;
  }

  const coreContent = await resolveCoreContent(targetDir, templateDir);
  await fs.ensureDir(path.dirname(targetCorePath));
  await fs.writeFile(targetCorePath, coreContent, 'utf8');
}

async function writeGeneratedInstructions(targetDir, templateDir, force = false) {
  await ensureCoreSource(targetDir, templateDir, force);
  const artifacts = buildGeneratedArtifacts();

  for (const [relPath, content] of Object.entries(artifacts)) {
    const targetPath = path.join(targetDir, relPath);

    if (await fs.pathExists(targetPath) && !force) {
      continue;
    }

    await fs.ensureDir(path.dirname(targetPath));
    await fs.writeFile(targetPath, content, 'utf8');
  }
}

async function validateInstructionDrift(targetDir) {
  const corePath = path.join(targetDir, CORE_SOURCE_REL_PATH);
  if (!(await fs.pathExists(corePath))) {
    return {
      ok: false,
      missingCore: true,
      driftFiles: [],
      orphanedPolicyFiles: []
    };
  }

  const expected = buildGeneratedArtifacts();
  const driftFiles = [];

  for (const [relPath, expectedContent] of Object.entries(expected)) {
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

  // Detect orphaned policy files that must not exist
  const orphanedPolicyFiles = [];
  for (const relPath of KNOWN_ORPHAN_PATHS) {
    if (await fs.pathExists(path.join(targetDir, relPath))) {
      orphanedPolicyFiles.push(relPath);
    }
  }

  return {
    ok: driftFiles.length === 0 && orphanedPolicyFiles.length === 0,
    missingCore: false,
    driftFiles,
    orphanedPolicyFiles
  };
}

module.exports = {
  CORE_SOURCE_REL_PATH,
  GENERATED_INSTRUCTION_PATHS,
  KNOWN_ORPHAN_PATHS,
  writeGeneratedInstructions,
  validateInstructionDrift
};