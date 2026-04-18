# Slash Command Output Schema

All slash command responses MUST include the following top-level fields:

- `command`
- `execution_id`
- `mode`
- `status`
- `inputs`
- `prechecks`
- `execution_log`
- `artifacts`
- `risks`
- `safety_checks`
- `stop_condition`
- `next_action`

Optional orchestration fields:
- `artifacts.scenario`
- `artifacts.scenario_reason`
- `artifacts.phases[]`
- `artifacts.phases[].optional_subagents[]`
- `artifacts.phases[].invocation_mode`
- `artifacts.phases[].handoff_inputs[]`
- `artifacts.deprecation_notices[]`
- `execution_log[].orchestration_phase`
- `execution_log[].routed_subagent`
- `execution_log[].routed_track`
- `execution_log[].routed_skills`
- `execution_log[].optional_subagents[]`
- `execution_log[].invocation_mode`
- `execution_log[].handoff_inputs[]`

Constraints:
- `mode` MUST be one of: `slash-command`, `slash-command-auto`.
- `status` MUST be one of: `completed`, `blocked`, `failed`.
- If a field value is unknown, set it to `null`.
- Unknown or malformed slash commands MUST return structured error output and stop.
- In `slash-command-auto` mode, orchestration chains MUST stop on first `blocked` or `failed` phase and return a non-null `stop_condition`.
- Optional subagent delegation MUST remain non-required and scenario-conditioned.
- For `qa-specialist` and `performance-specialist`, orchestrator invocation MUST include an explicit mode.
- Missing or unsupported mode for mode-locked specialists MUST return `status=blocked` with a non-null `stop_condition`.