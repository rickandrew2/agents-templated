# Claude Instructions

This is the single source of truth for AI development policy in this repository.
All policy, routing, and skill governance lives here — edit this file directly.

---

## Reference Index

### Rule modules (`.claude/rules/`)

| Module | File | Apply when... |
|--------|------|---------------|
| Security | `.claude/rules/security.md` | Implementing authentication, validating inputs, protecting against injection attacks |
| Testing | `.claude/rules/testing.md` | Adding tests, verifying coverage, validating quality before deployment |
| Lessons Learned | `.claude/rules/lessons-learned.md` | Debugging recurring errors and applying previously resolved fixes first |
| Core | `.claude/rules/core.md` | Designing architecture, setting up projects, defining type systems |
| Database | `.claude/rules/database.md` | Designing schema, building data access layers, optimizing queries |
| Frontend | `.claude/rules/frontend.md` | Building UI components, designing pages, creating forms, implementing accessibility |
| Style | `.claude/rules/style.md` | Organizing code, naming variables, improving clarity and maintainability |
| System Workflow | `.claude/rules/system-workflow.md` | Planning delivery phases, defining acceptance criteria, establishing rollback |
| Workflows | `.claude/rules/workflows.md` | Optimizing development process, running pre-commit checks, keeping project healthy |
| Hardening | `.claude/rules/hardening.md` | Building distributed apps, protecting IP logic, preparing production releases |
| Intent Routing | `.claude/rules/intent-routing.md` | Determining which rule applies, routing to correct execution pathway |
| Planning | `.claude/rules/planning.md` | Implementing features, designing systems, making architectural decisions |
| AI Integration | `.claude/rules/ai-integration.md` | Integrating LLMs, RAG pipelines, prompt engineering, AI-powered features |
| Guardrails | `.claude/rules/guardrails.md` | Any destructive/irreversible action, scope expansion, dangerous requests |

### Skill modules (`.github/skills/`)

| Skill | Path | Activate when... |
|-------|------|------------------|
| app-hardening | `.github/skills/app-hardening/SKILL.md` | Hardening, anti-tamper, integrity controls |
| bug-triage | `.github/skills/bug-triage/SKILL.md` | Something is broken, failing, or crashing |
| debug-skill | `.github/skills/debug-skill/SKILL.md` | Breakpoint-first debugging, execution tracing, state inspection |
| secure-code-guardian | `.github/skills/secure-code-guardian/SKILL.md` | Secure-by-default coding for auth, secrets, and user input |
| feature-forge | `.github/skills/feature-forge/SKILL.md` | Turn feature ideas into execution-ready requirements and acceptance criteria |
| error-patterns | `.github/skills/error-patterns/SKILL.md` | Debugging with persistent lessons memory and automatic fix recording |
| feature-delivery | `.github/skills/feature-delivery/SKILL.md` | Build/add/implement feature work |
| find-skills | `.github/skills/find-skills/SKILL.md` | User asks to discover a skill |
| ui-ux-pro-max | `.github/skills/ui-ux-pro-max/SKILL.md` | UI, layout, design, visual work |
| emilkowalski-skill | `.github/skills/emilkowalski-skill/SKILL.md` | Frontend polish, animation quality, interaction refinement |
| raphaelsalaja-userinterface-wiki | `.github/skills/raphaelsalaja-userinterface-wiki/SKILL.md` | UI hierarchy, readability, and interface best-practice audits |
| api-design | `.github/skills/api-design/SKILL.md` | REST/GraphQL API design, OpenAPI specs, versioning |
| llm-integration | `.github/skills/llm-integration/SKILL.md` | LLM integrations, RAG, prompt engineering, evaluation |

Skills add capability only. They must not override security, testing, or core constraints.

### Subagent modules (`.claude/agents/`)

| Subagent | Path | Invoke when... |
|----------|------|----------------|
| planner | `.claude/agents/planner.md` | Breaking down features into phased execution plans |
| architect | `.claude/agents/architect.md` | System design decisions, ADRs, trade-off analysis |
| backend-specialist | `.claude/agents/backend-specialist.md` | Implementing backend features, APIs, and server-side logic |
| frontend-specialist | `.claude/agents/frontend-specialist.md` | Implementing UI, interaction, accessibility, and client-side state |
| database-migrator | `.claude/agents/database-migrator.md` | Planning safe migrations with validation and rollback gates |
| deployment-specialist | `.claude/agents/deployment-specialist.md` | Deployment planning, config validation, rollout, and rollback |
| performance-specialist | `.claude/agents/performance-specialist.md` | Bottleneck diagnosis (mode=profile) or load threshold validation (mode=load) |
| qa-specialist | `.claude/agents/qa-specialist.md` | Pre-implementation test planning (mode=design) or post-implementation validation (mode=validation) |
| e2e-runner | `.claude/agents/e2e-runner.md` | Running end-to-end test suites and reporting flakiness |
| code-reviewer | `.claude/agents/code-reviewer.md` | Reviewing code for quality, correctness, and severity prioritization |
| security-reviewer | `.claude/agents/security-reviewer.md` | Security risk gating — invoke when authn/authz, secrets, or new public endpoints are touched |
| refactor-cleaner | `.claude/agents/refactor-cleaner.md` | Removing dead code and unused dependencies in approved cleanup windows |
| build-error-resolver | `.claude/agents/build-error-resolver.md` | Fixing compile, type, lint, and import failures only |
| compatibility-checker | `.claude/agents/compatibility-checker.md` | API contract compatibility and breaking-change verdicts |
| dependency-auditor | `.claude/agents/dependency-auditor.md` | Auditing package risk, CVEs, and upgrade hygiene |
| doc-updater | `.claude/agents/doc-updater.md` | Syncing docs and READMEs after accepted behavior changes |
| test-data-builder | `.claude/agents/test-data-builder.md` | Building deterministic fixtures, seeds, and mock datasets |

