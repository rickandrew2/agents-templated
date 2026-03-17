# Technology-Agnostic Development Template

This template is part of the `agents-templated` npm package.

## What's Included

- **AGENTS.MD**: Generic compatibility wrapper for AI assistants
- **ARCHITECTURE.md**: Project guidelines and architecture
- **CLAUDE.md**: Canonical policy source (single source of truth)
- **.claude/rules/**: Rule modules (`*.md`)
- **.github/skills/**: Skill modules (`*/SKILL.md`)
- **CLAUDE.md**: Claude compatibility wrapper
- **.github/copilot-instructions.md**: GitHub Copilot compatibility wrapper
- **.cursorrules**: Cursor compatibility wrapper

## Rules and Skills

- **Rules** (`.claude/rules/*.md`): Define *how to behave* - patterns, principles, and standards.
- **Skills** (`.github/skills/*/SKILL.md`): Define *how to execute specific tasks* - domain workflows and specialized knowledge.

Skills are capability modules only. They do not override policy in `CLAUDE.md`.

### Using Skills in AI Assistants

Skills can be referenced from any wrapper because all wrappers point to `CLAUDE.md`.

**In `.cursorrules` (Cursor IDE):**
```
When the user asks about [domain], use the [skill-name] skill from .github/skills/[skill-name]/SKILL.md
```

**In `CLAUDE.md` (Claude):**
```
When working on [domain-specific task], reference the [skill-name] skill in .github/skills/[skill-name]/SKILL.md
```

**In `.github/copilot-instructions.md` (GitHub Copilot):**
```
When helping with [domain-specific task], reference the [skill-name] skill from .github/skills/[skill-name]/SKILL.md
```

Create custom skills in `.github/skills/` to extend capabilities across your team.

## Getting Started

1. Review `AGENTS.MD` for wrapper behavior and compatibility entrypoints.
2. Review `ARCHITECTURE.md` for project architecture guidance.
3. Adapt `.claude/rules/*.md` for your stack.
4. Create custom skills under `.github/skills/` for your domain.
5. Keep wrappers minimal and policy centralized in `CLAUDE.md`.

## Documentation

For full documentation, visit: https://github.com/rickandrew2/agents-templated
