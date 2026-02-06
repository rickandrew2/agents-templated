## Project Guidelines

This is an **enterprise-grade Next.js development template** with comprehensive security, testing, and developer experience optimizations.
These guidelines are for both humans and AI assistants (Cursor / Claude / rick).

- High-level **project and architecture** guidelines live here in `CLAUDE.md`.
- **Agent responsibilities** and MCP integration are documented in `AGENTS.MD`.
- **Detailed implementation rules** live in `.cursor/rules/*.mdc` files.

Read this file first to understand the architecture, then consult `AGENTS.MD` for agent delegation.

---

## Architecture Overview

### Database Strategy (Choose One)

This template supports **two database variants**. **Choose ONE for your project**:

#### Option A: Prisma + PostgreSQL
- ✅ **Best for**: Complex schemas, type safety, custom business logic
- ✅ **Features**: Type-safe queries, migrations, multi-database support
- ✅ **Use when**: Building complex applications with custom constraints

#### Option B: Supabase
- ✅ **Best for**: Rapid prototyping, MVPs, real-time features
- ✅ **Features**: Built-in auth, real-time subscriptions, Row Level Security
- ✅ **Use when**: Need auth + database + real-time out of the box

**IMPORTANT**: After choosing, remove the unused variant from your project codebase to avoid confusion.

### Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with design system foundations
- **Database**: Prisma + PostgreSQL OR Supabase (see choice above)
- **Authentication**: NextAuth.js v5 (works with both database options)
- **Testing**: Vitest + Testing Library + Playwright
- **Deployment**: Vercel (optimized configuration)

### Core Principles

- **Security First**: Comprehensive input validation, CSRF protection, secure headers
- **Type Safety**: End-to-end TypeScript with runtime validation
- **Performance**: Optimized bundles, image handling, caching strategies
- **Developer Experience**: Hot reload, comprehensive testing, automated quality gates
- **Maintainability**: Clear architecture, consistent patterns, automated formatting

---

## Development Guidelines

### File Structure

```
app/                    # Next.js App Router
├── (auth)/            # Route groups for organization
├── api/               # API routes with validation
├── globals.css        # Global styles
├── layout.tsx         # Root layout with providers
└── page.tsx           # Landing page

components/            # Shared UI components
├── ui/               # Base design system components
├── forms/            # Form components with validation
└── layout/           # Layout-specific components

lib/                  # Shared utilities and configurations
├── auth.ts           # Authentication configuration
├── data/             # Database access layer
├── utils.ts          # Utility functions
├── validations/      # Zod schemas
└── env.ts            # Environment validation

hooks/                # Custom React hooks
docs/                 # Project documentation
e2e/                  # Playwright E2E tests
__tests__/           # Unit and integration tests
```

### Coding Standards

#### TypeScript Best Practices

```typescript
// ✅ Good: Strict typing with proper validation
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50)
})

type User = z.infer<typeof userSchema>

// ✅ Good: Branded types for IDs
type UserId = string & { readonly __brand: unique symbol }

// ❌ Bad: Using 'any' type
function processData(data: any) { /* ... */ }

// ✅ Good: Proper generic constraints
function processData<T extends Record<string, unknown>>(data: T): T {
  return validateAndTransform(data)
}
```

#### Component Patterns

```typescript
// ✅ Good: Server Component with proper data fetching
export default async function UserProfile({ params }: { 
  params: { id: string } 
}) {
  const user = await getUserById(params.id)
  if (!user) notFound()
  
  return <UserCard user={user} />
}

// ✅ Good: Client Component with proper hooks
'use client'

interface UserFormProps {
  user?: User
  onSubmit: (data: UserFormData) => Promise<void>
}

export function UserForm({ user, onSubmit }: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user
  })
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

#### Security Patterns

```typescript
// ✅ Good: Input validation at boundaries
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const validation = validateRequest(createUserSchema, body)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }
  
  // Process validated data...
}

