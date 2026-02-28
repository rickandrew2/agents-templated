# /fix

## A. Intent
Apply the smallest safe change that resolves a verified defect.

## B. When to Use
Use for bugs with reproducible evidence.

## C. Required Inputs
- Defect description
- Reproduction evidence
- Target scope

## D. Deterministic Execution Flow
1. Validate defect evidence.
2. Reproduce failure.
3. Locate root cause.
4. Generate minimal patch.
5. Execute targeted validation.
6. Emit fix report.

## E. Structured Output Template
- `defect_id`
- `root_cause`
- `patch_summary`
- `files_changed[]`
- `validation_results[]`

## F. Stop Conditions
- Non-reproducible failure.
- Root cause unresolved.

## G. Safety Constraints
- Do not broaden scope beyond defect boundary.
