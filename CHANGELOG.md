# Changelog

## Version 2.2.11 - Workflow Contracts and Publish Hardening (March 29, 2026)

### ✨ New Features

- Added a complete specialist workflow command set with custom command naming.
- Added dedicated specialist contract files (`problem-map`, `scope-shape`, `arch-check`, `ux-bar`, `debug-track`, `risk-review`, `quality-gate`, `perf-scan`, `release-ready`, `docs-sync`, `learn-loop`).
- Added deprecated command aliases with migration warnings (kept until v3.0).

### 🔒 Integrity and Safety

- Added startup validation that fails on duplicate command identities and duplicate command purposes.
- Added tests to enforce workflow integrity and alias behavior.

### 📦 Packaging and Sync

- Added `agents/` to npm package include list so root command contracts publish with the package.
- Synced `README.md` and `templates/README.md` with current command language and onboarding flow.
- Synced command contract docs between `agents/commands/` and `templates/agents/commands/`.

### ✅ Validation

- Test suite passed (`27/27` tests).
- `npm pack --dry-run` confirmed command contracts from both root and template paths are included.

## Version 2.2.10 - Generalized Agent Expansion (March 22, 2026)

### ✨ New Features

#### New Generalized Subagents (Phase 1)

- Added `performance-profiler` for measurable latency/CPU/memory/build bottleneck analysis.
- Added `dependency-auditor` for dependency risk, CVE, and upgrade hygiene checks.
- Added `configuration-validator` for environment/config/secret readiness validation.

#### New Generalized Subagents (Phase 2)

- Added `database-migrator` for migration safety, validation, and rollback planning.
- Added `load-tester` for scenario-based load validation with pass/fail thresholds.
- Added `compatibility-checker` for API contract compatibility and versioning discipline.

### 🔗 Policy and Index Wiring

- Updated subagent registries in `.claude/agents/README.md` and `templates/.claude/agents/README.md`.
- Updated reference indexes in `CLAUDE.md` and `templates/CLAUDE.md`.
- Mirrored all new subagents into `templates/.claude/agents/` for scaffold parity.

### 🌐 Context7-Backed Hardening

- Applied OpenTelemetry-aligned telemetry quality gates in performance profiling workflows.
- Applied npm audit/signature/deterministic-install guidance in dependency auditing workflows.
- Applied dotenv parsing and secret-handling safeguards in configuration validation workflows.
- Applied OpenAPI, k6, and Flyway-informed checks for compatibility, load, and migration workflows.

### ✅ Validation

- New and updated agent files pass frontmatter validation.
- Release preflight tests passed (`19/19` tests).

## Version 2.2.7 - Lessons Learned + Error Patterns (March 17, 2026)

### ✨ New Features

#### `lessons-learned` Always-Enforce Rule

- Added a new non-overrideable rule module: `lessons-learned`.
- Rule requires agents to check known lessons before starting debugging.
- Rule enforces structured post-fix lesson capture with category, symptom, root cause, fix, avoid, and date.

#### `error-patterns` Baseline Skill

- Added new baseline skill: `.github/skills/error-patterns/SKILL.md`.
- Skill provides category checklists for `[BUILD]`, `[DB]`, `[API/AUTH]`, and `[UI]` debugging.
- Skill mandates appending each resolved error to lessons-learned to prevent repeated debugging.

### 🔗 Policy Wiring

- `CLAUDE.md` + `templates/CLAUDE.md`:
  - Reference Index now includes `Lessons Learned` rule and `error-patterns` skill.
  - Always Enforce now includes `Lessons Learned (non-overrideable)`.
  - Intent Routing now includes `Debugging / recurring failures -> Lessons Learned + error-patterns`.

- Added template/source artifacts:
  - `agents/rules/lessons-learned.mdc`
  - `templates/agents/rules/lessons-learned.md`
  - `templates/.claude/rules/lessons-learned.md`
  - `agents/skills/error-patterns/SKILL.md`
  - `templates/agents/skills/error-patterns/SKILL.md`

