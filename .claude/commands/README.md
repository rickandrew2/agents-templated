# Deterministic Slash Command Contracts

This directory is the modular source of truth for slash-command execution contracts.

- Global protocol and safety framework: `AGENTS.MD` → `Deterministic Slash Command System Standard`
- Global response schema: `agents/commands/SCHEMA.md`
- Command contracts:
  - `plan.md`
  - `task.md`
  - `fix.md`
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
  - `test-data.md`
  - `risk-review.md`
  - `release-ready.md`
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
- Deprecated aliases are not part of the active command surface.

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
- `test-data` -> `test.md`
- `risk-review` -> `audit.md`
- `perf` -> `perf.md`
- `release-ready` -> `release.md`
- `docs` -> `docs.md`
- `learn-loop` -> `task.md`

The CLI command `agents-templated workflow` prints this lifecycle in order:

Think -> Plan -> Build -> Review -> Test -> Ship -> Reflect

## Non-Overlap Routing Boundaries

The orchestrator preserves explicit ownership boundaries between specialist decision surfaces.

- Backend implementation remains separate from tactical build and compatibility remediation:
  - `backend-specialist` owns implementation.
  - `build-error-resolver` owns build/type/lint fixes.
  - `compatibility-checker` owns external contract compatibility decisions.
- Review chain remains ordered and non-overlapping:
  - `code-reviewer` -> `dependency-auditor` -> `doc-updater`
  - `doc-updater` should not absorb review or dependency decisions.

## Test Data Handoff Routing

The orchestrator routes deterministic data preparation through `test-data-builder` and then hands off to downstream consumers.

- Upstream routes:
  - `qa-design` and backend/database-oriented phases can route to `test-data-builder`.
- Downstream consumers:
  - `qa-specialist(mode=validation)`
  - `e2e-runner`
  - `performance-specialist(mode=load)`
- Handoff metadata is emitted in orchestration output as `handoff_inputs`.

## Deprecated Alias Redirects

Deprecated workflow command aliases are supported as non-breaking redirects with deterministic notices.

| Deprecated | Redirects To |
|------------|--------------|
| `quality-gate` | `risk-review` |
| `perf-scan` | `perf` |
| `docs-sync` | `docs` |

Alias policy:

- Redirects preserve behavior of the canonical command.
- CLI prints a deprecation notice on each alias invocation.
- New automation should use canonical command names only.

## Automatic Orchestration

The CLI command `agents-templated orchestrate "<objective>"` builds an automatic multi-phase handoff plan across specialist tracks.

- Uses static scenario routing first.
- Falls back to keyword intent matching when no explicit scenario override is provided.
- Emits deterministic structured output compatible with `SCHEMA.md` in `slash-command-auto` mode.
- Stops the chain on `blocked` or `failed` state and returns a populated `stop_condition`.
- Includes scenario-conditioned optional delegation to existing subagents (for example `security-reviewer`, `e2e-runner`, `dependency-auditor`) without making them mandatory.

Example:

`agents-templated orchestrate "build auth api and dashboard" --json`

## Mode-Locked Specialist Invocation

The orchestrator must pass explicit mode values for mode-locked specialists and must never allow self-selection.

Mode-locked specialists:

- `qa-specialist`
  - Allowed modes: `design`, `validation`
  - Required invocation examples:
    - `qa-specialist(mode=design, input=<spec>)`
    - `qa-specialist(mode=validation, input=<changed_files + scope>)`
- `performance-specialist`
  - Allowed modes: `profile`, `load`
  - Required invocation examples:
    - `performance-specialist(mode=profile, input=<scope>)`
    - `performance-specialist(mode=load, input=<scope + thresholds>)`

HALT rules:

- Missing mode -> stop execution and return a clarification request.
- Unsupported mode -> stop execution and return allowed values.
- Mode inference from context is forbidden.

