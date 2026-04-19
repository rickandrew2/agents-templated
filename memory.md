# Lessons

### [CONFIG] Missing subagents in npm tarball
- **Symptom**: `npm pack --dry-run` did not list `templates/.claude/agents/*` even though subagent install flow expected those files.
- **Root Cause**: Template subagent files were not present under `templates/.claude/agents` in the local tree used for packaging.
- **Fix**: Ensure `templates/.claude/agents` exists with all subagent `.md` files, then verify with `npm pack --dry-run`; keep an explicit `files` manifest entry for `templates/.claude/agents` in `package.json`.
- **Avoid**: Do not assume source `.claude/agents` is automatically mirrored into `templates/.claude/agents` before publish.
- **Date**: 2026-04-19
