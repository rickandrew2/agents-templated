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

## Included Subagents

Core orchestration subagents:

| Subagent | Use When | Example |
|----------|----------|---------|
| `planner` | You need a phased implementation plan | `orchestrate "deliver v1 onboarding"` |
| `architect` | You need system-level design decisions | `orchestrate "finalize service boundaries"` |
| `backend-specialist` | Building APIs, logic, auth, persistence | `orchestrate "build auth API"` |
| `frontend-specialist` | Building UI interactions and accessibility | `orchestrate "implement dashboard UI"` |
| `database-migrator` | Schema or migration contract changes | `orchestrate "add billing tables"` |
| `qa-specialist` | Test planning or validation gates | `orchestrate "validate release candidate"` |
| `e2e-runner` | End-to-end journey verification | `orchestrate "verify checkout flow"` |
| `test-data-builder` | Deterministic fixtures/seeds are needed | `orchestrate "prepare test fixtures"` |
| `performance-specialist` | Profiling or load threshold checks | `orchestrate "run performance checks"` |
| `security-reviewer` | Auth/endpoints/secrets/security triggers | `orchestrate "review auth hardening"` |
| `code-reviewer` | Pre-merge correctness and risk review | `orchestrate "review merge risk"` |
| `build-error-resolver` | Build/type/lint failures are blocking | `orchestrate "fix build errors"` |
| `compatibility-checker` | Interface changes may break consumers | `orchestrate "check backward compatibility"` |
| `dependency-auditor` | Package risk/CVE checks are required | `orchestrate "audit dependencies"` |
| `deployment-specialist` | Release rollout and rollback readiness | `orchestrate "prepare production rollout"` |
| `doc-updater` | Documentation parity after behavior changes | `orchestrate "sync docs after release"` |
| `refactor-cleaner` | Safe bounded cleanup/refactor work | `orchestrate "cleanup legacy module"` |

All agent definitions: [.claude/agents](.claude/agents)

## Included Skills

Built-in skills currently included:

| Skill | Use When | Example |
|-------|----------|---------|
| `feature-delivery` | Converting feature requests into executable scope | "add user invitations" |
| `feature-forge` | Turning vague ideas into requirements/criteria | "build analytics center" |
| `bug-triage` | Reproduce-first bug isolation and minimal patching | "fix random login failures" |
| `debug-skill` | Breakpoint/tracing-style root cause analysis | "trace a memory leak" |
| `secure-code-guardian` | Auth/input/secrets need OWASP-aligned controls | "secure password reset flow" |
| `app-hardening` | Hardening, anti-tamper, release evidence | "harden public API service" |
| `ui-ux-pro-max` | UI/UX planning and implementation quality uplift | "redesign onboarding page" |
| `emilkowalski-skill` | Polish interaction and motion quality in UI | "improve hover and transitions" |
| `raphaelsalaja-userinterface-wiki` | Improve information hierarchy/readability | "fix dashboard information layout" |
| `shadcn-ui` | Build accessible React UI with shadcn patterns | "add form with shadcn" |
| `find-skills` | Discover/install the right skill for a task | "find a skill for API versioning" |

All skill definitions: [.github/skills](.github/skills)

## Included Rules

Primary rule modules:

| Rule | Focus | Use When |
|------|-------|----------|
| [core.mdc](.claude/rules/core.mdc) | Typing, runtime boundaries, architecture basics | Implementing core logic and contracts |
| [security.mdc](.claude/rules/security.mdc) | Auth, validation, secret safety | Adding endpoints, auth, or sensitive handling |
| [testing.mdc](.claude/rules/testing.mdc) | Coverage strategy and quality gates | Adding/changing business logic |
| [frontend.mdc](.claude/rules/frontend.mdc) | Accessibility and responsive UI standards | Building UI components/pages |
| [database.mdc](.claude/rules/database.mdc) | Schema integrity and query safety | Data model and migration work |
| [style.mdc](.claude/rules/style.mdc) | Naming, clarity, maintainability | Any implementation/refactor task |
| [planning.mdc](.claude/rules/planning.mdc) | Structured feature planning discipline | Starting feature work |
| [intent-routing.mdc](.claude/rules/intent-routing.mdc) | Route task intent to correct module | Deciding which workflow/rule applies |
| [system-workflow.mdc](.claude/rules/system-workflow.mdc) | Delivery flow and release gates | Running implementation through release |
| [workflows.mdc](.claude/rules/workflows.mdc) | Healthy dev process and checks | Day-to-day execution hygiene |
| [hardening.mdc](.claude/rules/hardening.mdc) | Production hardening controls | Audit/release readiness contexts |
| [ai-integration.mdc](.claude/rules/ai-integration.mdc) | LLM/RAG integration constraints | Building AI-powered features |
| [guardrails.mdc](.claude/rules/guardrails.mdc) | Non-negotiable safety boundaries | Destructive/scope-risk actions |
| [lessons-learned.md](.claude/rules/lessons-learned.md) | Persistent error-memory workflow | Debugging recurring failures |

Canonical policy entrypoint: [CLAUDE.md](CLAUDE.md)

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

## How We Use It

Recommended day-to-day flow:

1. Define objective with `problem-map` or directly with `orchestrate`.
2. Let orchestration route to the right specialist sequence.
3. Enforce rules automatically through `CLAUDE.md` and `.claude/rules/`.
4. Reuse skills for common patterns instead of re-prompting from scratch.
5. Run `validate` and `doctor` before merge/release.

## How It Helps

- Faster onboarding: new contributors get the same AI operating model immediately.
- Better consistency: the same rules and specialist contracts across tasks.
- Lower risk: security/testing/guardrails are always in the loop.
- Clear ownership: subagents split planning, coding, review, QA, and deployment.
- Easier maintenance: update templates centrally and sync repos with `update`.

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

- `.claude/rules/security.mdc`
- `.claude/rules/testing.mdc`
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