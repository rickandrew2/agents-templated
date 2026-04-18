# /test-data

## A. Intent
Produce deterministic fixtures, seeds, and mocks for downstream validation, e2e, and load phases.

## B. When to Use
- Use when QA design or backend/database changes require repeatable datasets.
- Use before `qa-specialist(mode=validation)`, `e2e-runner`, or `performance-specialist(mode=load)`.

## C. Context Assumptions
- Acceptance criteria and target test flows are defined.
- Data shape constraints are known.
- Generated data can be reset safely.

## D. Required Inputs
| Input | Type | Example |
|---------------------|------------|----------------------------------|
| `consumer_targets` | string[] | ["qa-validation", "e2e", "perf-load"] |
| `dataset_scope` | string | "orders with edge-case payment states" |
| `data_constraints` | string[] | ["no PII", "stable IDs", "seed-controlled randomness"] |

## E. Pre-Execution Guards <- fail fast, check ALL before running
- [ ] dataset scope is explicit and bounded
- [ ] production secrets and real PII are excluded
- [ ] setup/reset path is defined and reversible

## F. Execution Flow
1. Confirm required consumer targets and edge cases.
2. Build deterministic fixtures/seeds/mocks.
3. Package setup/reset instructions.
4. Validate data reproducibility and cleanup safety.
5. Emit test-data handoff report.

## G. Output Schema

```json
{
  "data_package_id": "string",
  "assets": ["array", "of", "strings"],
  "setup_steps": ["array", "of", "strings"],
  "reset_steps": ["array", "of", "strings"],
  "handoff_targets": ["array", "of", "strings"]
}
```

## H. Output Target
- Default delivery: stdout
- Override flag: --output=<target>

## I. Stop Conditions <- abort with error message, never emit partial output
- dataset constraints are ambiguous or contradictory
- setup/reset cannot be executed safely

## J. Safety Constraints
- Hard block: never use production credentials or real PII
- Warn only: warn when synthetic distributions are approximate
