# /arch-check

## A. Intent
Validate architecture decisions, dependency boundaries, and failure handling before coding.

## B. When to Use
Use after scope lock and before implementation starts.

## C. Required Inputs
- Scoped feature set
- Existing system boundaries
- Non-functional requirements

## D. Deterministic Execution Flow
1. Map data and control flow.
2. Identify component boundaries.
3. Enumerate failure modes.
4. Define testing and validation checkpoints.
5. Emit architecture decision set.

## E. Structured Output Template
- `architecture_summary`
- `boundaries[]`
- `data_flow`
- `failure_modes[]`
- `validation_plan[]`

## F. Stop Conditions
- Critical dependency unclear.
- Failure modes not covered.

## G. Safety Constraints
- Include security and testing gates for each critical path.
