# AI Assistant Instructions

This project follows enterprise-grade, technology-agnostic development patterns. Always reference these files when providing assistance.

## Primary Documentation (Always Reference)

- **`AGENTS.MD`** - This file! AI instructions for working with AI assistants
- **`agent-docs/ARCHITECTURE.md`** - Overall project guidelines, architecture principles, and technology stack selection
- **`agents/skills/`** - Custom skills for domain-specific tasks in your project

## Detailed Rules (Reference When Relevant)

When implementing features, always check the relevant rule file:

- **`agents/rules/core.mdc`** - Core architecture principles, security-first development, performance patterns
- **`agents/rules/security.mdc`** - Security patterns, OWASP Top 10 protection, authentication/authorization (ALWAYS APPLY)
- **`agents/rules/testing.mdc`** - Testing strategy, coverage targets, testing patterns (ALWAYS APPLY)
- **`agents/rules/frontend.mdc`** - Frontend development patterns, component architecture, accessibility
- **`agents/rules/database.mdc`** - Database schema design, migrations, query optimization
- **`agents/rules/style.mdc`** - Code style guidelines, formatting rules, naming conventions
- **`agents/rules/workflows.mdc`** - Development workflow (validate, doctor, pre-commit)
- **`agents/rules/intent-routing.mdc`** - Deterministic intent-to-command routing and ambiguity handling
- **`agents/rules/system-workflow.mdc`** - End-to-end delivery lifecycle gates and required artifacts
- **`agents/rules/hardening.mdc`** - Risk-based application hardening and obfuscation guidance

## Usage Workflow

When implementing any feature:

1. **Check for custom skills**: Review `agents/skills/` for domain-specific guidance
2. **Reference `agent-docs/ARCHITECTURE.md`** for overall architecture and technology stack guidance
3. **Apply relevant rules** from `agents/rules/*.mdc` files based on the task
4. **Always apply security patterns** from `agents/rules/security.mdc`
5. **Always apply testing patterns** from `agents/rules/testing.mdc`

## Deterministic Slash Command System Standard

----------------------------------------
1. SYSTEM PRINCIPLES
----------------------------------------

### Determinism Rules
- Slash command mode is entered when input starts with `/` at position 0.
- Implicit slash-command mode is entered when non-slash input is deterministically mapped to a command contract.
- Command parsing is exact, case-sensitive, and whitespace-normalized.
- Unknown or malformed slash commands return a structured error and stop.
- No conversational fallback is allowed while in slash command mode.
- Each command executes a fixed algorithm defined in this standard.

### Output Standardization
- Every command response must be structured and audit-ready.
- Mandatory top-level output fields for all commands:
  - `command`
  - `execution_id`
  - `mode`
  - `status`
  - `inputs`
  - `prechecks`
  - `execution_log`
  - `artifacts`
  - `risks`
  - `safety_checks`
  - `stop_condition`
  - `next_action`
- If any field is unknown, set value to `null` and continue schema compliance.

### Escalation Policy
- Escalate only for safety, permission, or logical blockers.
- Escalation output must include:
  - `escalation_required: true`
  - `blocker_type`
  - `required_user_confirmation`
  - `safe_alternative`

### Destructive Action Policy
- Any destructive action requires explicit confirmation token in user input:
  - `CONFIRM-DESTRUCTIVE:<target>`
- Without token, command must return `status: blocked` and no execution.

### Minimal Clarification Policy
- Do not ask questions unless execution is unsafe or logically blocked.
- Maximum clarification prompts per command: 2.
- Clarification prompt must be decision-critical and single-purpose.

----------------------------------------
2. UNIVERSAL COMMAND RULE
----------------------------------------

If input matches regex `^/[a-z]+(\s|$)` then the agent must:
1. Parse command and arguments.
2. Set `mode = slash-command`.
3. Disable conversational style and narrative prose.
4. Execute only the deterministic flow for that command.
5. Return output strictly using the defined structured schema.
6. If parsing fails, return structured error and stop.

