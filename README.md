# Technology-Agnostic Development Template

[![npm version](https://img.shields.io/npm/v/agents-templated.svg)](https://www.npmjs.com/package/agents-templated)
[![npm downloads](https://img.shields.io/npm/dm/agents-templated.svg)](https://www.npmjs.com/package/agents-templated)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/rickandrew2/agents-projects-templated?style=social)](https://github.com/rickandrew2/agents-templated)

An enterprise-grade development template that works with any technology stack. Provides proven patterns, security guidelines, and AI assistant integration for Cursor and GitHub Copilot. You choose your tech stack (React, Django, Go, etc.) and install it separately—this package scaffolds the structure and patterns you'll follow.

## Overview

This template provides proven development patterns and guidelines that work with **any** technology stack. It scaffolds project structure, AI assistant configurations, and security patterns—but does **not** install tech packages for you. After running `agents-templated init`, you independently install your chosen frameworks (React, Django, Go, etc.) into the scaffolded structure.

## Key Features

- **Quick Start Presets** (v1.1.0): Fast-track setup with popular tech stack presets
- **Interactive Wizard** (v1.1.0): Guided setup with personalized recommendations
- **Project Validation** (v1.1.0): Automated checks for configuration and best practices
- **Template Updates** (v1.1.0): Keep your templates in sync with latest improvements
- **Technology-Agnostic**: Patterns and structure that work with any tech stack
- **AI Assistant Ready**: Pre-configured for Cursor, GitHub Copilot, and other AI coding tools
- **Security-First**: Built-in OWASP Top 10 protection patterns and security guidelines
- **Testing Strategy**: Defined approach with unit, integration, and E2E coverage targets
- **Agent-Based Architecture**: Specialized agents for frontend, backend, database, testing, security
- **Type-Safe Development**: Validation patterns applicable to any language
- **Accessibility Guidelines**: WCAG 2.1 AA compliance patterns built-in

## What's New in v1.1.0

### 🚀 Quick Start Presets
Get started instantly with pre-configured setups for popular tech stacks:
```bash
agents-templated init --preset=nextjs        # Next.js full-stack app
agents-templated init --preset=express-api   # Express.js REST API
agents-templated init --preset=django-react  # Django + React
agents-templated init --preset=fastapi       # FastAPI backend
agents-templated init --preset=go-api        # Go API server
```

Each preset includes:
- Recommended package lists for your tech stack
- Stack-specific configuration templates
- Optimized .gitignore patterns
- Pre-configured agent rules

### 🧙 Interactive Setup Wizard

Guided setup experience with smart recommendations:

```bash
agents-templated wizard
```

**Features:**
- Choose project type: fullstack, frontend, backend, CLI, package, or custom
- Select frameworks and databases interactively
- Receive personalized package recommendations
- Install only the components you need
- Get next-step guidance tailored to your stack

### ✅ Validation & Health Checks

Ensure your project follows best practices:

```bash
agents-templated validate    # Quick validation of setup
agents-templated doctor      # Comprehensive health check with recommendations
```

**Checks include:**
- Required documentation files present
- Agent rules properly configured
- AI assistant configurations valid
- Security patterns implemented
- Testing structure in place

### 🔄 Keep Templates Updated

Stay current with latest improvements:

```bash
agents-templated update              # Apply updates with backup
agents-templated update --check-only # Check without installing
```

**Features:**
- Automatic backup creation before updates
- Preview changes before applying
- Selective file updates
- Preserves your customizations

### 🧪 Comprehensive Testing

All core functionality includes automated tests:
- 10+ unit tests covering install operations
- Jest test framework with coverage reporting
- Tested on Windows, macOS, and Linux
- CI/CD ready with `npm run test:ci`

## 🚀 Quick Start

### Installation

**Global Installation (Recommended)**

```bash
npm install -g agents-templated
cd your-project
agents-templated init --preset=nextjs  # or use wizard
```

**Local Installation (Per Project)**

```bash
npm install --save-dev agents-templated
npx agents-templated init --preset=nextjs
```

**Using npx (No Installation)**

```bash
cd your-project
npx agents-templated@latest init --preset=nextjs
```

### 📋 CLI Commands

**Setup Commands:**
```bash
# Quick start with presets
agents-templated init --preset=nextjs         # Next.js full-stack
agents-templated init --preset=django-react   # Django + React
agents-templated init --preset=express-api    # Express.js API
agents-templated init --preset=fastapi        # FastAPI
agents-templated init --preset=go-api         # Go API

# Interactive wizard
agents-templated wizard                       # Guided setup

# Manual component selection
agents-templated init --all                   # All components
agents-templated init --docs                  # Documentation only
agents-templated init --rules                 # Agent rules only
agents-templated init --skills                # Skills only
agents-templated init --github                # GitHub Copilot config

# Force overwrite
agents-templated init --all --force           # Overwrite existing files
```

**Maintenance Commands:**
```bash
# Validation
agents-templated validate                     # Quick setup validation
agents-templated doctor                       # Comprehensive health check

# Updates
agents-templated update                       # Apply template updates
agents-templated update --check-only          # Check without installing

# Information
agents-templated list                         # Show components and presets
```

### Install Your Technology Stack

After initializing the template, install your chosen framework and dependencies. The template provides patterns but does **not** install packages for you.

**Frontend:**
- React/Next.js, Vue/Nuxt, Angular, Svelte/SvelteKit, or traditional SSR

**Backend:**
- Node.js (Express/Fastify/Nest.js), Python (Django/FastAPI/Flask), Go, Rust, Java/Spring Boot, Ruby on Rails, PHP (Laravel)

**Database:**
- PostgreSQL, MySQL, MongoDB, SQLite, or cloud solutions (Supabase, Firebase, PlanetScale)

**Example installations:**
```bash
# Next.js
npm install next react react-dom typescript

# Django
pip install django djangorestframework python-dotenv

# Express API
npm install express typescript zod prisma
```

### 🤖 Configure AI Assistants

The template includes configuration files for multiple AI coding assistants:

**Cursor:**
- Auto-loads `.cursorrules` and `agents/rules/*.mdc` files
- No additional configuration needed

**GitHub Copilot:**
- Auto-loads `.github/copilot-instructions.md`
- Works in VS Code,VS Code Insiders, and github.com

**Other AI Tools:**
- Reference `AI_INSTRUCTIONS.md` explicitly in your prompts
- Copy relevant rules from `agents/rules/` as needed

## \ud83d\udce6 What Gets Installed

When you run `agents-templated init`, you get:

```
├── agents/                          # Agent rules and skills
│   ├── rules/                      # Development rules and patterns
│   │   ├── core.mdc               # Core architecture guidelines
│   │   ├── security.mdc           # Security patterns and requirements
│   │   ├── testing.mdc            # Testing strategy and patterns
│   │   ├── frontend.mdc           # Frontend development patterns
│   │   ├── database.mdc           # Database design and patterns
│   │   └── style.mdc              # Code style and formatting rules
│   └── skills/                     # Reusable agent skills
│       ├── web-design-guidelines/  # Web interface guidelines skill
│       └── find-skills/           # Skill discovery utilities
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot configuration
├── AGENTS.md                       # Agent responsibilities and usage guide
├── CLAUDE.md                       # Project guidelines and architecture
├── AI_INSTRUCTIONS.md              # Universal AI assistant instructions
├── .gitignore                      # Pre-configured Git ignore patterns
└── README.md                       # Project documentation
```

## \ud83d\udce6 Programmatic API

Use agents-templated programmatically in build scripts or automation:

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

## \ud83d\udcda Core Configuration Files
\ud83e\udd16 Agent-Based Development

This template uses specialized agents for different aspects of development:

**FrontendAgent:**\nHandles UI/UX development, component creation, design system implementation, and accessibility compliance.

**BackendAgent:**\nManages API development, business logic, authentication, authorization, rate limiting, and security middleware.

**DatabaseAgent:**\nOwns database schema design, migrations, query optimization, and data access patterns.

**TestAgent:**\nImplements comprehensive testing strategy across unit, integration, E2E, accessibility, and security testing.

**SecurityAgent:**\nEnsures security-first development with input validation, authentication patterns, authorization checks, and OWASP compliance.

**ReviewerAgent:**\nPerforms code reviews focusing on correctness, security, performance, test coverage, and accessibility.

## \ud83d\udd12 Agent-Based Development

This template uses specialized agents for different aspects of development:

### FrontendAgent
Handles UI/UX development, component creation, design system implementation, and accessibility compliance.

### BackendAgent
Manages API development, business logic, authentication, authorization, rate limiting, and security middleware.

### DatabaseAgent
Owns database schema design, migrations, query optimization, and data access patterns.

### TestAgent
Implements comprehensive testing strategy across unit, integration, E2E, accessibility, and security testing.

### SecurityAgent
Ensures security-first development with input validation, authentication patterns, authorization checks, and OWASP compliance.

### ReviewerAgent
Performs code reviews focusing on correctness, security, performance, test coverage, and accessibility.

## Core Principles

### Security-First Development
- Validate all inputs at application boundaries with schema validation
- Authenticate and authorize every protected endpoint
- Rate limit public endpoints to prevent abuse
- Sanitize outputs to prevent injection attacks
- Never expose sensitive data in error messages or logs

### Testing Strategy
- **Unit Tests**: 80% coverage for business logic
- **Integration Tests**: 15% coverage for API endpoints and database operations
- **E2E Tests**: 5% coverage for critical user journeys
- **Accessibility Tests**: WCAG 2.1 AA compliance for all UI

### Type Safety
- Use strong typing systems available in your chosen language
- Implement runtime validation for all external/user-provided data
- Validate at boundaries: API endpoints, form submissions, configuration
- Generate types from schemas when possible (OpenAPI, GraphQL, database schemas)

### Code Quality
- Maintain consistent patterns throughout the codebase
- Follow established code style guidelines
- Ensure proper error handling and logging
- Keep documentation updated with code changes

## Security Patterns

### Input Validation Example

```typescript
// TypeScript with Zod
imp\ud83d\udd12 ort { z } from 'zod'

const userSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8)
})
```

```python
# Python with Pydantic
from pydantic import BaseModel, EmailStr

class User(BaseModel):
    email: EmailStr
    password: str
```

### Rate Limiting Example

```javascript
// Node.js with express-rate-limit
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts'
})
```

## Testing Strategy

### Coverage Targets
- **Unit Tests**: 80% coverage for business logic
- **Integration Tests**: 15% coverage for API endpoints and database operations
- **E2E Tests**: 5% coverage for critical user journeys
\ud83e\uddea 
### Testing Tools by Technology

**JavaScript/TypeScript:**
- Unit/Integration: Jest, Vitest, or framework-specific test runners
- E2E: Playwright, Cypress, or Selenium
- Component: Testing Library, Enzyme

**Python:**
- Unit/Integration: pytest, unittest
- E2E: Selenium, Playwright
- API: requests, httpx

**Go:**
- Unit/Integration: Built-in testing package, testify
- E2E: Selenium, Playwright
- HTTP: httptest package

## AI Assistant Integration

### Cursor
Rules are automatically loaded from:
- `.cursorrules` file
- `agents/rules/*.mdc` files with `alwaysApply: true`
- `\ud83e\udd16 AGENTS.md` and `CLAUDE.md` (via workspace rules)

### GitHub Copilot
Instructions are automatically loaded from:
- `.github/copilot-instructions.md`

### Other AI Assistants
Reference `AI_INSTRUCTIONS.md` explicitly in your prompts:
- "Follow the patterns in `AI_INSTRUCTIONS.md`"
- "Check `AGENTS.md` for agent delegation"
- "Apply security patterns from `agents/rules/security.mdc`"

## \ud83d\udcdd Usage Examples

### Frontend Development
```
"Create a responsive navigation component with accessibility support"
"Redesign the user profile page following our design system"
"Implement the login form with proper validation"
```

### Backend Development
```
"Create a secure user registration endpoint with rate limiting"
"Implement JWT authentication middleware"
"Add password reset functionality with email verification"
```

### Database Operations
```
"Design a user roles and permissions schema"
"Create a migration to add audit logging"
"Optimize the user query to prevent N+1 problems"
```

## Documentation

### Getting Started
1. Review `CLAUDE.md` for architecture and technology selection guidance
2. Check `AGENTS.md` for agent responsibilities and delegation patterns
3. Reference `agents/rules/*.mdc` files for detailed implementation patterns
4. Configure your AI assistant using the appropriate configuration file

### Additional Resources
- **Architecture**: See `CLAUDE.md` for detailed architecture guidelines
- **Agent Usage**: See `AGENTS.md` for detailed agent responsibilities
- **Security**: See `agents/rules/security.mdc` for security patterns
- **Testing**: See `agents/rules/testing.mdc` for testing strategy
- **Code Style**: See `agents/rules/style.mdc` for formatting rules

## Quality Gates

All code must meet these standards:
- Pass linting and formatting checks
- Meet minimum test coverage thresholds (80% unit, 15% integration, 5% E2E)
- Pass security scans without high-severity issues
- Pass accessibility tests for user-facing features
- Follow established patterns and conventions

## Contributing

When contributing to this template:
1. Maintain technology-agnostic patterns
2. Update relevant rule files in `agents/rules/`
3. Keep documentation synchronized with code changes
4. Follow security and testing patterns
5. Ensure AI assistant configurations remain compatible

---

**Ready to start building?** Choose your technology stack, adapt the configuration files, and begin development with enterprise-grade patterns from day one.
