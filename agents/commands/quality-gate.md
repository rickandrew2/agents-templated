# /quality-gate

## A. Intent
Enforce quality gates using test signals, behavior checks, and regression controls.

## B. When to Use
Use before release, and after major bug fixes.

## C. Required Inputs
- Target build/revision
- Test scope
- Critical user flows

## D. Deterministic Execution Flow
1. Run required test layers.
2. Validate critical user flows.
3. Inspect flaky or unstable results.
4. Define required remediations.
5. Emit pass/conditional/block outcome.

## E. Structured Output Template
- `test_results[]`
- `critical_flow_status[]`
- `quality_findings[]`
- `required_fixes[]`
- `gate_status`

## F. Stop Conditions
- Critical flow untested.
- Required tests failed.

## G. Safety Constraints
- Do not mark pass when critical regressions remain open.