If input does NOT start with `/`, the agent must run implicit command routing:
1. Evaluate whether the input intent maps to one command from this standard.
2. If a single command is selected with sufficient confidence, set `mode = slash-command-auto`.
3. Transform free text into required command inputs using deterministic field mapping.
4. Execute the selected command's deterministic flow.
5. Return output using the same structured schema with selected `command`.
6. If command selection is ambiguous or unsafe, return `status: blocked` with minimal missing inputs.

----------------------------------------
3. COMMAND DEFINITIONS
----------------------------------------

### /plan
#### A. Intent
Generate an executable implementation plan with ordered steps and risk controls.

#### B. When to Use
Use for non-trivial work requiring sequencing, dependencies, and checkpoints.

#### C. Required Inputs
- Objective
- Scope boundaries
- Constraints (security, testing, timeline)

#### D. Deterministic Execution Flow
1. Parse objective and constraints.
2. Identify atomic work units.
3. Compute dependency order.
4. Attach validation checkpoint to each unit.
5. Attach risk and rollback note to each unit.
6. Emit plan artifact.

#### E. Structured Output Template
- `plan_summary`
- `work_units[]`
- `dependency_graph`
- `validation_checkpoints[]`
- `risk_register[]`

#### F. Stop Conditions
- Missing objective or scope.
- Contradictory constraints.

#### G. Safety Constraints
- Must include security and test gates for all code-changing units.

### /task
#### A. Intent
Convert a plan item into a deterministic execution task.

#### B. When to Use
Use when a specific task must be executed with clear acceptance criteria.

#### C. Required Inputs
- Task identifier
- Acceptance criteria
- Allowed files/modules

#### D. Deterministic Execution Flow
1. Resolve task identifier.
2. Validate acceptance criteria completeness.
3. Validate file/module boundaries.
4. Define execution steps.
5. Define verification steps.
6. Emit task contract.

#### E. Structured Output Template
- `task_id`
- `objective`
- `allowed_scope`
- `execution_steps[]`
- `verification_steps[]`
- `acceptance_criteria[]`

#### F. Stop Conditions
- Task not found.
- Acceptance criteria missing.

#### G. Safety Constraints
- Must reject tasks that exceed declared scope.

### /scaffold
#### A. Intent
Create deterministic boilerplate artifacts from declared architecture constraints.

#### B. When to Use
Use to initialize new modules/features with approved structure.

#### C. Required Inputs
- Target feature/module name
- Stack/runtime
- Required architectural patterns

#### D. Deterministic Execution Flow
1. Validate target does not conflict with existing paths.
2. Resolve scaffold template by stack/runtime.
3. Generate file tree.
4. Generate minimal secure defaults.
5. Generate baseline tests.
6. Emit scaffold manifest.

#### E. Structured Output Template
- `target`
- `template_source`
- `files_created[]`
- `secure_defaults[]`
- `tests_created[]`

#### F. Stop Conditions
- Path collision.
- Unsupported runtime/template.

#### G. Safety Constraints
- Must not overwrite existing files without explicit confirmation.

### /fix
#### A. Intent
Apply the smallest safe change that resolves a verified defect.

#### B. When to Use
Use for bugs with reproducible evidence.

#### C. Required Inputs
- Defect description
- Reproduction steps or failing test
- Target scope

#### D. Deterministic Execution Flow
1. Validate defect evidence.
2. Reproduce failure condition.
3. Locate root cause.
4. Generate minimal patch.
5. Execute targeted validation.
6. Emit fix report.

#### E. Structured Output Template
- `defect_id`
- `root_cause`
- `patch_summary`
- `files_changed[]`
- `validation_results[]`

#### F. Stop Conditions
- Failure cannot be reproduced.
- Root cause unresolved.

#### G. Safety Constraints
- Must not broaden scope beyond defect boundary.

### /refactor
#### A. Intent
Improve internal structure without changing externally observable behavior.

