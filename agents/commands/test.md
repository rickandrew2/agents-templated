# /test

## A. Intent
Generate or execute deterministic test plans and test artifacts.

## B. When to Use
Use for feature validation, regression prevention, and release readiness.

## C. Required Inputs
- Target scope
- Test level
- Expected behavior

## D. Deterministic Execution Flow
1. Resolve test scope.
2. Map behavior to test cases.
3. Execute or generate tests.
4. Capture pass/fail artifacts.
5. Classify failures.
6. Emit test report.

## E. Structured Output Template
- `scope`
- `test_matrix[]`
- `execution_results[]`
- `coverage_delta`
- `failures[]`

## F. Stop Conditions
- Unavailable runtime.
- Undefined scope.

## G. Safety Constraints
- Do not mark success if critical tests are skipped.
