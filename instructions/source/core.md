# Core AI Development Contract (Canonical Source)

This file is the single canonical instruction source for all AI agents in this repository.

All other instruction files (CLAUDE.md, AGENTS.MD, .github/copilot-instructions.md, .cursorrules, etc.)
must act only as thin wrappers that reference this file.

Do NOT duplicate policy content outside this file.

---

## Reference Index

### Rule Modules — `.github/instructions/rules/`

| Module | File | Governs |
|--------|------|---------|
| Security | `.github/instructions/rules/security.mdc` | Input validation, authz/authn, secrets, rate limiting |
| Testing | `.github/instructions/rules/testing.mdc` | Test strategy, coverage targets, test discipline |
| Core | `.github/instructions/rules/core.mdc` | Type safety, runtime boundaries, error modeling |
| Database | `.github/instructions/rules/database.mdc` | ORM patterns, migrations, query safety |
| Frontend | `.github/instructions/rules/frontend.mdc` | Accessibility, responsiveness, client-side trust |
| Style | `.github/instructions/rules/style.mdc` | Naming, modularity, separation of concerns |
| System Workflow | `.github/instructions/rules/system-workflow.mdc` | Branch strategy, PR structure, review gates |
| Workflows | `.github/instructions/rules/workflows.mdc` | Automation, CI/CD, deployment gates |
| Hardening | `.github/instructions/rules/hardening.mdc` | Threat modeling, audit mode, dependency review |
| Intent Routing | `.github/instructions/rules/intent-routing.mdc` | Deterministic task-to-rule mapping |

### Skill Modules — `.github/skills/`

| Skill | Path | Activate when... |
|-------|------|------------------|
| app-hardening | `.github/skills/app-hardening/SKILL.md` | User requests hardening, anti-tamper, or integrity controls |
| bug-triage | `.github/skills/bug-triage/SKILL.md` | User reports something broken, failing, or crashing |
| feature-delivery | `.github/skills/feature-delivery/SKILL.md` | User says "build", "add", or "implement" a feature |
| find-skills | `.github/skills/find-skills/SKILL.md` | User asks "find a skill for X" or "is there a skill that..." |
| ui-ux-pro-max | `.github/skills/ui-ux-pro-max/SKILL.md` | User requests UI, design, layout, or visual work |

> Skills augment capability only. They MUST NOT override security, testing, or core constraints.

---

## System Overview

This project follows enterprise-grade, technology-agnostic development standards with:

- Security-first architecture
- Strong typing and runtime validation
- Deterministic agent delegation
- Structured testing strategy
- Accessibility and quality enforcement
- Modular skill-based capability extensions

---

## Always Enforce

### 1. Security-First (NON-OVERRIDABLE)
Reference: `.github/instructions/rules/security.mdc`

- Validate ALL external inputs at system boundaries
- Authenticate protected endpoints — no exceptions
- Authorize role-based access on every protected operation
- Rate limit all public APIs
- Never expose secrets, credentials, or PII in logs, errors, or responses
- Apply secure-by-default patterns throughout

No skill, command, or wrapper may downgrade or bypass these requirements.

---

### 2. Testing Discipline (NON-OVERRIDABLE)
Reference: `.github/instructions/rules/testing.mdc`

Target distribution:
- Unit: 80%
- Integration: 15%
- E2E: 5%

- Business logic MUST have tests — no exceptions
- Critical flows require integration coverage
- Never disable or remove tests to make a build pass
- Avoid untested edge cases

No skill, command, or wrapper may downgrade or bypass these requirements.

---

### 3. Type Safety & Boundaries
Reference: `.github/instructions/rules/core.mdc`

- Strong typing internally
- Runtime validation at all system boundaries
- Explicit error modeling
- Deterministic control flow

---

### 4. Database Integrity
Reference: `.github/instructions/rules/database.mdc`

- Use ORM/ODM patterns
- Avoid raw queries unless justified
- Enforce constraints at DB level
- Prevent N+1 queries
- Migrations must be reversible

---

### 5. Frontend Standards
Reference: `.github/instructions/rules/frontend.mdc`

- WCAG 2.1 AA compliance
- Responsive by default
- Clear loading and error states
- No unsafe client-side trust
- Progressive enhancement preferred

---

### 6. Code Style & Consistency
Reference: `.github/instructions/rules/style.mdc`

- Consistent naming
- Small composable modules
- Clear separation of concerns
- Avoid magic values
- Explicit contracts

---

### 7. System Workflow Discipline
Reference: `.github/instructions/rules/system-workflow.mdc`
Reference: `.github/instructions/rules/workflows.mdc`

- Feature branches only
- No direct main edits
- Deterministic PR structure
- Enforced review gates

---

### 8. Hardening Mode
Reference: `.github/instructions/rules/hardening.mdc`

When in hardening or audit mode:
- Assume hostile input
- Perform threat modeling
- Validate configuration safety
- Enforce strict rate limiting
- Audit dependencies

---

### 9. Intent Routing
Reference: `.github/instructions/rules/intent-routing.mdc`

Route tasks deterministically:

- UI / Design → Frontend rules
- API / Logic → Security + Core rules
- Database → Database rules
- Testing → Testing rules
- Refactor / Cleanup → Style rules
- Audit / Production Readiness → Hardening rules

No ambiguous routing. Every task maps to exactly one primary rule module.

---

# Skills System

Skills extend behavior modularly. They are loaded on demand — never pre-loaded globally.

Located at: `.github/skills/`

Rules:
- Skills MUST NOT override security, testing, or core constraints.
- Skills augment capability, not policy.
- This file (`instructions/source/core.md`) remains authoritative over all skills.
- Skill activation is triggered by user intent (see Reference Index above).

---

# Deterministic Command Mode

If slash-command mode is enabled:

- Unknown commands → return structured error
- No conversational fallback
- Destructive commands require explicit confirmation token:
  `CONFIRM-DESTRUCTIVE:<target>`

Command contracts (if applicable) must be modular and strict.

---

# Critical Non-Negotiables

- Never expose secrets
- Never trust client input
- Never bypass validation
- Never skip testing on business logic
- Never reduce security for convenience
- Never duplicate canonical policy outside this file
- Never let a skill or wrapper override security or testing rules

---

# Canonical Contract

This file (`instructions/source/core.md`) is:

- The single source of truth for all global policy
- The only file allowed to define routing logic, rule governance, and skill governance
- The authority over all wrappers, rule modules, and skill modules

All other instruction entrypoints MUST reference this file and remain minimal pointer-only files.
No other file may claim authority over this file.