# /perf-scan

## A. Intent
Measure baseline performance and detect regressions with deterministic thresholds.

## B. When to Use
Use before and after performance-sensitive changes.

## C. Required Inputs
- Baseline context
- Target endpoints or flows
- Performance thresholds

## D. Deterministic Execution Flow
1. Capture baseline metrics.
2. Execute candidate workload.
3. Compare p95/p99 latency and error rates.
4. Flag regressions with threshold deltas.
5. Emit optimization priorities.

## E. Structured Output Template
- `baseline_metrics`
- `candidate_metrics`
- `regressions[]`
- `threshold_checks[]`
- `recommendations[]`

## F. Stop Conditions
- Baseline missing.
- Thresholds undefined.

## G. Safety Constraints
- Avoid performance claims without before/after evidence.
