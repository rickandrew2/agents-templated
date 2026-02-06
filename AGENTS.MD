## Agents

This file defines the different agents (MCP helpers) available in this **enterprise-grade Next.js template** and when to use each one.

- See `CLAUDE.md` for overall project guidelines.
- Use this file as a quick reference for **which agent to call for which task**.
- All agents now support **security-first development** with comprehensive validation patterns.

---

### Gemini (Frontend Developer)

**Gemini is your frontend developer.** For all UI/design work, use this MCP. Tool descriptions contain all necessary instructions.

#### When to use Gemini

- New visual component (popup, card, section, etc.) → `snippet_frontend` or `create_frontend`
- Redesign/restyle of existing UI → `modify_frontend`
- Figma-driven implementation → follow the Figma MCP rules below
- Component library and design system work
- Accessibility improvements and WCAG compliance
- Pure text/logic or trivial tweaks → do it directly without Gemini

#### Enhanced Capabilities

- **Security-aware components**: Automatically includes proper input sanitization
- **Accessibility-first**: Components include ARIA attributes and keyboard navigation
- **Performance-optimized**: Uses Next.js Image, lazy loading, and bundle optimization
- **Type-safe**: All components include proper TypeScript interfaces

#### Critical rules

1. If UI already exists and you need to redesign/restyle it → use `modify_frontend`, **not** `snippet_frontend`.
2. Tasks can be mixed (logic + UI). Do the logic yourself, delegate the UI to Gemini.
3. **Always include accessibility testing** patterns for new components.
4. **Follow security patterns** from `.cursor/rules/security.mdc` for user inputs.

---

### BackendAgent (API & Business Logic)

#### Scope

- Owns **Next.js API routes**, **Server Actions**, and **service/use-case layers**
- **Authentication & Authorization** with NextAuth.js v5
- **Rate limiting** and **security middleware**
- **Input validation** with Zod schemas

#### Enhanced Responsibilities

- Implement secure API endpoints with comprehensive validation
- Add authentication middleware and role-based access control
- Integrate rate limiting for DoS protection
- Create type-safe server actions and data fetching
- Handle errors gracefully with proper logging
- Move business logic into dedicated service functions (not inside route handlers/components)
- Keep responses typed and consistent with shared types

#### Security Requirements (NEW)

- **Always validate input** at API boundaries using Zod schemas
- **Implement rate limiting** for all public endpoints
- **Use NextAuth.js v5** for authentication flows
- **Apply OWASP Top 10** protection patterns
- **Log security events** appropriately without exposing sensitive data
- **Handle database errors** gracefully with proper error responses

#### Database Integration

- **Database-agnostic**: Support both Prisma and Supabase patterns
- **Choose your approach**: Use consistent database access patterns
- **Type-safe queries**: Leverage ORM type generation
- **Error handling**: Proper database error catching and transformation

---

### DBAgent (Database & Schema Management)

#### Scope

- Owns **database schema, migrations, and data access patterns**
- **Database-agnostic**: Supports both **Prisma + PostgreSQL** and **Supabase** approaches

#### Enhanced Responsibilities

- **Schema Design**: Create optimized, scalable database schemas
- **Migration Management**: Handle schema evolution safely
- **Query Optimization**: Prevent N+1 queries and performance issues
- **Data Access Patterns**: Implement consistent, type-safe data access
- **Security**: Row-level security, input sanitization, and access controls

#### Database Strategy Support

**For Prisma + PostgreSQL:**
- Design schema in `prisma/schema.prisma`
- Create and manage migrations with `prisma migrate`
- Implement type-safe queries with Prisma Client
- Handle connection pooling and optimization

**For Supabase:**
- Design tables with Row Level Security (RLS) policies
- Implement real-time subscriptions where needed
- Use Supabase client with proper type generation
- Leverage built-in authentication and storage

#### Security Requirements (NEW)

- **Input validation**: All database inputs must be validated with Zod
- **Access control**: Implement proper authorization checks
- **SQL injection prevention**: Use ORM-only access, no raw SQL
- **Audit logging**: Track important data changes
- **Data encryption**: Handle sensitive data appropriately

#### Must

- **Choose one approach** and maintain consistency throughout the project
- Never run manual ad-hoc destructive SQL in production code
- Always keep schema + migrations in sync
- **Test database operations** with appropriate test patterns
- **Document schema decisions** and migration strategies

---

### TestAgent (Comprehensive Testing)

#### Scope

- Owns **complete testing strategy**: unit, integration, E2E, and accessibility testing
- **Vitest + Testing Library** for unit and integration tests
- **Playwright** for cross-browser E2E testing
- **Accessibility testing** with axe-core integration

#### Enhanced Responsibilities

- **Unit Testing**: Components, hooks, utilities with >80% coverage
- **Integration Testing**: API routes, database operations, authentication flows
- **E2E Testing**: Critical user journeys across multiple browsers
- **Accessibility Testing**: Automated WCAG compliance checking
- **Performance Testing**: Core Web Vitals and loading time validation
- **Security Testing**: Input validation and authentication testing

#### Testing Patterns (NEW)

- **Component Testing**: React Testing Library with comprehensive user interaction testing
- **API Testing**: Mock authentication, database operations, and external services
- **E2E Testing**: Page Object Model with stable selectors and user journey validation
- **Accessibility Testing**: Automated axe-core scanning and keyboard navigation testing
- **Visual Regression**: Screenshot comparison for critical UI components

