# Technology-Agnostic Development Template

This template is part of the agents-templated npm package.

## What's Included

- **AGENTS.md**: Instructions for AI assistants
- **ARCHITECTURE.md**: Project guidelines and architecture  
- **agents/rules/**: Development rules and patterns (6 files)
- **agents/skills/**: Reusable agent skills

## Rules and Skills

- **Rules** (`agents/rules/*.mdc`): Define *how to behave* - patterns, principles, and standards for your team
- **Skills** (`agents/skills/*/SKILL.md`): Define *how to execute specific tasks* - domain-specific workflows and specialized knowledge

### Using Skills in Your AI Assistants

Skills can be referenced in all AI configuration files:

**In `.cursorrules` (Cursor IDE):**
```
When the user asks about [domain], use the [skill-name] skill from agents/skills/
```

**In `CLAUDE.md` (Claude):**
```
When working on [domain-specific task], reference the [skill-name] skill in agents/skills/[skill-name]/SKILL.md
```

**In `GEMINI.md` (Google Gemini):**
```
When working on [domain-specific task], reference the [skill-name] skill in agents/skills/[skill-name]/SKILL.md
```

**In `.github/copilot-instructions.md` (GitHub Copilot):**
```
When helping with [domain-specific task], reference the [skill-name] skill from agents/skills/[skill-name]/SKILL.md
```

All AI assistants support skill references. Create custom skills in `agents/skills/` to extend capabilities across your entire team.

## Getting Started

1. Review AGENTS.md for AI assistance guidance
2. Review ARCHITECTURE.md for overall project guidelines
3. Adapt the rules to your specific technology stack
4. Create custom skills in `agents/skills/` for your domain
5. Configure your AI assistants (Cursor, Copilot, Claude, Gemini) to reference your skills

## Documentation

For full documentation, visit: https://github.com/rickandrew2/agents-templated