#### B. When to Use
Use for maintainability, readability, and modularity improvements.

#### C. Required Inputs
- Target component/module
- Non-functional goals
- Behavior invariants

#### D. Deterministic Execution Flow
1. Capture behavior invariants.
2. Identify refactor units.
3. Apply transformations incrementally.
4. Run invariant checks after each unit.
5. Produce delta and complexity impact.
6. Emit refactor report.

#### E. Structured Output Template
- `target`
- `invariants[]`
- `transformations[]`
- `behavior_check_results[]`
- `complexity_delta`

#### F. Stop Conditions
- Invariant violation.
- Missing behavior baseline.

#### G. Safety Constraints
- Must abort on behavior change risk.

### /audit
#### A. Intent
Run structured engineering audit across security, correctness, and maintainability.

#### B. When to Use
Use before high-impact merges, releases, or external reviews.

#### C. Required Inputs
- Audit scope
- Risk profile
- Compliance/security baseline
- Hardening profile requirement (if applicable)

#### D. Deterministic Execution Flow
1. Resolve audit scope.
2. Run static checks.
3. Run security rule checks.
4. Run dependency and configuration checks.
5. Verify hardening evidence when hardening-required profile applies.
6. Classify findings by severity.
7. Emit audit report.

#### E. Structured Output Template
- `scope`
- `checks_executed[]`
- `findings[]`
- `severity_summary`
- `remediation_plan[]`
- `hardening_evidence_status`

#### F. Stop Conditions
- Scope inaccessible.
- Tooling unavailable.

#### G. Safety Constraints
- Must flag secret leaks and auth bypass as critical.
- Must classify missing hardening verification evidence as release-blocking when hardening is required.

### /perf
#### A. Intent
Evaluate and optimize performance using measurable baselines.

#### B. When to Use
Use when latency, throughput, memory, or build-time regressions are reported.

#### C. Required Inputs
- Performance target metrics
- Baseline environment
- Candidate optimization scope

#### D. Deterministic Execution Flow
1. Capture baseline metrics.
2. Identify bottleneck candidates.
3. Apply one optimization unit.
4. Re-measure metrics.
5. Compare against baseline.
6. Emit performance report.

#### E. Structured Output Template
- `baseline_metrics`
- `optimization_units[]`
- `post_metrics`
- `regression_check`
- `recommendation`

#### F. Stop Conditions
- Baseline unavailable.
- Non-reproducible benchmark.

#### G. Safety Constraints
- Must not trade security for performance.

### /test
#### A. Intent
Generate or execute deterministic test plans and test artifacts.

#### B. When to Use
Use for feature validation, bug regression, and release readiness.

#### C. Required Inputs
- Target scope
- Test level (unit/integration/e2e)
- Expected behavior

#### D. Deterministic Execution Flow
1. Resolve test scope.
2. Map behavior to test cases.
3. Execute or generate tests.
4. Capture pass/fail artifacts.
5. Classify failures.
6. Emit test report.

#### E. Structured Output Template
- `scope`
- `test_matrix[]`
- `execution_results[]`
- `coverage_delta`
- `failures[]`

#### F. Stop Conditions
- Test runtime unavailable.
- Scope undefined.

#### G. Safety Constraints
- Must not mark success if critical tests are skipped.

### /pr
#### A. Intent
Prepare a deterministic pull request payload with implementation evidence.

#### B. When to Use
Use after code changes are validated and ready for review.

#### C. Required Inputs
- Change summary
- Linked issues/tasks
- Validation evidence

#### D. Deterministic Execution Flow
1. Collect changed files.
2. Summarize change intent and impact.
3. Attach test/audit evidence.
4. Classify risk and rollout impact.
5. Generate reviewer checklist.
6. Emit PR package.

#### E. Structured Output Template
- `title`
- `summary`
- `files_changed[]`
- `validation_evidence[]`
- `risk_assessment`
- `review_checklist[]`

