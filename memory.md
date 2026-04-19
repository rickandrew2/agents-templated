# Lessons

### [CONFIG] Missing subagents in npm tarball
- **Symptom**: `npm pack --dry-run` did not list `templates/.claude/agents/*` even though subagent install flow expected those files.
- **Root Cause**: Template subagent files were not present under `templates/.claude/agents` in the local tree used for packaging.
- **Fix**: Ensure `templates/.claude/agents` exists with all subagent `.md` files, then verify with `npm pack --dry-run`; keep an explicit `files` manifest entry for `templates/.claude/agents` in `package.json`.
- **Avoid**: Do not assume source `.claude/agents` is automatically mirrored into `templates/.claude/agents` before publish.
- **Date**: 2026-04-19

### [OTHER] Tar stream line counts can be misleading
- **Symptom**: Comparing template line counts to `tar -xOf <tgz> ... | Measure-Object -Line` showed false mismatches.
- **Root Cause**: Streaming external `tar` output through PowerShell can normalize or drop blank-line objects in ways that distort line counting.
- **Fix**: Extract package files to a temp directory (`tar -xf`) and compare extracted files with `Get-Content` and `Get-FileHash`.
- **Avoid**: Do not rely on streamed `tar -xOf` line counts for parity checks.
- **Date**: 2026-04-19

### [OTHER] Apparent line mismatch after template edits
- **Symptom**: Earlier checks showed old line counts (QA 92 / Frontend 79) while expected counts were higher after edits.
- **Root Cause**: The repository content had not yet been synchronized and verified end-to-end against package output after edits.
- **Fix**: Re-check on-disk files with `Get-Content`, sync `.claude/agents` and `templates/.claude/agents`, then validate with `npm pack` extraction and hash parity.
- **Avoid**: Do not assume editor-visible state is already reflected in publish artifacts without a fresh disk+pack verification.
- **Date**: 2026-04-19
