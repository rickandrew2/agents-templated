# /release-ready

## A. Intent
Validate release readiness with checks for quality, risk, and rollback.

## B. When to Use
Use immediately before opening or merging a release PR.

## C. Required Inputs
- Change summary
- Validation evidence
- Deployment path

## D. Deterministic Execution Flow
1. Confirm test and quality gate outcomes.
2. Confirm risk-review status.
3. Verify migration and deploy prerequisites.
4. Verify rollback plan.
5. Emit release readiness decision.

## E. Structured Output Template
- `release_scope`
- `checks_passed[]`
- `blocking_issues[]`
- `rollback_plan`
- `ready_status`

## F. Stop Conditions
- Blocking issue unresolved.
- Rollback plan absent.

## G. Safety Constraints
- Do not approve release when required evidence is missing.