// ✅ Good: Database queries with proper error handling
export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        // Never select passwords or sensitive fields by default
      }
    })
    return user
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}
```

### Performance Guidelines

- **Server Components First**: Use Server Components unless you need client interactivity
- **Image Optimization**: Always use `next/image` with proper sizing
- **Bundle Analysis**: Run `npm run analyze` to check bundle size
- **Core Web Vitals**: Monitor LCP, FID, CLS metrics
- **Caching**: Leverage Next.js caching with proper revalidation

### Security Checklist

- [ ] All user inputs validated with Zod schemas
- [ ] Rate limiting applied to authentication endpoints
- [ ] Security headers configured in next.config.ts
- [ ] Environment variables validated at startup
- [ ] Database queries use ORM (no raw SQL)
- [ ] Error messages don't leak sensitive information
- [ ] HTTPS enforced in production
- [ ] Content Security Policy configured

---

## Agent Delegation

### When to Use Specific Agents

Refer to `AGENTS.MD` for detailed agent responsibilities. Quick reference:

- **UI/Design Work** → Use **Gemini** agent (`snippet_frontend`, `modify_frontend`)
- **API Endpoints** → Use **BackendAgent** for route handlers and business logic
- **Database Changes** → Use **DBAgent** for schema updates and queries
- **Testing** → Use **TestAgent** for unit, integration, and E2E tests
- **Code Review** → Use **ReviewerAgent** for quality and security checks
- **Figma Implementation** → Follow **Figma MCP** workflow in `AGENTS.MD`

### Agent Handoff Rules

1. **Mixed Tasks**: When a task involves both logic and UI, handle the logic yourself and delegate UI to Gemini
2. **Database + API**: Let DBAgent handle schema changes, then BackendAgent implements the API layer
3. **Feature Complete**: After implementation, use ReviewerAgent to validate security and testing coverage

---

## Development Workflow

### Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (copy from .env.example once created)
cp .env.example .env.local

# 3. Choose your database variant
# For Prisma: Set up database and run migrations
npm run db:migrate
npm run db:generate

# For Supabase: Configure your Supabase project URL and keys

# 4. Run development server
npm run dev

# 5. Set up pre-commit hooks
npm run prepare
```

### Quality Gates

This template includes automated quality checks:

```bash
# Type checking
npm run type-check

# Linting with auto-fix
npm run lint:fix

# Code formatting
npm run format

# Unit tests
npm run test

# Unit tests with UI
npm run test:ui

# E2E tests
npm run test:e2e

# Bundle analysis
npm run analyze
```

### Database Commands

```bash
# Prisma variant
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Create and run migrations
npm run db:studio       # Open Prisma Studio

# Supabase variant
# Use Supabase CLI or dashboard for schema management
# Type generation handled automatically
```

### Production Deployment

1. **Environment Setup**: Configure production environment variables
2. **Database**: Run migrations (Prisma) or deploy schema (Supabase)
3. **Build**: `npm run build` - includes type checking and linting
4. **Deploy**: Push to Vercel (or your preferred platform)

---

## Testing Strategy

### Test Pyramid

- **Unit Tests (80%)**: Components, hooks, utilities, data access layer
- **Integration Tests (15%)**: API routes, database operations, authentication flows
- **E2E Tests (5%)**: Critical user journeys, cross-browser compatibility

### Testing Patterns

```typescript
// Unit test example
describe('Button Component', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})

// Integration test example
describe('POST /api/users', () => {
  it('creates user with valid data', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' }
    const response = await POST(createRequest(userData))
    
    expect(response.status).toBe(201)
    // Verify user was created in database
  })
})

// E2E test example
test('user can complete signup flow', async ({ page }) => {
  await page.goto('/auth/signup')
  await page.fill('[data-test=email]', 'test@example.com')
  await page.fill('[data-test=password]', 'securePassword123!')
  await page.click('[data-test=submit]')
  
  await expect(page).toHaveURL('/dashboard')
})
```

---

## Common Commands Reference

```bash
# Development
npm run dev              # Start development server
npm run dev:debug        # Start with debugging enabled

# Building
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run lint            # Check linting
npm run lint:fix        # Auto-fix linting issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:ui         # Run tests with Vitest UI
npm run test:e2e        # Run Playwright tests
npm run test:e2e:ui     # Run Playwright with UI

# Database (Prisma variant)
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio

# Analysis
npm run analyze         # Bundle size analysis

# Setup
npm run prepare         # Install git hooks
```

---

## Troubleshooting

### Common Issues

**TypeScript Errors**: Run `npm run type-check` for detailed error information
**Database Issues**: Ensure your database is running and connection string is correct
**Build Failures**: Check that all environment variables are set in production
**Test Failures**: Run `npm run test:watch` for detailed test debugging

### Performance Issues

1. Use `npm run analyze` to identify large bundles
2. Check Network tab for slow API calls
3. Use React DevTools Browser Profiler for component performance
4. Monitor Core Web Vitals in production

---

This template provides a robust foundation for building production-ready Next.js applications with enterprise-grade security, performance, and developer experience.
