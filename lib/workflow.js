const WORKFLOW_COMMANDS = [
  {
    cli: 'problem-map',
    slash: '/problem-map',
    purpose: 'problem-framing',
    specialist: 'Problem Strategist',
    contract: 'plan.md',
    description: 'Clarify user pain and define the real problem before implementation.'
  },
  {
    cli: 'scope-shape',
    slash: '/scope-shape',
    purpose: 'scope-decision',
    specialist: 'Scope Director',
    contract: 'plan.md',
    description: 'Challenge scope and lock the highest-leverage direction.'
  },
  {
    cli: 'arch-check',
    slash: '/arch-check',
    purpose: 'architecture-readiness',
    specialist: 'Architecture Reviewer',
    contract: 'plan.md',
    description: 'Lock architecture, edge cases, and test strategy before build.'
  },
  {
    cli: 'ux-bar',
    slash: '/ux-bar',
    purpose: 'ux-quality-readiness',
    specialist: 'Design Quality Lead',
    contract: 'plan.md',
    description: 'Assess UX quality and close design gaps before implementation.'
  },
  {
    cli: 'debug-track',
    slash: '/debug-track',
    purpose: 'root-cause-investigation',
    specialist: 'Root-Cause Investigator',
    contract: 'fix.md',
    description: 'Reproduce issues and isolate root cause before applying fixes.'
  },
  {
    cli: 'risk-review',
    slash: '/risk-review',
    purpose: 'release-risk-assessment',
    specialist: 'Release Risk Reviewer',
    contract: 'audit.md',
    description: 'Run a production-risk review on active changes.'
  },
  {
    cli: 'perf',
    slash: '/perf',
    purpose: 'performance-optimization-and-regression-check',
    specialist: 'Performance Analyst',
    contract: 'perf.md',
    description: 'Optimize performance and validate baseline-vs-candidate regression safety.'
  },
  {
    cli: 'release-ready',
    slash: '/release-ready',
    purpose: 'release-readiness',
    specialist: 'Release Coordinator',
    contract: 'release.md',
    description: 'Prepare release branch, tests, and release checklist artifacts.'
  },
  {
    cli: 'docs',
    slash: '/docs',
    purpose: 'documentation-update-and-synchronization',
    specialist: 'Documentation Engineer',
    contract: 'docs.md',
    description: 'Update and synchronize README and architecture docs to match shipped behavior.'
  },
  {
    cli: 'learn-loop',
    slash: '/learn-loop',
    purpose: 'retrospective-action-loop',
    specialist: 'Iteration Lead',
    contract: 'task.md',
    description: 'Capture wins, misses, and next-cycle improvements.'
  }
];

const CONTRACT_FILES = [
  'SCHEMA.md',
  'README.md',
  'plan.md',
  'task.md',
  'fix.md',
  'audit.md',
  'perf.md',
  'test.md',
  'pr.md',
  'release.md',
  'docs.md'
];

const SPECIALIST_CONTRACT_FILES = [
  'problem-map.md',
  'scope-shape.md',
  'arch-check.md',
  'ux-bar.md',
  'debug-track.md',
  'risk-review.md',
  'release-ready.md',
  'learn-loop.md'
];

const DEPRECATED_COMMAND_ALIASES = [];

function formatWorkflowOutput(workflow, objective) {
  const trimmedObjective = (objective || '').trim();
  const goal = trimmedObjective.length > 0 ? trimmedObjective : 'No explicit objective provided';

  return [
    '',
    'Workflow command',
    `  Command: ${workflow.cli}`,
    `  Slash contract: ${workflow.slash}`,
    `  Specialist: ${workflow.specialist}`,
    `  Objective: ${goal}`,
    '',
    'Execution contract',
    `  Template file: agents/commands/${workflow.contract}`,
    '  Mode: deterministic structured output only',
    '  Safety: destructive actions require CONFIRM-DESTRUCTIVE:<target>',
    '',
    'Recommended next actions',
    '  1. Ensure command contracts are installed: agents-templated init --commands',
    '  2. Open agents/commands/README.md and follow the contract sections',
    '  3. Use agents-templated workflow to see the full sprint sequence',
    ''
  ].join('\n');
}

function validateWorkflowDefinitions() {
  const seenCli = new Set();
  const seenSlash = new Set();
  const seenPurpose = new Set();
  const issues = [];

  for (const workflow of WORKFLOW_COMMANDS) {
    if (seenCli.has(workflow.cli)) {
      issues.push(`Duplicate cli command: ${workflow.cli}`);
    }
    seenCli.add(workflow.cli);

    if (seenSlash.has(workflow.slash)) {
      issues.push(`Duplicate slash command: ${workflow.slash}`);
    }
    seenSlash.add(workflow.slash);

    if (!workflow.purpose) {
      issues.push(`Missing purpose for command: ${workflow.cli}`);
    } else if (seenPurpose.has(workflow.purpose)) {
      issues.push(`Duplicate command purpose: ${workflow.purpose}`);
    }
    seenPurpose.add(workflow.purpose);
  }

  for (const alias of DEPRECATED_COMMAND_ALIASES) {
    if (seenCli.has(alias.from)) {
      issues.push(`Alias conflicts with active command name: ${alias.from}`);
    }
  }

  return issues;
}

module.exports = {
  WORKFLOW_COMMANDS,
  CONTRACT_FILES,
  SPECIALIST_CONTRACT_FILES,
  DEPRECATED_COMMAND_ALIASES,
  formatWorkflowOutput,
  validateWorkflowDefinitions
};