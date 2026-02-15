# Google Gemini AI Instructions

This project uses enterprise-grade, technology-agnostic development patterns for all Google Gemini AI assistants, whether used through:
- Google AI Studio (aistudio.google.com)
- Gemini IDE extensions
- Gemini API integration
- Other Gemini-powered tools

## Quick Start

- **AI Guide**: See `AGENTS.md` for comprehensive instructions
- **Architecture**: See `agent-docs/ARCHITECTURE.md` for project guidelines
- **AI Guide**: See `AGENTS.md` for AI assistant patterns
- **Detailed Rules**: See `agents/rules/*.mdc` files
- **Available Skills**: See `agents/skills/` directory

## Core Development Patterns

Follow these enterprise-grade patterns for all development work:

### 1. Security-First Approach
- **Validate all inputs**: Use schema validation for all user inputs and API requests
- **Authentication**: Implement secure session management and authentication flows
- **Authorization**: Apply role-based access control with proper middleware
- **Rate limiting**: Protect public endpoints from abuse with appropriate rate limiting
- **Error handling**: Never expose sensitive data in error messages or logs
- **Database safety**: Use ORM/ODM patterns exclusively, avoid raw SQL queries
- Reference: `agents/rules/security.mdc`

### 2. Testing Requirements
- **Unit tests**: Target 80% coverage for business logic
- **Integration tests**: 15% coverage for API and database operations
- **E2E tests**: 5% coverage for critical user journeys
- All business logic must have appropriate test cases
- Reference: `agents/rules/testing.mdc`

### 3. Type Safety & Validation
- Use strong typing systems available in your language of choice
- Implement runtime validation at all API boundaries
- Apply schema validation to form inputs and API requests
- Reference: `agents/rules/core.mdc`

### 4. Code Quality Standards
- **Readability**: Clear variable names, proper documentation, logical organization
- **Type safety**: Strict typing throughout, no loose type usage
- **Performance**: Monitor resource usage, implement caching, optimize queries
- **Maintainability**: Modular design, separation of concerns, SOLID principles
- **Accessibility**: WCAG 2.1 AA compliance for all user-facing interfaces
- Reference: `agents/rules/style.mdc`

## Agent-Based Development

This project follows an agent-based pattern where different roles handle different aspects:

| Agent | Responsibility | Reference |
|-------|-----------------|-----------|
| **FrontendAgent** | UI/Design, components, accessibility, responsive layouts | `agents/rules/frontend.mdc` |
| **BackendAgent** | API routes, business logic, authentication, services | `agents/rules/security.mdc` |
| **DatabaseAgent** | Schema design, migrations, data access, optimization | `agents/rules/database.mdc` |
| **TestAgent** | Testing strategy, coverage, test organization | `agents/rules/testing.mdc` |
| **SecurityAgent** | Security patterns, validation, rate limiting, access control | `agents/rules/security.mdc` |
| **ReviewerAgent** | Code quality, performance, accessibility, architecture | All rules |

When implementing features, identify which agent responsibility applies and refer to the appropriate rules file.

## Technology Stack Independence

These patterns apply regardless of your tech stack. Adapt them to your chosen framework:

### Frontend Frameworks
- **React/Next.js/Vue/Svelte**: Component-based architecture with state management
- **Angular**: Component + service pattern with TypeScript
- **Traditional/Server-rendered**: Progressive enhancement with server-side rendering

### Backend Frameworks
- **Node.js**: Express, Fastify, Koa, or Next.js API routes
- **Python**: Django, FastAPI, Flask with ORM patterns
- **Go**: Gin, Echo, Fiber for high-performance APIs
- **Other languages**: Apply patterns to your chosen framework

### Database Technologies
- **SQL**: PostgreSQL, MySQL, SQLite with ORM (Prisma, TypeORM, SQLAlchemy, etc.)
- **NoSQL**: MongoDB, DynamoDB with schema validation
- **Cloud-native**: Supabase, Firebase with built-in security

## Critical Rules (Never Skip These)

1. **Input Validation**: ALL user inputs must be validated with schema validation libraries
2. **Authentication**: Implement secure authentication with proper session management
3. **Rate Limiting**: Public endpoints MUST have rate limiting to prevent abuse
4. **Authorization**: Role-based access control with verified permissions
5. **Data Safety**: Never expose sensitive information in error responses
6. **Database Access**: Use ORM/ODM exclusively, never raw queries for user data
7. **Test Coverage**: Minimum 80% coverage for business logic
8. **Accessibility**: WCAG 2.1 AA compliance for all user interfaces
9. **Documentation**: Keep guides updated; code should be self-documenting
10. **Performance**: Monitor metrics, implement caching, optimize critical paths

## File Reference Guide

| File | Purpose | When to Use |
|------|---------|------------|
| `AGENTS.md` | Primary AI assistant guide | Always start here |
| `agent-docs/ARCHITECTURE.md` | Architecture and technology stack decisions | Need architectural guidance |
| `AGENTS.md` | AI assistant guide and patterns | How to work effectively with AI |
| `agents/rules/core.mdc` | Core development principles | General development questions |
| `agents/rules/security.mdc` | Security patterns and implementations | Building secure features |
| `agents/rules/testing.mdc` | Testing strategy and best practices | Writing tests or test strategy |
| `agents/rules/frontend.mdc` | Frontend patterns and components | Building UI features |
| `agents/rules/database.mdc` | Database and data access patterns | Working with data layers |
| `agents/rules/style.mdc` | Code style and formatting | Code style questions |
| `agents/skills/` | Domain-specific implementations | Looking for reusable patterns |

## Workflow Recommendations

1. **Read AGENTS.md** for comprehensive AI assistance guidance
2. **Read agent-docs/ARCHITECTURE.md** to understand the overall architecture
3. **Reference AGENTS.md** for AI working patterns and guidance
3. **Reference the appropriate rule file** for implementation patterns
4. **Look in agents/skills/** for domain-specific guidance
5. **Follow all critical rules** without exception
6. **Apply patterns consistently** across the codebase

## Additional Context

- This template is **completely technology-agnostic** and works with any programming language
- All patterns are **framework and language-independent**
- The rules can be adapted to your specific tech stack while maintaining the security and quality principles
- Skills in `agents/skills/` provide specific, actionable implementations

---

For best results with Gemini AI assistance, reference the appropriate context from `AGENTS.md`, `agent-docs/ARCHITECTURE.md`, and the relevant `agents/rules/*.mdc` files in your prompts.
