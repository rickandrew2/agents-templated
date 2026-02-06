# Enterprise Next.js Template

🚀 **A production-ready Next.js template with enterprise-grade security, testing, and developer experience.**

## ✨ Key Features

### 🔒 **Security First** 
- **NextAuth.js v5** with multiple provider support
- **Input validation** with Zod schemas at every boundary
- **Rate limiting** with Upstash Redis
- **Security headers** and Content Security Policy
- **OWASP Top 10** protection patterns

### 🗄️ **Flexible Database** 
- **Prisma + PostgreSQL** for complex schemas and type safety
- **Supabase** for rapid development with built-in auth and real-time
- Choose your approach - template supports both with clear separation

### ⚡ **Performance Optimized**
- **Next.js 14+** with App Router and Server Components
- **Bundle analysis** and optimization out of the box
- **Image optimization** with next/image
- **Core Web Vitals** monitoring ready

### 🧪 **Comprehensive Testing**
- **Vitest + Testing Library** for unit and integration tests
- **Playwright** for end-to-end testing with multiple browsers
- **Accessibility testing** with axe-core
- **80%+ code coverage** targets

### 🤖 **AI-First Development**
- **Cursor AI** integration with comprehensive rule files
- **Agent system** for delegating UI, backend, and database work
- **Figma-to-code** workflow with MCP integration

### 🛠️ **Developer Experience**
- **TypeScript** with strict configuration
- **ESLint + Prettier** with security and accessibility rules
- **Husky + lint-staged** for pre-commit quality gates
- **Bundle analyzer** and performance monitoring

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo> my-app
cd my-app
npm install
```

### 2. Choose Your Database Strategy

**Option A: Prisma + PostgreSQL** (Complex schemas, maximum type safety)
```bash
# Set up your PostgreSQL database
cp .env.example .env.local
# Edit DATABASE_URL in .env.local

npm run db:migrate
npm run db:generate
```

**Option B: Supabase** (Rapid development, built-in auth)
```bash
cp .env.example .env.local
# Edit NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Generate types
npx supabase gen types typescript --project-id your-project > types/database.ts
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Generate NextAuth secret
openssl rand -base64 32

# Edit .env.local with your values
```

### 4. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
app/                    # Next.js App Router
├── (auth)/            # Authentication pages
├── api/               # API routes with validation  
├── dashboard/         # Protected dashboard pages
└── globals.css        # Global styles

components/            # Shared components
├── ui/               # Base design system
├── forms/            # Form components
└── layout/           # Layout components

lib/                  # Core utilities
├── auth.ts           # NextAuth configuration
├── data/             # Database access layer
├── validations/      # Zod schemas
└── utils.ts          # Utility functions

.cursor/rules/        # AI development rules
├── core.mdc          # Architecture guidelines
├── frontend.mdc      # React/Next.js patterns
├── database.mdc      # Database patterns
├── security.mdc      # Security best practices
└── testing.mdc       # Testing patterns

__tests__/           # Unit & integration tests
e2e/                 # Playwright E2E tests
docs/                # Project documentation
```

---

## 🛠️ Development Commands

### Development
```bash
npm run dev                # Start development server
npm run build              # Production build
npm run start              # Start production server
```

### Code Quality
```bash
npm run lint               # Check linting
npm run lint:fix           # Auto-fix issues
npm run format             # Format code
npm run type-check         # TypeScript validation
```

### Testing
```bash
npm run test               # Unit tests
npm run test:watch         # Tests in watch mode
npm run test:ui            # Tests with UI
npm run test:e2e           # Playwright E2E tests
npm run test:e2e:ui        # E2E tests with UI
```

### Database (Prisma)
```bash
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Run migrations
npm run db:push            # Push schema changes
npm run db:studio          # Open Prisma Studio
```

### Analysis
```bash
npm run analyze            # Bundle size analysis
```

---

## 🏗️ Architecture Decisions

### Database Strategy

This template supports two database approaches:

| Feature | Prisma + PostgreSQL | Supabase |
|---------|--------------------|-----------| 
| **Type Safety** | ✅ Compile-time | ✅ Generated types |
| **Complex Queries** | ✅ Advanced SQL | ⚠️ Limited joins |
| **Authentication** | ➡️ NextAuth.js | ✅ Built-in |
| **Real-time** | ➡️ Custom solution | ✅ Built-in |
| **File Storage** | ➡️ External service | ✅ Built-in |
| **Learning Curve** | ⚠️ Moderate | ✅ Low |
| **Hosting Flexibility** | ✅ Any provider | ⚠️ Vendor lock-in |

**Choose Prisma** for complex applications with custom business logic.
**Choose Supabase** for rapid prototyping and apps needing real-time features.

### Security Architecture

- **Input Validation**: Zod schemas at API boundaries
- **Authentication**: NextAuth.js v5 with session management
- **Authorization**: Middleware-based route protection
- **Rate Limiting**: Per-endpoint limits with sliding windows
- **Headers**: Comprehensive security headers and CSP
- **Database**: ORM-only access, no raw SQL

### Testing Strategy

- **Unit Tests (80%)**: Components, hooks, utilities
- **Integration Tests (15%)**: API routes, database operations
- **E2E Tests (5%)**: Critical user journeys
- **Accessibility**: Automated axe-core testing

---

## 🤖 AI-Assisted Development

This template includes comprehensive Cursor AI integration:

### Agent System

- **Gemini**: UI/design work (`snippet_frontend`, `modify_frontend`)
- **BackendAgent**: API routes and business logic
- **DBAgent**: Database schema and queries
- **TestAgent**: Testing implementation
- **ReviewerAgent**: Code review and security

### Cursor Rules

Detailed implementation patterns in `.cursor/rules/`:
- `core.mdc` - Architecture and development identity
- `frontend.mdc` - React/Next.js/Tailwind patterns
- `database.mdc` - Database-agnostic patterns
- `security.mdc` - Security best practices
- `testing.mdc` - Testing patterns and examples

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms

This template works with any Node.js hosting provider:
- **Netlify**: Add `netlify.toml` configuration
- **Railway**: Connect GitHub repository
- **Docker**: Add `Dockerfile` and `docker-compose.yml`

### Environment Variables

Essential production variables:
- `DATABASE_URL` or Supabase credentials
- `NEXTAUTH_SECRET` (32+ characters)
- `NEXTAUTH_URL` (your production domain)
- Rate limiting: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

---

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Architecture guidelines and coding standards
- **[AGENTS.md](AGENTS.md)** - AI agent responsibilities and workflows
- **[docs/architecture.md](docs/architecture.md)** - Detailed architecture decisions
- **[.cursor/rules/](/.cursor/rules/)** - Implementation patterns for AI

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** the coding standards in `CLAUDE.md`
4. **Add tests** for new functionality
5. **Run** quality checks: `npm run lint && npm run test`
6. **Submit** a pull request

### Quality Gates

- ✅ TypeScript compilation
- ✅ ESLint + Prettier
- ✅ Unit test coverage >80%
- ✅ E2E test coverage for new features
- ✅ Security scan passes

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Next.js** team for the excellent framework
- **Vercel** for hosting and development experience
- **Prisma** and **Supabase** for database solutions
- **Testing Library** and **Playwright** for testing tools
- **Tailwind CSS** for utility-first styling

---

**Built with ❤️ for modern web development**

[⭐ Star this repo](https://github.com/your-username/your-repo) if it helped you!
