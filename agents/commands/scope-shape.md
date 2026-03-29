# /scope-shape

## A. Intent
Constrain scope to the smallest high-leverage release that still proves value.

## B. When to Use
Use after problem framing and before architecture planning.

## C. Required Inputs
- Problem frame
- Candidate feature list
- Delivery constraints

## D. Deterministic Execution Flow
1. Rank features by impact and effort.
2. Define must-have vs defer list.
3. Freeze first-release boundaries.
4. Add explicit out-of-scope items.
5. Emit scope decision rationale.

## E. Structured Output Template
- `scope_in[]`
- `scope_out[]`
- `tradeoffs[]`
- `release_goal`
- `defer_queue[]`

## F. Stop Conditions
- Scope still exceeds constraints.
- No out-of-scope list produced.

## G. Safety Constraints
- Prefer one reversible release over broad irreversible scope.
