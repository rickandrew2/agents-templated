# /docs-sync

## A. Intent
Keep documentation aligned with shipped behavior and contract changes.

## B. When to Use
Use after implementation or release-prep changes.

## C. Required Inputs
- Code changes summary
- Updated behavior/contracts
- Target documentation set

## D. Deterministic Execution Flow
1. Identify behavior and API changes.
2. Locate affected docs.
3. Update docs with minimal accurate edits.
4. Verify examples and command references.
5. Emit documentation update summary.

## E. Structured Output Template
- `docs_updated[]`
- `behavior_changes[]`
- `contract_updates[]`
- `example_checks[]`
- `remaining_doc_gaps[]`

## F. Stop Conditions
- Behavior changed with no corresponding doc update.
- Example commands are unverified.

## G. Safety Constraints
- Do not publish stale setup or command instructions.
