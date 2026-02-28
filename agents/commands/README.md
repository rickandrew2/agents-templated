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

Execution requirements:
- Parse slash commands deterministically.
- Return structured output only.
- No conversational fallback in slash mode.
- Enforce destructive confirmation token: `CONFIRM-DESTRUCTIVE:<target>`.