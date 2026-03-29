# Deterministic Slash Command Contracts

This directory is the modular source of truth for slash-command execution contracts.

- Global protocol and safety framework: `AGENTS.MD` → `Deterministic Slash Command System Standard`
- Global response schema: `agents/commands/SCHEMA.md`
- Command contracts:
  - `plan.md`
  - `task.md`
  - `scaffold.md`
  - `fix.md`
  - `refactor.md`
  - `audit.md`
  - `perf.md`
  - `test.md`
  - `pr.md`
  - `release.md`
  - `docs.md`
  - `problem-map.md`
  - `scope-shape.md`
  - `arch-check.md`
  - `ux-bar.md`
  - `debug-track.md`
  - `risk-review.md`
  - `quality-gate.md`
  - `perf-scan.md`
  - `release-ready.md`
  - `docs-sync.md`
  - `learn-loop.md`

Execution requirements:
- Parse slash commands deterministically.
- Return structured output only.
- No conversational fallback in slash mode.
- Enforce destructive confirmation token: `CONFIRM-DESTRUCTIVE:<target>`.
- Enforce unique command purpose for each primary workflow command.

## Command Integrity Guards

- Primary workflow commands must have unique purpose identifiers.
- Duplicate command purpose definitions fail CLI startup validation.
- Deprecated aliases are not treated as primary commands and are removed in v3.0.

## Publish Inclusion

The npm package includes command contracts from both:

- `agents/commands/` (root mirror)
- `templates/agents/commands/` (scaffold source)

## Workflow Command Mapping

Use these lifecycle commands as the recommended specialist sequence:

- `problem-map` -> `plan.md`
- `scope-shape` -> `plan.md`
- `arch-check` -> `plan.md`
- `ux-bar` -> `plan.md`
- `debug-track` -> `fix.md`
- `risk-review` -> `audit.md`
- `quality-gate` -> `test.md`
- `perf-scan` -> `perf.md`
- `release-ready` -> `release.md`
- `docs-sync` -> `docs.md`
- `learn-loop` -> `task.md`

The CLI command `agents-templated workflow` prints this lifecycle in order:

Think -> Plan -> Build -> Review -> Test -> Ship -> Reflect

## Deprecated Aliases (Until v3.0)

The following legacy command names still work as aliases and print a deprecation warning:

- `office-hours` -> `problem-map`
- `plan-ceo-review` -> `scope-shape`
- `plan-eng-review` -> `arch-check`
- `plan-design-review` -> `ux-bar`
- `investigate` -> `debug-track`
- `review` -> `risk-review`
- `qa` -> `quality-gate`
- `benchmark` -> `perf-scan`
- `ship` -> `release-ready`
- `document-release` -> `docs-sync`
- `retro` -> `learn-loop`