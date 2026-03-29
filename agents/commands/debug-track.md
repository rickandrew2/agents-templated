# /debug-track

## A. Intent
Produce a root-cause-first defect investigation path with bounded fixes.

## B. When to Use
Use for bugs, regressions, and unexpected runtime behavior.

## C. Required Inputs
- Defect symptom
- Reproduction context
- Expected behavior

## D. Deterministic Execution Flow
1. Reproduce defect consistently.
2. Trace data and execution path.
3. Confirm root cause with evidence.
4. Propose minimal patch.
5. Validate fix and regression safety.

## E. Structured Output Template
- `reproduction_steps[]`
- `root_cause`
- `affected_surface[]`
- `patch_plan`
- `regression_checks[]`

## F. Stop Conditions
- Defect not reproducible.
- Root cause remains unverified.

## G. Safety Constraints
- Do not patch symptoms without root-cause evidence.
