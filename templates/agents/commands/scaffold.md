# /scaffold

## A. Intent
Create deterministic project/module boilerplate with secure defaults.

## B. When to Use
Use to initialize new modules/features with approved structure.

## C. Required Inputs
- Target module name
- Runtime/stack
- Required patterns

## D. Deterministic Execution Flow
1. Validate target path non-conflict.
2. Resolve scaffold template.
3. Generate file tree.
4. Apply secure defaults.
5. Generate baseline tests.
6. Emit scaffold manifest.

## E. Structured Output Template
- `target`
- `template_source`
- `files_created[]`
- `secure_defaults[]`
- `tests_created[]`

## F. Stop Conditions
- Path collision.
- Unsupported template/runtime.

## G. Safety Constraints
- Do not overwrite existing files without explicit confirmation.
