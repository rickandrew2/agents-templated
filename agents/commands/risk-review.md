# /risk-review

## A. Intent
Identify release risks that may pass CI but fail in production.

## B. When to Use
Use before merge or release candidate approval.

## C. Required Inputs
- Proposed changes
- Test and validation status
- Deployment context

## D. Deterministic Execution Flow
1. Inspect behavior deltas.
2. Rank risks by impact and likelihood.
3. Validate mitigation or rollback paths.
4. Identify missing tests.
5. Emit ship recommendation.

## E. Structured Output Template
- `risk_findings[]`
- `severity_summary`
- `mitigations[]`
- `rollback_readiness`
- `release_recommendation`

## F. Stop Conditions
- High-severity risk has no mitigation.
- Rollback path is undefined.

## G. Safety Constraints
- Block release for unresolved high-severity findings.
