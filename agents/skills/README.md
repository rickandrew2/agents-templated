# Agent Skills

This directory contains custom skills for your AI agents. Skills extend agent capabilities with specialized knowledge, workflows, and tools for specific domains.

## What is a Skill?

A **skill** is a reusable module that:
- Defines domain-specific knowledge or workflows
- Extends agent capabilities for specialized tasks
- Can be shared across your project or published for others

**Rules** define *how to behave*; **Skills** define *how to execute specific tasks*.

## Getting Started

### Finding Existing Skills

Use the built-in `find-skills` skill to discover skills from the open ecosystem:

```bash
npx skills find [query]
```

Examples:
- `npx skills find react testing`
- `npx skills find deployment`
- `npx skills find accessibility`

Browse more at: https://skills.sh/

### Creating a Custom Skill

To create a new skill for your specific domain:

1. **Create a new folder** in this directory:
   ```
   agents/skills/my-custom-skill/
   ```

2. **Create a SKILL.md file** with metadata and instructions:
   ```markdown
   ---
   name: my-custom-skill
   description: Brief description of what this skill does
   ---

   # My Custom Skill

   Instructions and examples for using this skill...
   ```

3. **Reference it** in your agent documentation or `.cursorrules`

### Skill Structure

```
agents/skills/
├── find-skills/
│   └── SKILL.md              # Meta-skill for discovering skills
├── my-custom-skill/
│   └── SKILL.md              # Your custom skill
└── README.md                 # This file
```

## Best Practices

1. **Keep skills focused** - Each skill should handle one domain or workflow
2. **Document clearly** - Include examples and use cases in SKILL.md
3. **Name descriptively** - Use kebab-case names that reflect the skill's purpose
4. **Version your skills** - Include version info in the metadata
5. **Test before sharing** - Ensure skills work as documented

## Common Skill Categories

Consider creating skills for:

| Category        | Use Case                                 |
| --------------- | ---------------------------------------- |
| Web Development | Framework-specific patterns and guidelines |
| Testing         | Testing strategies and examples          |
| DevOps          | Deployment, CI/CD, infrastructure        |
| Documentation   | Doc generation, README templates         |
| Code Quality    | Code review, refactoring patterns        |
| Design          | UI/UX, accessibility, design systems    |
| Productivity    | Workflows, automation, git patterns      |

## Using Skills in Your Project

Once you've created a skill:

1. **Reference in `.cursorrules`**:
   ```
   When the user asks about [domain], use the [skill-name] skill
   ```

2. **Document in agent guidelines**:
   - Add to `AGENTS.md` for public skills
   - Add to `CLAUDE.md` or `GEMINI.md` for AI-specific skills

3. **Share with your team**:
   - Commit to version control
   - Document installation in your README

## Example: Creating a Fastapi Skill

```markdown
---
name: fastapi-patterns
description: FastAPI development patterns and best practices for your projects
---

# FastAPI Patterns

Use this skill when working with FastAPI projects.

## Recommended Patterns

### Request Validation
- Use Pydantic models for all request bodies
- Validate query parameters with proper typing

### Error Handling
- Return meaningful HTTP status codes
- Document error responses in OpenAPI

### Testing
- Use TestClient for API testing
- Mock external dependencies

## Project Structure

```
src/
├── api/
│   ├── v1/
│   │   ├── users/
│   │   └── posts/
│   └── dependencies.py
├── models/
├── schemas/
├── database/
└── main.py
```
```

## Resources

- [Skills Documentation](https://skills.sh/)
- [Creating Skills Guide](https://skills.sh/docs/creating-skills)
- [Browse Popular Skills](https://skills.sh/explore)