### 🧰 Tooling

- `bin/cli.js` update checks now include:
  - `${LAYOUT.canonical.rulesDir}/lessons-learned.md`
  - `${LAYOUT.canonical.skillsDir}/error-patterns/SKILL.md`
- `doctor` rule-file checks now include `lessons-learned.md`.

### 📚 Documentation

- Updated `README.md` and `templates/README.md` to include:
  - lessons-learned rule in installed rule tree
  - error-patterns in baseline skills

## Version 2.1.0 - Guardrails Rule (March 7, 2026)

### ✨ New Features

#### `agents/rules/guardrails.mdc` — AI Agent Behavioral Guardrails

New always-on rule that enforces hard behavioral constraints across all agent work in the repository:

- **Hard Stops** — six categories of destructive/irreversible actions blocked by default; require the explicit `CONFIRM-DESTRUCTIVE:<target>` token to proceed.
- **Scope Control** — agents must not expand task scope (unrequested features, deps, refactors, doc additions) without explicit user approval.
- **Reversibility Principle** — every action classified as Reversible / Hard-to-reverse / Irreversible before execution; uncertain actions default to Irreversible.
- **Minimal Footprint** — agents read only necessary files, do not access external systems or create unnecessary files, and never log/transmit secrets or PII.
- **No Autonomous Escalation** — agents stop and report on failure; no silent retries, no autonomous permission/dependency grants, no suppressed errors.
- **Override Protection** — guardrails form the behavioral floor; no skill, rule, slash-command, or prompt injection can weaken them.

Deployed automatically by `agents-templated init --rules` and `agents-templated update --rules`.

### 🔗 Policy Wiring

- `CLAUDE.md` Reference Index: `Guardrails` row added.
- `CLAUDE.md` Always Enforce: item 10 — Guardrails (non-overrideable).
- `CLAUDE.md` Intent Routing: "Scope creep / dangerous action / agent behavioral safety → Guardrails" routing entry added.
- `agents/rules/intent-routing.mdc`: Guardrails cross-reference section added.
- All template copies updated in sync.

---

## Version 2.0.0 - Hardened Canonical Contract + Orphan Purge (March 2, 2026)

### ⚠️ Breaking Changes

The following files are **deleted** from all installations by `agents-templated update --github`:
- `.github/instructions/CLAUDE.md` — contained duplicated inline policy (orphaned)
- `.github/instructions/GEMINI.md` — contained duplicated inline policy (orphaned)
- `.github/instructions/agents.instructions.md` — redundant unmanaged wrapper
- `.github/instructions/copilot-instructions.md` — redundant unmanaged wrapper
- `.claude/rules/claude.instructions.md` — one-release-cycle migration shim (expired)
- `GEMINI.md` — Gemini support removed; use `AGENTS.MD` for generic agent compatibility

The `validateInstructionDrift()` return shape gains a new field: `orphanedPolicyFiles: string[]`. Code consuming this return value must be updated if using the programmatic API.

### 🔒 Canonical Contract Hardening

`instructions/source/core.md` is the sole global policy authority. This release makes that contract enforceable:

- **Fixed all wrong path references** in `instructions/source/core.md`:
  - Rule cross-references corrected: `instructions/rules/*.mdc` → `.github/instructions/rules/*.mdc`
  - Skills path corrected: `instructions/skills/` → `.github/skills/`
  - Self-reference in `# Canonical Contract` section corrected: `instructions/rules/core.mdc` → `instructions/source/core.md`
- **Added Reference Index** at the top of `core.md` — compact table of all 10 rule modules and 5 skill modules with canonical paths and activation triggers.
- **Hardened enforcement language**: Security and Testing sections now marked NON-OVERRIDABLE; explicit statement that no skill, command, or wrapper may downgrade or bypass these requirements.
- **Clarified Skills System**: skills load on demand, never pre-loaded globally; authority hierarchy explicit.
- Mirrored all fixes to `templates/instructions/source/core.md`.