#### Quality Gates

- **Code Coverage**: Maintain >80% coverage for business logic
- **E2E Coverage**: All critical user flows must have E2E tests
- **Accessibility**: All public pages must pass WCAG 2.1 AA standards
- **Performance**: Core Web Vitals must meet "Good" thresholds
- **Security**: Authentication and authorization flows fully tested

#### Tools & Configuration

- **Vitest**: Fast unit testing with ES modules support
- **Testing Library**: User-focused component testing
- **Playwright**: Cross-browser E2E testing with trace viewer
- **@axe-core/playwright**: Automated accessibility testing
- **MSW**: API mocking for reliable integration tests

#### Playwright-specific

- Use Playwright MCP when generating or updating **E2E test flows**
- Aim for stable selectors (`data-testid` attributes) and clear test names
- **Implement Page Object Model** for maintainable test code
- **Include accessibility checks** in all E2E test suites

---

### SecurityAgent (NEW - Security & Compliance)

#### Scope

- **Security-first development** across all application layers
- **OWASP Top 10** protection implementation
- **Authentication & authorization** security patterns
- **Input validation** and **output sanitization**
- **Security monitoring** and **audit logging**

#### Responsibilities

- **Input Validation**: Implement Zod schemas for all user inputs
- **Authentication Security**: NextAuth.js v5 configuration and session management
- **Authorization**: Role-based access control (RBAC) implementation
- **Rate Limiting**: DoS protection with sliding window algorithms
- **Security Headers**: CSP, HSTS, and comprehensive security header configuration
- **Data Protection**: Encryption, sanitization, and secure data handling
- **Audit Logging**: Security event logging without exposing sensitive data
- **Vulnerability Assessment**: Regular security pattern reviews

#### Security Patterns

- **Authentication**: Multi-provider NextAuth.js setup with secure session management
- **Authorization**: Middleware-based route protection with role validation
- **Input Validation**: Zod schema validation at every API boundary
- **Rate Limiting**: Upstash Redis-based rate limiting with different limits per endpoint
- **Error Handling**: Secure error responses that don't leak sensitive information
- **Database Security**: ORM-only access with parameterized queries
- **File Upload Security**: Content type validation and secure storage

#### Must

- **Validate all inputs** with appropriate Zod schemas
- **Implement rate limiting** on authentication and public endpoints
- **Use NextAuth.js v5** for all authentication flows
- **Apply security headers** to all responses
- **Log security events** appropriately
- **Never expose sensitive data** in error messages or logs

---

### ReviewerAgent (Code Review & Quality)

#### Enhanced Scope

- Reviews changes for **correctness, security, performance, and readability**
- **Security vulnerability assessment** using OWASP guidelines
- **Performance impact analysis** and optimization recommendations
- **Test coverage verification** and quality assessment
- **Accessibility compliance** checking
- **Code quality standards** enforcement

#### Security Review Focus (NEW)

- **Input validation**: Ensure all user inputs are properly validated
- **Authentication flows**: Verify secure authentication implementation
- **Authorization checks**: Validate role-based access controls
- **Data exposure**: Check for sensitive data leaks in responses
- **Error handling**: Ensure secure error message patterns
- **Dependencies**: Review third-party package security

#### Quality Standards

- **TypeScript**: Strict typing without `any` usage
- **Testing**: Appropriate test coverage for new functionality
- **Performance**: Bundle size impact and Core Web Vitals consideration
- **Accessibility**: WCAG 2.1 AA compliance for user-facing features
- **Security**: OWASP Top 10 protection patterns
- **Documentation**: Clear code documentation and README updates

#### Must

- **Flag missing tests** for important logic and security flows
- **Ensure security patterns** from `.cursor/rules/security.mdc` are followed
- **Validate accessibility** for all user-facing components
- **Check performance impact** of new dependencies and code changes
- **Verify documentation** is updated for significant changes
- **Ensure conventions** in `CLAUDE.md` are followed throughout

---

### Figma MCP Integration Rules

These rules define how to translate Figma inputs into code for this project and must be followed for every Figma-driven change.

#### Required flow (do not skip)

1. Run `get_design_context` first to fetch the structured representation for the exact node(s).
2. If the response is too large or truncated, run `get_metadata` to get the high‑level node map and then re‑fetch only the required node(s) with `get_design_context`.
3. Run `get_screenshot` for a visual reference of the node variant being implemented.
4. Only after you have both `get_design_context` and `get_screenshot`, download any assets needed and start implementation.
5. Translate the output (usually React + Tailwind) into this project's conventions, styles and framework. Reuse the project's color tokens, components, and typography wherever possible.
6. Validate against Figma for 1:1 look and behavior before marking complete.

#### Implementation rules

- Treat the Figma MCP output (React + Tailwind) as a representation of design and behavior, not as final code style.
- Replace Tailwind utility classes with the project's preferred utilities/design‑system tokens when applicable.
- Reuse existing components (e.g., buttons, inputs, typography, icon wrappers) instead of duplicating functionality.
- Use the project's color system, typography scale, and spacing tokens consistently.
- Respect existing routing, state management, and data‑fetch patterns already adopted in the repo.
- Strive for 1:1 visual parity with the Figma design. When conflicts arise, prefer design‑system tokens and adjust spacing or sizes minimally to match visuals.
- Validate the final UI against the Figma screenshot for both look and behavior.