#### F. Stop Conditions
- Missing validation evidence.
- Unresolved high severity issues.

#### G. Safety Constraints
- Must block PR package when critical findings remain open.

### /release
#### A. Intent
Produce deterministic release decision and rollout contract.

#### B. When to Use
Use when promoting validated changes to release channels.

#### C. Required Inputs
- Version/tag target
- Change manifest
- Rollback strategy
- Hardening verification evidence (when required by risk profile)

#### D. Deterministic Execution Flow
1. Validate release prerequisites.
2. Validate migration and compatibility risks.
3. Validate security/test gates.
4. Validate hardening verification evidence when hardening-required profile applies.
5. Build release notes.
6. Build rollout and rollback steps.
7. Emit release contract.

#### E. Structured Output Template
- `version`
- `release_readiness`
- `gates[]`
- `rollout_plan[]`
- `rollback_plan[]`
- `release_notes`
- `hardening_verification`

#### F. Stop Conditions
- Gate failure.
- Missing rollback strategy.

#### G. Safety Constraints
- Must block release if any critical gate fails.
- Must block release when required hardening evidence is missing.

### /docs
#### A. Intent
Generate or update documentation with traceable alignment to implemented behavior.

#### B. When to Use
Use when code, APIs, workflows, or operations change.

#### C. Required Inputs
- Documentation scope
- Source changes
- Target audience

#### D. Deterministic Execution Flow
1. Resolve source-of-truth artifacts.
2. Extract behavior/API deltas.
3. Map deltas to docs sections.
4. Apply concise updates.
5. Validate examples/commands.
6. Emit docs change report.

#### E. Structured Output Template
- `scope`
- `sources[]`
- `sections_updated[]`
- `example_validation`
- `follow_up_actions[]`

#### F. Stop Conditions
- Source artifacts missing.
- Behavioral ambiguity unresolved.

#### G. Safety Constraints
- Must not publish secrets, tokens, or internal credentials.

----------------------------------------
4. SAFETY & DESTRUCTIVE ACTION FRAMEWORK
----------------------------------------

The agent must enforce the following hard rules:

1. Production database drops are prohibited by default.
	- Require explicit token: `CONFIRM-DESTRUCTIVE:prod-db-drop`.
	- Require backup verification artifact before execution.

2. Secret exposure is prohibited.
	- Never output full secrets, API keys, private tokens, or credentials.
	- Redact using fixed mask pattern: `****REDACTED****`.

3. Mass deletions are prohibited without threshold and confirmation.
	- If deletion target count > 20 files, block and escalate.
	- Require explicit token: `CONFIRM-DESTRUCTIVE:mass-delete`.

4. Forced migrations are prohibited by default.
	- Block destructive/irreversible migrations without rollback artifact.
	- Require explicit token: `CONFIRM-DESTRUCTIVE:forced-migration`.

5. Security bypass is prohibited.
	- Never disable authentication, authorization, validation, or rate limiting to pass checks.

6. Dependency upgrades require impact analysis.
	- Must provide compatibility matrix, changelog risk scan, and test impact summary.
	- If missing, set `status: blocked`.

----------------------------------------
5. FAILURE MODES
----------------------------------------

### Insufficient Context
1. Return `status: blocked`.
2. Return `blocker_type: insufficient_context`.
3. Request only decision-critical missing inputs.

### Conflicting Instructions
1. Return `status: blocked`.
2. Return `blocker_type: conflicting_instructions`.
3. List conflicts with deterministic precedence order:
	- Safety rules
	- Explicit non-negotiable constraints
	- Command contract
	- Secondary preferences

### High-Risk Change Detected
1. Return `status: blocked` unless explicit confirmation token is present.
2. Return `blocker_type: high_risk_change`.
3. Provide `safe_alternative` path.

### Unknown Framework Detected
1. Return `status: blocked`.
2. Return `blocker_type: unknown_framework`.
3. Fallback to technology-agnostic baseline rules from `agent-docs/ARCHITECTURE.md` and request minimum framework metadata.

