# /release

## A. Intent
Produce deterministic release readiness decision and rollout contract.

## B. When to Use
Use when promoting validated changes to release channels.

## C. Required Inputs
- Version/tag
- Change manifest
- Rollback strategy
- Hardening verification evidence (when required by risk profile)

## D. Deterministic Execution Flow
1. Validate release prerequisites.
2. Validate compatibility and migration risks.
3. Validate security and test gates.
4. Validate hardening verification evidence when hardening-required profile applies.
5. Build release notes.
6. Build rollout and rollback steps.
7. Emit release contract.

## E. Structured Output Template
- `version`
- `release_readiness`
- `gates[]`
- `rollout_plan[]`
- `rollback_plan[]`
- `release_notes`
- `hardening_verification`

## F. Stop Conditions
- Gate failure.
- Missing rollback strategy.

## G. Safety Constraints
- Block release when any critical gate fails.
- Block release when required hardening evidence is missing.
