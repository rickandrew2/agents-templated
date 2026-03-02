# Agents Templated

[![npm version](https://img.shields.io/npm/v/agents-templated.svg)](https://www.npmjs.com/package/agents-templated)
[![npm downloads](https://img.shields.io/npm/dm/agents-templated.svg)](https://www.npmjs.com/package/agents-templated)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/rickandrew2/agents-projects-templated?style=social)](https://github.com/rickandrew2/agents-templated)

> **Agents Templated** is a CLI tool and npm package that instantly scaffolds production-ready project structures with enterprise-grade development patterns, security guidelines, and AI assistant configurations. Designed for developers who want to start projects the right way—with proven OWASP security practices, comprehensive testing strategies (80/15/5 coverage targets), and agent-based architecture patterns—without being locked into specific frameworks. It generates unified configuration files that work seamlessly with Cursor, GitHub Copilot, Claude, and Google Gemini, allowing AI assistants to automatically follow best practices from day one. Whether you're building a Next.js app, Django API, Go microservice, or any custom stack, Agents Templated provides the guardrails and patterns you need while giving you complete freedom to choose your technology.

---

## What is Agents Templated?

Agents Templated scaffolds your project with:

✅ **AI Agent Configurations** – Auto-discovery files for 4 major AI coding assistants  
✅ **Deterministic Command Contracts** – Structured slash-command protocol in `agents/commands/`  
✅ **Security-First Patterns** – OWASP Top 10 protection guidelines built-in  
✅ **Hardening Guidance** – Risk-based hardening/obfuscation and release evidence gates  
✅ **Testing Strategy** – 80/15/5 coverage targets (unit/integration/e2e)  
✅ **Agent-Based Architecture** – Specialized patterns for frontend, backend, database, testing, security  
✅ **Technology-Agnostic** – Works with React, Django, Go, FastAPI, Next.js, or any stack you choose

**Important:** This package does **NOT** install frameworks or libraries. It scaffolds the structure, patterns, and AI configurations—you install your chosen tech stack separately.

### What’s New in This Version

- Deterministic slash-command standard in `AGENTS.MD` and modular contracts in `agents/commands/`
- Implicit natural-language routing support (`slash-command-auto`) for non-technical prompts
- New workflow/routing/hardening rule set:
  - `agents/rules/intent-routing.mdc`
  - `agents/rules/system-workflow.mdc`
  - `agents/rules/hardening.mdc`
- New baseline skills:
  - `agents/skills/feature-delivery/`
  - `agents/skills/bug-triage/`
  - `agents/skills/app-hardening/`
- Release and audit contracts now require hardening evidence when risk profile requires it

---

## 🚀 Quick Start

### 1. Run the Interactive Wizard (Recommended)

```bash
# Using npx (no installation needed) - RECOMMENDED
npx agents-templated@latest wizard

# Or install globally first
npm install -g agents-templated
agents-templated wizard
```

**Or use a preset for fast setup:**

```bash
# Initialize with a specific preset
npx agents-templated@latest init --preset=nextjs        # Next.js
npx agents-templated@latest init --preset=express-api   # Express
npx agents-templated@latest init --preset=django-react  # Django
npx agents-templated@latest init --preset=fastapi       # FastAPI
npx agents-templated@latest init --preset=go-api        # Go

# Or install all components without a preset
npx agents-templated@latest init --all
```

### 2. Install Your Tech Stack

After initializing, install your chosen framework:

```bash
# Frontend
npm install next react react-dom              # Next.js
npm install vue nuxt                          # Nuxt
npm install @angular/core @angular/cli        # Angular

# Backend
npm install express typescript zod            # Express
pip install django djangorestframework        # Django
pip install fastapi uvicorn pydantic          # FastAPI
go mod init your-project                      # Go

# Database
npm install prisma @prisma/client             # Prisma ORM
pip install sqlalchemy alembic                # SQLAlchemy
npm install mongoose                          # Mongoose (MongoDB)
```

### 3. Start Coding with AI

Your AI assistant will auto-load the configurations and follow enterprise patterns automatically!

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🚀 **Quick Start Presets** | 5 popular tech stack presets (Next.js, Express, Django, FastAPI, Go) |
| 🧙 **Interactive Wizard** | Guided setup with personalized recommendations |
| 🤖 **AI Agents Supported** | Cursor, GitHub Copilot, Claude, and generic agents via `AGENTS.MD` |
| 🧭 **Deterministic Commands** | Slash-command contracts with strict structured outputs |
| 💬 **Auto Intent Routing** | Non-slash prompts can map to command contracts (`slash-command-auto`) |
| 🔒 **Security-First** | OWASP Top 10 protection patterns built-in |
| 🛡️ **Hardening Workflow** | Risk-based hardening rules plus verification/release gates |
| 🧪 **Testing Strategy** | 80/15/5 coverage targets (unit/integration/e2e) |
| ✅ **Project Validation** | `validate` and `doctor` commands for health checks |
| 🔄 **Template Updates** | Keep your templates in sync with `update` command |
| 🎯 **Technology-Agnostic** | Works with React, Django, Go, FastAPI, Next.js, or any stack |
| ♿ **Accessibility** | WCAG 2.1 AA compliance patterns included |

---

## 🤖 AI Agent Support

Agents Templated automatically configures compatible wrappers for major AI coding assistants:

| AI Agent | Config File | Auto-Discovery |
|----------|-------------|----------------|
| **Cursor** | `.cursorrules` | ✅ Auto-loads in Cursor IDE |
| **GitHub Copilot** | `.github/copilot-instructions.md` | ✅ Auto-loads in VS Code |
| **Claude** | `CLAUDE.md` | ✅ Compatible |
| **Generic agents** | `AGENTS.MD` | ✅ Compatible |

**Single source of truth:** `instructions/source/core.md` drives generated tool-compatible instruction files.

---

## 📦 What Gets Installed

When you run `agents-templated init`, you get:

```
your-project/
├── instructions/
│   └── source/
│       └── core.md               # Canonical instruction source of truth
│
├── agent-docs/                      # 📚 Comprehensive documentation
│   ├── ARCHITECTURE.md             # Project architecture & tech stack
│   └── README.md                   # Human-readable setup guide
│
├── .github/
│   ├── instructions/                # Generated compatibility wrappers + rules
│   │   ├── AGENTS.md
│   │   └── rules/
│   │   ├── core.mdc               # Core development principles
│   │   ├── security.mdc           # Security patterns (CRITICAL)
│   │   ├── testing.mdc            # Testing strategy
│   │   ├── frontend.mdc           # Frontend patterns
│   │   ├── database.mdc           # Database patterns
│   │   ├── style.mdc              # Code style guidelines
│   │   ├── workflows.mdc          # Workflow and quality gates
│   │   ├── intent-routing.mdc     # Intent-to-command routing policy
│   │   ├── system-workflow.mdc    # End-to-end delivery lifecycle gates
│   │   └── hardening.mdc          # Hardening and obfuscation guidance
│   ├── skills/
│   │   ├── find-skills/           # Skill discovery helper
│   │   ├── feature-delivery/      # Scoped feature delivery workflow
│   │   ├── bug-triage/            # Reproduction-first defect workflow
│   │   ├── app-hardening/         # Hardening and release-evidence workflow
│   │   ├── ui-ux-pro-max/         # Advanced UI/UX design implementation skill
│   │   ├── README.md              # Guide for creating custom skills
│   │   └── [your-custom-skills]/  # Your project-specific skills
│   └── copilot-instructions.md    # Compatibility shim for Copilot
│
├── agents/                          # 🤖 Deterministic command contracts
│   └── commands/
│   │   ├── SCHEMA.md              # Global slash-command response schema
│   │   ├── plan.md                # /plan contract
│   │   ├── fix.md                 # /fix contract
│   │   ├── audit.md               # /audit contract
│   │   ├── release.md             # /release contract
│   │   ├── ...                    # Other command contracts
│   │   └── README.md              # Commands directory guide
│
├── AGENTS.MD                        # Compatibility shim for generic agents
├── CLAUDE.md                        # Compatibility shim for Claude tooling
├── .cursorrules                     # Compatibility shim for Cursor
├── .gitignore                      # Pre-configured Git ignore
└── README.md                       # Project documentation
```

---

## 📋 Command Reference

### Setup Commands

```bash
# 🧙 Interactive wizard (recommended for beginners)
agents-templated wizard

# 🚀 Quick start with presets
agents-templated init --preset=nextjs         # Next.js full-stack
agents-templated init --preset=express-api    # Express.js API
agents-templated init --preset=django-react   # Django + React
agents-templated init --preset=fastapi        # FastAPI
agents-templated init --preset=go-api         # Go API

# 🔧 Manual component selection
agents-templated init --all                   # All components
agents-templated init --docs                  # Documentation only
agents-templated init --rules                 # Agent rules only
agents-templated init --skills                # Skills only

# ⚠️ Force overwrite existing files
agents-templated init --all --force
```

### Maintenance Commands

```bash
# ✅ Validate your project setup
agents-templated validate                     # Quick validation
agents-templated doctor                       # Comprehensive health check

# 🔄 Update templates to latest version
agents-templated update                       # Apply updates with backup
agents-templated update --check-only          # Check without installing

# 📚 List available components and presets
agents-templated list
```

---

## 🎯 After Installation: Next Steps

### 1. Install Your Tech Stack

After initializing, install your chosen framework:

```bash
# Frontend
npm install next react react-dom              # Next.js
npm install vue nuxt                          # Nuxt
npm install @angular/core @angular/cli        # Angular

# Backend
npm install express typescript zod            # Express
pip install django djangorestframework        # Django
pip install fastapi uvicorn pydantic          # FastAPI
go mod init your-project                      # Go

# Database
npm install prisma @prisma/client             # Prisma ORM
pip install sqlalchemy alembic                # SQLAlchemy
npm install mongoose                          # Mongoose (MongoDB)
```

### 2. Review AI Configuration Files

Open your AI assistant and it will automatically load the appropriate config:

- **Cursor**: Opens `.cursorrules` automatically
- **GitHub Copilot**: Reads `.github/copilot-instructions.md`
- **Claude**: Reads `CLAUDE.md`
- **Generic/other tools**: Read `AGENTS.MD`

### 3. Create Custom Skills (Optional)

Extend your AI agents with domain-specific skills for your project:

```bash
# View the skills guide
cat .github/skills/README.md
```

Create a new skill folder in `.github/skills/`:

```markdown
.github/skills/my-custom-skill/SKILL.md
---
name: my-custom-skill
description: Custom patterns for my project domain
---

# My Custom Skill

Use this skill when working with [your domain].

## Recommended Patterns

- Pattern 1: Description
- Pattern 2: Description

## Example

Code and examples...
```

Skills define *how to execute specific tasks*, complementing rules that define *how to behave*. See [.github/skills/README.md](.github/skills/README.md) for detailed guidance.

### 4. Read the Documentation

- **[AGENTS.MD](AGENTS.MD)** – AI assistant guide
- **[agent-docs/ARCHITECTURE.md](agent-docs/ARCHITECTURE.md)** – Project architecture & tech stack guidance
- **[.github/skills/README.md](.github/skills/README.md)** – Custom skills guide
- **[.github/instructions/rules/security.mdc](.github/instructions/rules/security.mdc)** – Security patterns (CRITICAL)
- **[.github/instructions/rules/testing.mdc](.github/instructions/rules/testing.mdc)** – Testing strategy

### 5. Start Building

Tell your AI assistant what to build:

```
"Create a user registration endpoint with email validation and rate limiting"
"Build a responsive dashboard component with dark mode support"
"Design a PostgreSQL schema for a blog with users, posts, and comments"
```

Your AI will follow the enterprise patterns automatically!

---

## 🏗️ Core Principles

### Security-First Development

✅ Validate all inputs at application boundaries with schema validation  
✅ Authenticate and authorize every protected endpoint  
✅ Rate limit public endpoints to prevent abuse  
✅ Sanitize outputs to prevent injection attacks  
✅ Never expose sensitive data in error messages or logs

**Reference**: [.github/instructions/rules/security.mdc](.github/instructions/rules/security.mdc)

### Testing Strategy

- **80% Unit Tests** – Business logic, pure functions, utilities
- **15% Integration Tests** – API endpoints, database operations
- **5% E2E Tests** – Critical user journeys

**Reference**: [.github/instructions/rules/testing.mdc](.github/instructions/rules/testing.mdc)

### Agent-Based Architecture

| Agent | Responsibility |
|-------|---------------|
| **FrontendAgent** | UI/UX, components, design system, accessibility |
| **BackendAgent** | API, business logic, authentication, middleware |
| **DatabaseAgent** | Schema design, migrations, query optimization |
| **TestAgent** | Unit, integration, E2E, accessibility testing |
| **SecurityAgent** | Input validation, authentication, OWASP compliance |

**Reference**: [AGENTS.MD](AGENTS.MD)

---

## 📚 Available Presets

| Preset | Tech Stack | Best For |
|--------|-----------|----------|
| `nextjs` | Next.js + React + TypeScript | Full-stack web applications |
| `express-api` | Express + TypeScript + Zod | REST APIs and microservices |
| `django-react` | Django + React + PostgreSQL | Full-stack with Python backend |
| `fastapi` | FastAPI + Pydantic + SQLAlchemy | High-performance Python APIs |
| `go-api` | Go + Gin/Echo + PostgreSQL | Scalable Go microservices |

Each preset includes:
- Recommended package list
- Stack-specific configurations
- Optimized `.gitignore` patterns
- Pre-configured agent rules

---

## 🔧 Programmatic API

Use agents-templated in your build scripts or automation:

```javascript
const agentsTemplated = require('agents-templated');

// Install all components
await agentsTemplated.install('./my-project', {
  force: true
});

// Install specific components
await agentsTemplated.install('./my-project', {
  docs: true,
  rules: true,
  skills: false,
  github: true,
  force: false
});
```

---

## 📝 Usage Examples

### Frontend Development
```
"Create a responsive navigation component with accessibility support"
"Implement dark mode toggle with user preference persistence"
"Build a data table with sorting, filtering, and pagination"
```

### Backend Development
```
"Create a secure user registration endpoint with email validation and rate limiting"
"Implement JWT authentication middleware with refresh tokens"
"Add password reset functionality with email verification"
```

### Database Operations
```
"Design a user roles and permissions schema with PostgreSQL"
"Create a migration to add full-text search to the posts table"
"Optimize the user query to prevent N+1 problems using joins"
```

---

## 🤝 Contributing

When contributing to this template:
1. Maintain technology-agnostic patterns
2. Update relevant rule files in `agents/rules/`
3. Keep documentation synchronized with code changes
4. Follow security and testing patterns
5. Ensure AI assistant configurations remain compatible

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📖 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🔗 Links

- **NPM Package**: https://www.npmjs.com/package/agents-templated
- **GitHub Repository**: https://github.com/rickandrew2/agents-templated
- **Issues & Bug Reports**: https://github.com/rickandrew2/agents-templated/issues
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

**Ready to start building?** Choose your technology stack and begin development with enterprise-grade patterns from day one!

```bash
npx agents-templated@latest wizard
```