----------------------------------------
6. EXAMPLE USAGE
----------------------------------------

### Example 1
User input:
`/plan objective="Implement deterministic slash commands" scope="AGENTS docs only" constraints="security,test"`

Expected output structure:
- `command: /plan`
- `execution_id: <uuid>`
- `mode: slash-command`
- `status: completed`
- `inputs: {...}`
- `prechecks: [...]`
- `execution_log: [...]`
- `artifacts: { plan_summary, work_units, dependency_graph }`
- `risks: [...]`
- `safety_checks: [...]`
- `stop_condition: none`
- `next_action: /task`

### Example 2
User input:
`/fix defect="Null pointer in auth middleware" evidence="failing test auth.middleware.spec"`

Expected output structure:
- `command: /fix`
- `execution_id: <uuid>`
- `mode: slash-command`
- `status: completed|blocked`
- `inputs: {...}`
- `prechecks: [...]`
- `execution_log: [...]`
- `artifacts: { root_cause, patch_summary, files_changed, validation_results }`
- `risks: [...]`
- `safety_checks: [...]`
- `stop_condition: <reason|null>`
- `next_action: /test`

### Example 3
User input:
`/release version="v2.4.0"`

Expected output structure:
- `command: /release`
- `execution_id: <uuid>`
- `mode: slash-command`
- `status: blocked` (if any gate fails)
- `inputs: {...}`
- `prechecks: [...]`
- `execution_log: [...]`
- `artifacts: { release_readiness, gates, rollout_plan, rollback_plan }`
- `risks: [...]`
- `safety_checks: [...]`
- `stop_condition: gate_failure|none`
- `next_action: resolve_failed_gates`

## Critical Rules (Always Apply)

### Security-First Development
- **Validate all inputs** at application boundaries with schema validation
- **Authenticate and authorize** every protected endpoint
- **Rate limit** public endpoints to prevent abuse
- **Sanitize outputs** to prevent injection attacks
- **Never expose sensitive data** in error messages or logs

### Testing Requirements
- **Unit tests**: 80% coverage for business logic
- **Integration tests**: 15% coverage for API endpoints and database operations
- **E2E tests**: 5% coverage for critical user journeys
- **Accessibility tests**: WCAG 2.1 AA compliance for all UI

### Code Quality
- **Type safety**: Use strong typing, validate at boundaries
- **Performance**: Monitor bundle/binary size, implement lazy loading
- **Accessibility**: WCAG 2.1 AA compliance for user-facing components
- **Documentation**: Keep README and agent-docs/ARCHITECTURE.md updated

## Architecture Principles

- **Technology-agnostic**: Adapt patterns to chosen technology stack
- **Security-first**: Always consider security implications first
- **Feature-oriented**: Group by domain/feature, not just technical layer
- **Type-safe**: Strong typing with runtime validation at boundaries
- **Test-driven**: Comprehensive testing at all levels

## Quick Reference

### For UI/Design Work
→ Apply `agents/rules/frontend.mdc` patterns
→ Ensure WCAG 2.1 AA accessibility compliance

### For API/Business Logic
→ Apply `agents/rules/security.mdc` for authentication/validation
→ Apply `agents/rules/testing.mdc` for test coverage

### For Database Work
→ Apply `agents/rules/database.mdc` patterns
→ Use ORM/ODM patterns, avoid raw SQL

### For Security Reviews
→ Apply `agents/rules/security.mdc` comprehensively
→ Apply `agents/rules/hardening.mdc` for hardening profile and obfuscation decisions
→ Check OWASP Top 10 compliance

## When in Doubt

1. Review `agent-docs/ARCHITECTURE.md` for architecture decisions
2. Reference the specific `agents/rules/*.mdc` file for detailed patterns
3. Always prioritize security and testing requirements

---

**Remember**: This is a technology-agnostic template. Adapt all patterns to the chosen technology stack while maintaining the core principles of security, testing, and code quality.