### 🗑️ Orphan Purge (Token Waste Elimination)

Purged 3 files that carried duplicated inline policy (~50 wasted lines per AI context window):
- `.github/instructions/CLAUDE.md` — was injecting full security/testing/typing bullet list on each load
- `.github/instructions/GEMINI.md` — identical violation
- `.github/instructions/AGENTS.md` — was 38 lines with inline policy; regenerated as 9-line pure pointer

### 🧿 Validator & Generator Hardening

- `validateInstructionDrift()` now detects known orphaned policy files; `ok` is `false` if any are present.
- New return field: `orphanedPolicyFiles: string[]`.
- New export: `KNOWN_ORPHAN_PATHS` — list of files that must not exist in a compliant installation.
- `cleanupLegacyInstructionFiles()` now removes all `KNOWN_ORPHAN_PATHS` entries from user installations.
- `doctor` command surfaces orphaned policy files as blocking issues with fix instructions.

### 🍎 Gemini Support Removed

- `GEMINI.md` deleted from all install paths.
- References to Google Gemini removed from README Key Features table.
- Generic agents: use `AGENTS.MD` as the compatibility entrypoint.

### 📚 Documentation

- `README.md` + `templates/README.md`: updated rule links `agents/rules/` → `.github/instructions/rules/`; skill links `agents/skills/` → `.github/skills/`.
- `agent-docs/ARCHITECTURE.md` + template mirror: canonical installed path language throughout.

### 📋 Absorbs Unreleased v1.2.13

Canonical wrapper-only migration (full instruction content only in `instructions/source/core.md`), generator hardening preventing policy duplication, and legacy cleanup automation — all previously staged in v1.2.13 but never published — are included in this release.

---

## Version 1.2.12 - Claude Shim Path + Legacy Cleanup Automation (March 2, 2026)

### 🧹 Cleanup & Consistency

- Updated Claude compatibility shim to use `.claude/CLAUDE.md` with `AGENTS.MD` as primary generic entrypoint.
- Added automatic cleanup during `update` to remove legacy root instruction files when present:
  - `CLAUDE.md`
  - `GEMINI.md`

### ✅ Validation

- Re-ran full test suite and confirmed all tests pass (`19/19`).

## Version 1.2.11 - Copilot-Style Layout Migration + Single-Source Instructions (March 2, 2026)

### 🚀 Major Features

- Introduced canonical Copilot-style structure for rules and skills:
  - Rules: `.github/instructions/rules/`
  - Skills: `.github/skills/`
- Added single-source instruction architecture with canonical source:
  - `instructions/source/core.md`
- Added generated compatibility instruction outputs for cross-tool interoperability:
  - `.github/instructions/*`
  - `.github/copilot-instructions.md`
  - `AGENTS.MD`
  - `CLAUDE.md`
  - `GEMINI.md`
  - `.claude/rules/claude.instructions.md`
  - `.github/instructions/agents.instructions.md`

### 🔄 Migration & Compatibility

- Added legacy layout migration flow in `update`:
  - Detects `agents/rules` and `agents/skills`
  - Prompts before migrating to canonical paths
- Added alias-aware layout resolution for real-world tool folder variants:
  - `.github/instructions`
  - `.github/skills`
  - `.claude/rules`
  - `.claude/skills`
  - `.agents/skills`

### ✅ Validation Improvements

- `validate` now:
  - Enforces canonical source presence for generated instruction setups
  - Detects drift between generated instruction files and canonical source
  - Fails on legacy-only rules/skills layout (with actionable migration guidance)

### 🧪 Quality

- Updated CLI and API tests for canonical layout and generated instruction behavior
- Test suite passes (`19/19`)

## Version 1.2.10 - Wizard Prompt Simplification Fix (February 28, 2026)

