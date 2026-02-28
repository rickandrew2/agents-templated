# /docs

## A. Intent
Generate or update documentation aligned to implemented behavior.

## B. When to Use
Use when code, APIs, operations, or workflows change.

## C. Required Inputs
- Documentation scope
- Source changes
- Target audience

## D. Deterministic Execution Flow
1. Resolve source-of-truth artifacts.
2. Extract behavior and API deltas.
3. Map deltas to sections.
4. Apply concise updates.
5. Validate examples/commands.
6. Emit docs change report.

## E. Structured Output Template
- `scope`
- `sources[]`
- `sections_updated[]`
- `example_validation`
- `follow_up_actions[]`

## F. Stop Conditions
- Missing source artifacts.
- Unresolved ambiguity.

## G. Safety Constraints
- Do not publish secrets, tokens, or credentials.
