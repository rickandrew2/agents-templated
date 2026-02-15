# Technology-Agnostic Development Template

This template has been installed by the agents-templated npm package.

## What's Included

Depending on what you installed, you may have:

- **AGENTS.MD**: Agent patterns and delegation guide
- **ARCHITECTURE.md**: Project guidelines and architecture
- **AI_INSTRUCTIONS.md**: Instructions for AI assistants
- **agents/rules/**: Development rules and patterns (6 files)
- **agents/skills/**: Reusable agent skills
- **CLAUDE.md**: Claude AI configuration
- **GEMINI.md**: Google Gemini configuration
- **.github/copilot-instructions.md**: GitHub Copilot configuration
- **.cursorrules**: Cursor IDE configuration

## Installation Options

If you're missing some components, you can install them:

```bash
# Install everything
agents-templated init --all

# Or install specific components
agents-templated init --docs      # Documentation files only
agents-templated init --rules     # Agent rules only
agents-templated init --skills    # Skills only
agents-templated init --github    # GitHub Copilot config only

# List available components
agents-templated list
```

## Rules and Skills

- **Rules** (`agents/rules/*.mdc`): Markdown files with YAML frontmatter (`description`, `globs`, `alwaysApply`). AI agents use them to know when to apply each rule. Adapt the content to your stack.
- **Skills** (`agents/skills/*/SKILL.md`): Extend agent capabilities (e.g. find-skills, web-design-guidelines). Each has a name, description, and when to use.

## Getting Started

1. Review AI_INSTRUCTIONS.md for AI assistance guidance
2. Review ARCHITECTURE.md for overall project guidelines
3. Review AGENTS.MD for agent patterns
4. Adapt the rules to your specific technology stack
5. Configure your AI assistant (Cursor, Copilot, Claude, Gemini)

## Documentation

For full documentation, visit: https://github.com/rickandrew2/agents-projects-templated