### 🐛 Fixes

- Removed legacy tech-stack interview prompts from `agents-templated wizard`
  - No more project-type / frontend / backend / database questionnaire
  - Wizard now focuses on component selection + overwrite preference only
- Removed outdated package recommendation output tied to legacy wizard flow

### ✅ Validation

- CLI test suite passes after the wizard flow update

---

## Version 1.2.9 - Deterministic Command System and Hardening Workflow (February 28, 2026)

### 🚀 Major Features

#### Deterministic Slash Command Standard
- Added a comprehensive deterministic slash-command protocol in `AGENTS.MD`
- Introduced strict structured output requirements for command-mode execution
- Added implicit intent routing mode (`slash-command-auto`) for non-slash prompts
- Enforced strict handling for unknown/malformed slash commands (structured error + stop)

#### Modular Command Contracts
- Added new `agents/commands/` and template mirror with:
  - Global schema (`SCHEMA.md`)
  - Contracts for `/plan`, `/task`, `/scaffold`, `/fix`, `/refactor`, `/audit`, `/perf`, `/test`, `/pr`, `/release`, `/docs`
- Added deterministic command references in assistant-facing docs (Copilot, Claude, Gemini)

#### Workflow and Security Hardening Expansion
- Added new rules:
  - `agents/rules/intent-routing.mdc`
  - `agents/rules/system-workflow.mdc`
  - `agents/rules/hardening.mdc`
- Extended security guidance with **Application Hardening & Obfuscation** section
- Added hardening verification requirements to testing/workflow guidance
- Updated `/audit` and `/release` contracts to require hardening evidence when risk profile requires it

#### New Baseline Skills
- Added reusable skills and template mirrors:
  - `feature-delivery`
  - `bug-triage`
  - `app-hardening`
- Updated skills README to include recommended baseline skills

### 📝 Documentation and Consistency

- Refreshed repository `README.md` overview to reflect current architecture and capabilities
- Updated installed tree examples to include new rules, commands, and skills
- Normalized active documentation references to `AGENTS.MD` for cross-platform consistency

### ✅ Validation

- Test suite passed before release (`19/19` tests)
- Published to npm as `agents-templated@1.2.9`

---

## Version 1.2.3 - Critical Bug Fixes and Documentation Cleanup (February 15, 2026)

### 🐛 Critical Bug Fixes

- **Fixed CLI: CLAUDE.md and GEMINI.md not being generated**
  - Root cause: CLI still referenced deleted files (.vscode-ai-rules.md, .gemini-instructions.md)
  - Both `init` and `wizard` commands now correctly copy CLAUDE.md and GEMINI.md
  - Users running v1.2.2 should upgrade immediately

- **Fixed validate command**: Now correctly checks for AGENTS.md at root level
- **Updated file references**: All CLI console messages now point to correct file locations

### 🗂️ Documentation Reorganization

- **Consolidated AGENTS.md to root**: Single source of truth for AI assistant instructions
- **Removed duplicated agent-docs/AGENTS.MD**: Content simplified and centralized
- **Updated all cross-references**: Cleaner documentation navigation
- **CLI now copies 5 AI config files**: .cursorrules, copilot-instructions.md, AGENTS.md, CLAUDE.md, GEMINI.md

### 🧪 Test Updates

- Updated test expectations to check root AGENTS.md instead of agent-docs version
- Tests verify correct file generation by CLI

---

## Version 1.2.2 - Documentation Improvements (February 15, 2026)

### 📝 Documentation

- **Removed Next.js bias from README**: Previously appeared as the "default" choice in examples
- **Promoted interactive wizard as primary method**: Now recommended first in Quick Start
- **Equal representation of all presets**: All 5 presets (Next.js, Express, Django, FastAPI, Go) shown equally
- **Technology-agnostic positioning**: Better reflects that the package works with any stack
- **Added comprehensive overview paragraph**: Explains what Agents Templated is at a glance

