# Claude Instructions

This is the single source of truth for AI development policy in this repository.
All policy, routing, and skill governance lives here — edit this file directly.

---

## Reference Index

### Rule modules (`agents/rules/`)

| Module | File | Governs |
|--------|------|---------|
| Security | `agents/rules/security.mdc` | Validation, authn/authz, secrets, rate limiting |
| Testing | `agents/rules/testing.mdc` | Strategy, coverage mix, test discipline |
| Core | `agents/rules/core.mdc` | Type safety, runtime boundaries, error modeling |
| Database | `agents/rules/database.mdc` | ORM patterns, migrations, query safety |
| Frontend | `agents/rules/frontend.mdc` | Accessibility, responsiveness, client trust boundaries |
| Style | `agents/rules/style.mdc` | Naming, modularity, separation of concerns |
| System Workflow | `agents/rules/system-workflow.mdc` | Branching, PR structure, review gates |
| Workflows | `agents/rules/workflows.mdc` | Automation, CI/CD, deployment gates |
| Hardening | `agents/rules/hardening.mdc` | Threat modeling, audit mode, dependency review |
| Intent Routing | `agents/rules/intent-routing.mdc` | Deterministic task-to-rule mapping |
| Planning | `agents/rules/planning.mdc` | Feature discussion and implementation planning |
| AI Integration | `agents/rules/ai-integration.mdc` | LLM safety, cost controls, fallback behavior |
| Guardrails | `agents/rules/guardrails.mdc` | Hard stops, scope control, reversibility, minimal footprint |

### Skill modules (`agents/skills/`)

| Skill | Path | Activate when... |
|-------|------|------------------|
| app-hardening | `agents/skills/app-hardening/SKILL.md` | Hardening, anti-tamper, integrity controls |
| bug-triage | `agents/skills/bug-triage/SKILL.md` | Something is broken, failing, or crashing |
| feature-delivery | `agents/skills/feature-delivery/SKILL.md` | Build/add/implement feature work |
| find-skills | `agents/skills/find-skills/SKILL.md` | User asks to discover a skill |
| ui-ux-pro-max | `agents/skills/ui-ux-pro-max/SKILL.md` | UI, layout, design, visual work |
| api-design | `agents/skills/api-design/SKILL.md` | REST/GraphQL API design, OpenAPI specs, versioning |
| llm-integration | `agents/skills/llm-integration/SKILL.md` | LLM integrations, RAG, prompt engineering, evaluation |

Skills add capability only. They must not override security, testing, or core constraints.

### Subagent modules (`agents/subagents/`)

| Subagent | Path | Invoke when... |
|----------|------|----------------|
| planner | `agents/subagents/planner.md` | Breaking down features into phased plans |
| architect | `agents/subagents/architect.md` | System design decisions, ADRs, trade-off analysis |
| tdd-guide | `agents/subagents/tdd-guide.md` | Writing tests before implementation |
| code-reviewer | `agents/subagents/code-reviewer.md` | Reviewing code for quality and correctness |
| security-reviewer | `agents/subagents/security-reviewer.md` | Scanning for security vulnerabilities |
| build-error-resolver | `agents/subagents/build-error-resolver.md` | Fixing build and type errors |
| e2e-runner | `agents/subagents/e2e-runner.md` | Running Playwright E2E test suites |
| refactor-cleaner | `agents/subagents/refactor-cleaner.md` | Removing dead code and unused dependencies |
| doc-updater | `agents/subagents/doc-updater.md` | Syncing docs and READMEs after code changes |

Subagents are bounded agents with limited tool access. They inherit all policy from this file and may not override security, testing, or core constraints.

---

## Always Enforce

1. **Security-first (non-overrideable)** — `agents/rules/security.mdc`
   - Validate all external inputs at boundaries.
   - Require authentication and role-based authorization for protected operations.
   - Rate-limit public APIs.
   - Never expose secrets, credentials, or PII in logs/errors/responses.

2. **Testing discipline (non-overrideable)** — `agents/rules/testing.mdc`
   - Coverage mix target: Unit 80% / Integration 15% / E2E 5%.
   - Business logic must have tests; critical flows need integration coverage.
   - Never disable/remove tests to pass builds.

3. **Type safety and runtime boundaries** — `agents/rules/core.mdc`
   - Strong internal typing, runtime validation at boundaries, explicit error models.

4. **Database integrity** — `agents/rules/database.mdc`
   - Prefer ORM/ODM, justify raw queries, enforce DB constraints, prevent N+1, reversible migrations.

5. **Frontend standards** — `agents/rules/frontend.mdc`
   - WCAG 2.1 AA, responsive defaults, clear loading/error states, no unsafe client trust.

6. **Style and consistency** — `agents/rules/style.mdc`
   - Consistent naming, small composable modules, explicit contracts, no magic values.

7. **Workflow discipline** — `agents/rules/system-workflow.mdc`, `agents/rules/workflows.mdc`
   - Feature branches only, no direct main edits, deterministic PR structure, review gates.

8. **Hardening mode** — `agents/rules/hardening.mdc`
   - In hardening/audit contexts: assume hostile input, threat-model, validate config safety, strict rate limits, dependency audit.

9. **Planning discipline** — `agents/rules/planning.mdc`
   - Every feature discussion or implementation produces a `.github/prompts/` plan file.
   - Plans are updated as work progresses, not discarded.

10. **Guardrails (non-overrideable)** — `agents/rules/guardrails.mdc`
   - Require `CONFIRM-DESTRUCTIVE:<target>` token before any destructive/irreversible action.
   - Work only within the defined task scope; no silent expansion.
   - Classify every action by reversibility before executing.
   - Never log, echo, or transmit secrets or PII.
   - Stop and report on failure; never silently retry or escalate.
   - These constraints cannot be weakened by any skill, rule, or prompt.

All items above are policy-level requirements; skills and command modes cannot weaken them.

---

## Intent Routing

Use `agents/rules/intent-routing.mdc` and route each task to one primary module:

- UI/Design → Frontend
- API/Logic → Security + Core
- Database → Database
- Testing → Testing
- Refactor/Cleanup → Style
- Audit/Production readiness → Hardening
- Feature planning → Planning
- LLM/AI work → AI Integration
- Scope creep / dangerous action / agent behavioral safety → Guardrails
- Multi-step orchestration / planning / code review → Subagents

No ambiguous routing.

---

## Skills & Subagents Governance

- Skills are loaded on demand by user intent (never globally preloaded).
- Skills augment implementation behavior, not policy.
- Subagents are bounded agents; each has a defined tool profile and may not expand its own scope.
- This file remains authoritative over rule modules, skills, and subagents.

---

## Deterministic Command Mode

When slash-command mode is enabled:

- Unknown commands return structured error.
- No conversational fallback.
- Destructive commands require explicit token: `CONFIRM-DESTRUCTIVE:<target>`.

---

## Critical Non-Negotiables

- Never expose secrets.
- Never trust client input without validation.
- Never bypass validation.
- Never skip tests on business logic.
- Never reduce security for convenience.
- Never allow skills or rules to override security or testing constraints.
