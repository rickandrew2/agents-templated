# /audit

## A. Intent
Run structured engineering audit across security, correctness, and maintainability.

## B. When to Use
Use before high-impact merges, releases, and external reviews.

## C. Required Inputs
- Audit scope
- Risk profile
- Compliance baseline
- Hardening profile requirement (if applicable)

## D. Deterministic Execution Flow
1. Resolve audit scope.
2. Run static checks.
3. Run security checks.
4. Run dependency/config checks.
5. Verify hardening evidence when hardening-required profile applies.
6. Classify findings by severity.
7. Emit audit report.

## E. Structured Output Template
- `scope`
- `checks_executed[]`
- `findings[]`
- `severity_summary`
- `remediation_plan[]`
- `hardening_evidence_status`

## F. Stop Conditions
- Inaccessible scope.
- Unavailable tooling.

## G. Safety Constraints
- Classify secret leaks and auth bypass as critical.
- Classify missing hardening verification evidence as release-blocking when hardening is required.
