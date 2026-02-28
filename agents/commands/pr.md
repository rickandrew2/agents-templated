# /pr

## A. Intent
Prepare a deterministic pull request payload with implementation evidence.

## B. When to Use
Use after validated changes are ready for review.

## C. Required Inputs
- Change summary
- Linked issues/tasks
- Validation evidence

## D. Deterministic Execution Flow
1. Collect changed files.
2. Summarize intent and impact.
3. Attach validation evidence.
4. Classify risk and rollout impact.
5. Build reviewer checklist.
6. Emit PR package.

## E. Structured Output Template
- `title`
- `summary`
- `files_changed[]`
- `validation_evidence[]`
- `risk_assessment`
- `review_checklist[]`

## F. Stop Conditions
- Missing validation evidence.
- Open critical findings.

## G. Safety Constraints
- Block PR package when critical issues remain unresolved.
