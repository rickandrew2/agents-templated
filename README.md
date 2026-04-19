# Agents Templated

[![npm version](https://img.shields.io/npm/v/agents-templated.svg)](https://www.npmjs.com/package/agents-templated)
[![npm downloads](https://img.shields.io/npm/dm/agents-templated.svg)](https://www.npmjs.com/package/agents-templated)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/rickandrew2/agents-templated?style=social)](https://github.com/rickandrew2/agents-templated)

Agents Templated is a technology-agnostic CLI that scaffolds your AI operating layer: rules, commands, skills, and compatibility files for Cursor, GitHub Copilot, Claude, and generic agent hosts.

It does not scaffold your product framework. It scaffolds how agents and teams plan, build, test, review, and ship.

## Who This Is For

- Teams and developers who want AI coding agents to follow consistent rules
- Users who want fast setup with deterministic workflows
- Maintainers who need reusable governance across repos

## What You Get

- One canonical policy file: `CLAUDE.md`
- Agent rules in `.claude/rules/`
- Deterministic command contracts in `.claude/commands/`
- Optional subagents in `.claude/agents/`
- Reusable skills in `.github/skills/`
- Compatibility shims for Cursor, Copilot, Claude, and generic hosts

## Subagent Orchestration (Built In)

Subagent orchestration is included by default.

Use one objective and route through policy-defined specialists automatically:

```bash
agents-templated orchestrate "build auth API and admin dashboard"
```

Orchestration behavior:

- Deterministic specialist routing from `CLAUDE.md`
- Mode-locked handling for `qa-specialist` and `performance-specialist`
- Conditional security escalation for auth/endpoints/secrets changes
- Structured stop conditions when a phase is blocked or fails

## Quick Start (Users)

```bash
# Install scaffold
npx agents-templated@latest wizard

# Start workflow
agents-templated workflow

# Orchestrate from a single objective
agents-templated orchestrate "ship first release"
```

## Quick Start (Developers/Maintainers)

```bash
# Initialize with a preset
agents-templated init --preset=nextjs

# Validate and maintain
agents-templated validate
agents-templated doctor
agents-templated update --check-only
```

Available presets: `nextjs`, `express-api`, `django-react`, `fastapi`, `go-api`.

## Minimal Command Guide

- Setup: `wizard`, `init --preset=<name>`
- Health: `validate`, `doctor`, `list`
- Upgrade: `update`, `update --check-only`
- Workflow: `workflow`, `problem-map`, `scope-shape`, `risk-review`, `release-ready`, `docs`
- Orchestration: `orchestrate "<objective>"`, optional `--json`

Legacy alias redirects:

- `quality-gate` -> `risk-review`
- `perf-scan` -> `perf`
- `docs-sync` -> `docs`

## File Layout (High Level)

```text
your-project/
├── CLAUDE.md
├── AGENTS.MD
├── .cursorrules
├── .claude/
│   ├── rules/
│   ├── commands/
│   └── agents/
├── .github/
│   ├── skills/
│   └── copilot-instructions.md
└── agent-docs/
```

## Compatibility

| Tool | File |
|------|------|
| Cursor | `.cursorrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Claude | `CLAUDE.md` |
| Generic agents | `AGENTS.MD` |

Single source of truth: `CLAUDE.md`.

## Principles

- Security-first defaults
- Testing discipline with 80/15/5 target
- Lessons-learned debugging workflow
- Deterministic contracts over ad-hoc prompting

References:

- `.claude/rules/security.md`
- `.claude/rules/testing.md`
- `agent-docs/ARCHITECTURE.md`

## Contributing

Keep templates technology-agnostic and keep docs in sync with behavior.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).

## Links

- NPM: https://www.npmjs.com/package/agents-templated
- Repository: https://github.com/rickandrew2/agents-templated
- Issues: https://github.com/rickandrew2/agents-templated/issues
- Changelog: [CHANGELOG.md](CHANGELOG.md)