No functional changes - documentation-only release.

---

## Version 1.2.1 - File Structure Reorganization (February 15, 2026)

### 🗂️ Breaking Changes

**File Structure Reorganization for Clarity:**

- **Documentation moved to `agent-docs/`** directory for better organization
  - `AGENTS.MD` → `agent-docs/AGENTS.MD`
  - `CLAUDE.md` → `agent-docs/ARCHITECTURE.md` (renamed to avoid confusion)
  - `AI_INSTRUCTIONS.md` → `agent-docs/AI_INSTRUCTIONS.md`
  - `README.md` → `agent-docs/README.md` (for distributed projects)

- **AI Agent config files standardized:**
  - **Claude AI**: Created `CLAUDE.md` (root level, auto-discovered)
  - **Google Gemini**: Renamed `.gemini-instructions.md` → `GEMINI.md` (uppercase for consistency)
  - **Removed**: `.vscode-ai-rules.md` (redundant with `AI_INSTRUCTIONS.md`)
  - **Kept**: `.cursorrules`, `.github/copilot-instructions.md` (established conventions)

- **All AI configs now reference:**
  - `agent-docs/AI_INSTRUCTIONS.md` as the primary entry point
  - `agent-docs/ARCHITECTURE.md` for project architecture and guidelines
  - `agent-docs/AGENTS.md` for agent delegation patterns

### 🐛 Bug Fixes

- **Fixed wizard command**: Now generates all 4 AI agent config files (Cursor, Copilot, Claude, Gemini)
- Previously wizard only created `.github/copilot-instructions.md`, missing other agents
- Updated component selection text in wizard to reflect multi-agent support
- Updated `list` command description to show all AI agent instructions

### 📝 Migration Guide

For existing v1.2.0 projects:
```bash
# Backup your customizations
cp CLAUDE.md CLAUDE.backup.md
cp .gemini-instructions.md gemini.backup.md

# Re-initialize with new structure
npx agents-templated@1.2.1 init --force --all

# Merge your customizations back if needed
```

---

## Version 1.2.0 - Multi-IDE AI Agent Support (February 15, 2026)

### 🚀 Major Features

#### Multi-AI Agent Support
- **Unified AI agent configuration** - One ruleset for all AI agents
- **Native support for 4 AI agents**:
  - **Cursor IDE** (`.cursorrules`) - Full development environment
  - **GitHub Copilot** (`.github/copilot-instructions.md`) - Code completion and generation
  - **Claude AI** (`CLAUDE.md`) - Advanced reasoning and code generation
  - **Google Gemini** (`GEMINI.md`) - Gemini AI integration
- All agents auto-discover their configuration files in the project
- All agents read from the same unified `agents/rules/` and `agents/skills/` directories
- No agent-specific duplication—one source of truth for all AI assistance

#### Enhanced CLI
- Updated `init` command now copies **all 4 AI agent config files** by default
- Updated component selection to show "AI Agent instructions (Cursor, Copilot, Claude, Gemini)"
- All configs point to shared `agents/rules/` and `agents/skills/` directories
- Simplified setup: `npx agents-templated init` creates everything needed

#### Preset Updates
- All 5 presets updated with `supportedAgents` metadata field
  - Presets now document: Cursor ✓ | Copilot ✓ | VSCode ✓ | Gemini ✓
  - Backward compatible—existing projects continue to work
  - New projects benefit from unified agent support

### 📝 Documentation
- Updated README with "Multi-AI Agent Support" section
- Clarified that all agents read from same rules/skills directories
- Added example configs for each AI agent
- Documented auto-discovery behavior

### 🔄 Backward Compatibility
- **Fully backward compatible** with v1.1.x
- Existing projects continue to work without changes
- v1.2.0 is an additive release—no breaking changes
- New config files are optional (existing `.cursorrules` still works)

---

## Version 1.1.0 - Feature-Rich Release (February 13, 2026)