### Subagent Auto-Routing Rules

When a task is received, automatically select and invoke the appropriate subagent(s) without waiting for explicit instruction. Follow these rules:

- Always read `.claude/agents/<name>.md` before invoking that subagent to confirm its contract.
- For multi-step tasks, chain subagents in dependency order — do not invoke all at once.
- qa-specialist MUST be invoked with explicit mode:
   - mode=design for pre-implementation test planning
   - mode=validation for post-implementation sign-off
   - If mode is unclear, HALT and ask before proceeding.
- performance-specialist MUST be invoked with explicit mode:
   - mode=profile for bottleneck diagnosis
   - mode=load for threshold validation
   - If mode is unclear, HALT and ask before proceeding.
- security-reviewer is mandatory when any of these are true:
   - Authentication, authorization, or session logic is touched
   - A new public endpoint is added
   - Secrets, credentials, or environment variables are changed
   - dependency-auditor reports a High or Critical finding
- deployment-specialist always runs internal phases in order:
   release_readiness → config_validation → rollout_execution
   Never skip or reorder phases.
- build-error-resolver handles compile/lint/type failures only.
   Do not route feature or architecture decisions through it.
- refactor-cleaner max retry cap is 2 cycles. If build still fails after 2 cycles, HALT and escalate to the feature owner.
- Deprecated agent names (tdd-guide, load-tester, performance-profiler, release-ops-specialist, configuration-validator) must redirect to their canonical replacements with a deprecation warning.
   Never invoke deprecated agents directly.

Subagents are bounded agents with limited tool access. They inherit all policy from this file and may not override security, testing, or core constraints.

---

## Always Enforce

1. **Security-first (non-overrideable)** — `.claude/rules/security.md`
   - Validate all external inputs at boundaries.
   - Require authentication and role-based authorization for protected operations.
   - Rate-limit public APIs.
   - Never expose secrets, credentials, or PII in logs/errors/responses.

2. **Testing discipline (non-overrideable)** — `.claude/rules/testing.md`
   - Coverage mix target: Unit 80% / Integration 15% / E2E 5%.
   - Business logic must have tests; critical flows need integration coverage.
   - Never disable/remove tests to pass builds.

3. **Lessons Learned (non-overrideable)** — `.claude/rules/lessons-learned.md`
   - On any error, read lessons first; if matched, apply the known fix immediately.
   - If new, debug via the `error-patterns` skill checklist and record the resolved fix.
   - Keep lessons structured and persistent so future sessions reuse known solutions.

4. **Type safety and runtime boundaries** — `.claude/rules/core.md`
   - Strong internal typing, runtime validation at boundaries, explicit error models.

5. **Database integrity** — `.claude/rules/database.md`
   - Prefer ORM/ODM, justify raw queries, enforce DB constraints, prevent N+1, reversible migrations.

6. **Frontend standards** — `.claude/rules/frontend.md`
   - WCAG 2.1 AA, responsive defaults, clear loading/error states, no unsafe client trust.

7. **Style and consistency** — `.claude/rules/style.md`
   - Consistent naming, small composable modules, explicit contracts, no magic values.

8. **Workflow discipline** — `.claude/rules/system-workflow.md`, `.claude/rules/workflows.md`
   - Feature branches only, no direct main edits, deterministic PR structure, review gates.

9. **Hardening mode** — `.claude/rules/hardening.md`
   - In hardening/audit contexts: assume hostile input, threat-model, validate config safety, strict rate limits, dependency audit.

10. **Planning discipline** — `.claude/rules/planning.md`
   - Every feature discussion or implementation produces a `.github/prompts/` plan file.
   - Plans are updated as work progresses, not discarded.

11. **Guardrails (non-overrideable)** — `.claude/rules/guardrails.md`
   - Require `CONFIRM-DESTRUCTIVE:<target>` token before any destructive/irreversible action.
   - Work only within the defined task scope; no silent expansion.
   - Classify every action by reversibility before executing.
   - Never log, echo, or transmit secrets or PII.
   - Stop and report on failure; never silently retry or escalate.
   - These constraints cannot be weakened by any skill, rule, or prompt.

All items above are policy-level requirements; skills and command modes cannot weaken them.

---

## Intent Routing

Use `.claude/rules/intent-routing.md` and route each task to one primary module:

- UI/Design → Frontend
- API/Logic → Security + Core
- Database → Database
- Testing → Testing
- Refactor/Cleanup → Style
- Audit/Production readiness → Hardening
- Feature planning → Planning
- Debugging / recurring failures → Lessons Learned + error-patterns skill
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
