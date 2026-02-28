# /task

## A. Intent
Convert a plan item into a deterministic execution task.

## B. When to Use
Use for bounded work with clear acceptance criteria.

## C. Required Inputs
- Task identifier
- Acceptance criteria
- Allowed scope

## D. Deterministic Execution Flow
1. Resolve task identifier.
2. Validate acceptance criteria completeness.
3. Validate scope boundaries.
4. Define execution steps.
5. Define verification steps.
6. Emit task contract.

## E. Structured Output Template
- `task_id`
- `objective`
- `allowed_scope`
- `execution_steps[]`
- `verification_steps[]`
- `acceptance_criteria[]`

## F. Stop Conditions
- Unknown task identifier.
- Missing acceptance criteria.

## G. Safety Constraints
- Reject out-of-scope changes.