### 🎉 Major New Features

#### Quick Start Presets
- **5 Pre-configured Tech Stack Presets**:
  - `nextjs` - Next.js with TypeScript, React, and Tailwind CSS
  - `django-react` - Django REST Framework backend with React frontend
  - `express-api` - RESTful API with Express.js and TypeScript
  - `fastapi` - Modern Python API with FastAPI
  - `go-api` - High-performance API with Go and Gin
- Each preset includes recommended packages, gitignore patterns, and npm scripts
- Usage: `agents-templated init --preset=<name>`

#### Interactive Setup Wizard
- New `agents-templated wizard` command for guided setup
- Step-by-step project type selection (fullstack, frontend, backend, etc.)
- Framework and database selection with context-aware prompts
- Personalized package recommendations based on your choices
- Smart component installation suggestions

#### Project Validation & Health Checks
- **validate command**: Quick validation of project setup and configuration
  - Checks for required files (AGENTS.MD, agent rules, etc.)
  - Validates agent rules syntax
  - Verifies AI assistant configurations
  - Provides actionable recommendations
- **doctor command**: Comprehensive health check with detailed diagnostics
  - Security pattern verification
  - Testing strategy validation
  - Configuration completeness checks
  - Quick tips and best practices

#### Template Update System
- New `agents-templated update` command to keep templates in sync
- Checks for file differences between local and latest templates
- Interactive update process with backup creation
- `--check-only` flag to preview available updates
- Automatic backup files (`.backup` extension) before applying updates

#### Comprehensive Testing
- Full Jest test suite added for all core functionality
- Test commands in package.json:
  - `npm test` - Run all tests
  - `npm run test:watch` - Watch mode for development
  - `npm run test:coverage` - Coverage reports
  - `npm run test:ci` - CI-optimized testing
- Tests cover file operations, CLI commands, and edge cases

### 🔧 Improvements

#### Enhanced CLI
- Updated `list` command to show both components and presets
- Better error messages with actionable suggestions
- Improved console output with clearer formatting
- Version bumped to 1.1.0 across all files

#### Package Updates
- Added Jest and testing dependencies
- Updated scripts in package.json for testing
- Included `templates/presets` directory in published package
- Better file organization and structure

#### Documentation
- Updated README with all new features
- Added "What's New in v1.1.0" section
- Enhanced CLI usage examples with presets
- Better quick start documentation

### 📦 Breaking Changes
None - fully backward compatible with v1.0.x

### 🐛 Bug Fixes
- Improved file path handling across different operating systems
- Better error handling in file copy operations
- Fixed edge cases in component installation

### 📝 Developer Experience
- Added comprehensive test coverage for maintainability
- Better code organization with separated concerns
- Improved error handling and user feedback

---

## Version 1.0.1 - Professional Update

## Changes Made

### ✅ Removed All Emojis (Professional Appearance)

**Before:**
```
🤖 Agents Templated - AI-Powered Development Setup
📄 Installing documentation files...
  ✓ AGENTS.MD
✅ Installation complete!
```

**After:**
```
Agents Templated - AI-Powered Development Setup
Installing documentation files...
  + AGENTS.MD
Installation complete!
```

### ✅ Excluded Development Documentation

The following files are now **excluded from the published package** (only in your repo):
- `NPM_2FA_SETUP.md` - 2FA setup instructions
- `PUBLISHING_GUIDE.md` - Publishing guide
- `GET_STARTED.md` - Setup guide
- `NPM_PACKAGE_GUIDE.md` - Detailed package documentation
- `setup-templates.ps1` - Setup script
- `.gitignore` - Git ignore rules
- `.gitattributes` - Git attributes

**Result:** Users only get the essential template files, not the package development documentation.

### ✅ Enhanced Security (.gitignore)

Added comprehensive security patterns to prevent accidental commits of sensitive data:

