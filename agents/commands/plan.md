# /plan

## A. Intent
Generate an executable implementation plan with ordered steps and risk controls.

## B. When to Use
Use for non-trivial work requiring sequencing, dependencies, and checkpoints.

## C. Required Inputs
- Objective
- Scope boundaries
- Constraints

## D. Deterministic Execution Flow
1. Parse objective and constraints.
2. Extract atomic work units.
3. Compute dependency order.
4. Attach validation checkpoints.
5. Attach risk and rollback notes.
6. Emit plan artifacts.

## E. Structured Output Template
- `plan_summary`
- `work_units[]`
- `dependency_graph`
- `validation_checkpoints[]`
- `risk_register[]`

## F. Stop Conditions
- Missing objective or scope.
- Contradictory constraints.

## G. Safety Constraints
- Include security and testing gates for code-changing units.
