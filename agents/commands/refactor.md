# /refactor

## A. Intent
Improve internal structure without changing externally observable behavior.

## B. When to Use
Use for maintainability and modularity improvements.

## C. Required Inputs
- Target component/module
- Non-functional goals
- Behavior invariants

## D. Deterministic Execution Flow
1. Capture behavior invariants.
2. Define refactor units.
3. Apply one unit at a time.
4. Verify invariants after each unit.
5. Measure complexity delta.
6. Emit refactor report.

## E. Structured Output Template
- `target`
- `invariants[]`
- `transformations[]`
- `behavior_check_results[]`
- `complexity_delta`

## F. Stop Conditions
- Invariant violation.
- Missing baseline behavior.

## G. Safety Constraints
- Abort on behavior-change risk.