**Protected Files:**
- Private keys (*.key, *.pem, id_rsa, etc.)
- Certificates (*.cer, *.crt, *.jks, etc.)
- API keys and tokens (.api-keys, .credentials)
- NPM tokens (.npmrc)
- Production environment files (.env.production, .env.staging)

**Git Guardian Compliant:** These patterns prevent most common security leaks.

## Published Package Contents

Your package now includes **only 18 essential files**:

```
agents-templated@1.0.1/
├── LICENSE
├── README.md
├── bin/cli.js (professional, no emojis)
├── index.js
├── package.json
└── templates/
    ├── .github/copilot-instructions.md
    ├── AGENTS.MD
    ├── AI_INSTRUCTIONS.md
    ├── CLAUDE.md
    ├── README.md
    └── agents/
        ├── rules/ (6 files)
        └── skills/ (2 files)
```

## Verification

✅ **NPM Package:** https://www.npmjs.com/package/agents-templated  
✅ **GitHub Repo:** https://github.com/rickandrew2/agents-projects-templated  
✅ **Version:** 1.0.1  
✅ **Package Size:** 35.1 kB (clean and minimal)

## Test Results

```bash
npm install -g agents-templated@latest
agents-templated list
# Output: Clean, professional, no emojis ✓

agents-templated init --docs
# Output: Professional installation messages ✓
```

## Security Features

### Git Guardian Protection

Your `.gitignore` now prevents commits of:
- 🔒 SSH keys and certificates
- 🔒 API keys and credentials
- 🔒 NPM authentication tokens
- 🔒 Production environment files
- 🔒 Keystore files

### NPM Package Security

Your `.npmignore` prevents publishing:
- 🔒 Development documentation
- 🔒 Setup scripts
- 🔒 Git configuration
- 🔒 Test files
- 🔒 Environment files

## User Experience

### For New Users

When someone installs your package, they get:
1. **Clean professional CLI** - No emoji clutter
2. **Only template files** - No confusing development docs
3. **Simple commands** - Easy to understand output
4. **Security-first** - Protected pattern files

### Installation Example

```bash
# Global install
npm install -g agents-templated

# Use in any project
cd my-project
agents-templated init --all
```

**Output:**
```
Agents Templated - AI-Powered Development Setup

Installing documentation files...
  + AGENTS.MD
  + CLAUDE.md
  + AI_INSTRUCTIONS.md
  + README.md

Installing agent rules...
  + agents\rules\core.mdc
  + agents\rules\database.mdc
  [...]

Installation complete!

Next steps:
  1. Review CLAUDE.md for project guidelines
  2. Review AGENTS.MD for agent patterns
  3. Configure your AI assistant (Cursor, Copilot, etc.)
  4. Adapt the rules to your technology stack
```

## Benefits

### Professional
- ✅ Clean, corporate-ready output
- ✅ No unnecessary visual elements
- ✅ Focused on functionality

### User-Friendly
- ✅ Less confusion (no dev docs in package)
- ✅ Clear, readable output
- ✅ Straightforward commands

### Secure
- ✅ Git Guardian compliant patterns
- ✅ Protected against common security leaks
- ✅ No sensitive files in package or commits

## Next Release

When you make future updates:

```bash
# Make changes
git add .
git commit -m "Description of changes"

# Bump version
npm version patch  # 1.0.1 -> 1.0.2
# or
npm version minor  # 1.0.1 -> 1.1.0

# Publish
npm publish

# Push to GitHub
git push origin main --tags
```

## Summary

Your npm package is now:
- ✅ **Professional** - No emojis, clean output
- ✅ **Minimal** - Only 18 essential files
- ✅ **Secure** - Git Guardian protected
- ✅ **User-friendly** - No confusing dev docs
- ✅ **Production-ready** - Corporate-grade quality

**Live at:** https://www.npmjs.com/package/agents-templated  
**Downloads:** Anyone can now install with `npm install -g agents-templated`
