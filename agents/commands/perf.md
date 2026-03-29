# /perf

## A. Intent
Evaluate and optimize performance using measurable baselines.

## B. When to Use
Use when latency, throughput, memory, or build-time regressions are reported.

## C. Required Inputs
- Target metrics
- Baseline environment
- Optimization scope

## D. Deterministic Execution Flow
1. Capture baseline metrics.
2. Identify bottlenecks.
3. Apply one optimization unit.
4. Re-measure metrics.
5. Compare against baseline.
6. Emit performance report.

## E. Structured Output Template
- `baseline_metrics`
- `optimization_units[]`
- `post_metrics`
- `regression_check`
- `recommendation`

## F. Stop Conditions
- Missing baseline metrics.
- Non-reproducible benchmark.

## G. Safety Constraints
- Do not trade security controls for performance.
