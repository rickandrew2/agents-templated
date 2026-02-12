# Technology-Agnostic Development Template

A flexible, enterprise-grade development template that adapts to any modern technology stack while maintaining security-first development patterns, comprehensive testing, and excellent developer experience.

## 🎯 Purpose

This template provides a **proven agent-based development structure** that can be adapted to any technology stack:
- **Frontend**: React, Vue, Angular, Svelte, or traditional server-side rendering
- **Backend**: Node.js, Python, Go, Rust, Java, or any modern backend framework  
- **Database**: SQL, NoSQL, or cloud-native database solutions
- **Authentication**: Self-managed or Authentication as a Service
- **Deployment**: Any cloud provider or hosting solution

## 🏗️ Architecture

### Agent-Based Development
This template uses specialized agents for different aspects of development:

- **FrontendAgent**: UI/UX development and design system implementation
- **BackendAgent**: API development, business logic, and server-side concerns  
- **DatabaseAgent**: Schema design, migrations, and data access patterns
- **TestAgent**: Comprehensive testing strategy across all layers
- **SecurityAgent**: Security-first development and compliance
- **ReviewerAgent**: Code review and quality assurance

### Core Principles
- ✅ **Security-first development** with OWASP Top 10 protection
- ✅ **Type safety** across the entire application stack
- ✅ **Comprehensive testing** with unit, integration, and E2E coverage
- ✅ **Accessibility** compliance with WCAG 2.1 AA standards
- ✅ **Performance optimization** with monitoring and optimization patterns
- ✅ **Developer experience** with hot reload, debugging, and quality gates

## 🚀 Quick Start

### 1. Clone and Clean
```bash
# Clone the template
git clone <this-repo> my-project
cd my-project

# Remove technology-specific files (optional - see cleanup guide below)
rm package*.json *.config.* tsconfig.json
rm -rf app/ components/ lib/ public/ test/ node_modules/ .next/
```

### 2. Choose Your Stack
Select your preferred technologies:

**Frontend Options:**
- React/Next.js, Vue/Nuxt, Angular, Svelte/SvelteKit, or traditional SSR

**Backend Options:**
- Node.js (Express/Fastify), Python (Django/FastAPI), Go, Rust, Java/Spring

**Database Options:**
- PostgreSQL/MySQL with ORM, MongoDB/NoSQL, or cloud solutions like Supabase

### 3. Adapt the Template
Update the configuration files for your chosen stack:

```bash
# Update agent rules for your technology choices
# Edit agents/rules/*.mdc files
code agents/rules/core.mdc

# Customize the cursor rules for your stack
code .cursorrules

# Update project guidelines
code CLAUDE.md
```

### 4. Initialize Your Project
Set up your chosen technologies:

```bash
# Example for Node.js + React
npm init -y
npm install react next typescript
# ... install your chosen dependencies

# Example for Python + Django  
pip install django djangorestframework
django-admin startproject myproject .

# Example for Go + Gin
go mod init myproject
go get github.com/gin-gonic/gin
```

## 📁 Directory Structure

### Current Structure
```
├── agents/                    # Agent rules and skills (create this)
│   ├── rules/                # Development rules and patterns
│   │   ├── core.mdc         # Core architecture guidelines  
│   │   ├── security.mdc     # Security patterns and requirements
│   │   └── style.mdc        # Code style and formatting rules
│   └── skills/              # Reusable agent skills and capabilities
├── AGENTS.md                 # Agent responsibilities and usage guide
├── CLAUDE.md                 # Project guidelines and architecture
├── .cursorrules             # Cursor AI assistant configuration
├── .gitignore               # Git ignore patterns (generalized)
├── .editorconfig            # Editor configuration (universal)
└── README.md                # This file
```

### After Adding Your Stack
Your structure will adapt to your chosen technologies:

```bash
# React/Next.js example
├── agents/
├── src/ or app/             # Your source code
├── public/                  # Static assets  
├── package.json            # Node.js dependencies
├── tsconfig.json           # TypeScript configuration
└── next.config.js          # Framework configuration

# Django example  
├── agents/
├── myproject/              # Django project
├── apps/                   # Django apps
├── requirements.txt        # Python dependencies
├── manage.py              # Django management
└── settings/              # Django settings

# Go example
├── agents/  
├── cmd/                   # Application entrypoints
├── internal/              # Private application code
├── pkg/                   # Public library code
├── go.mod                 # Go module file
└── main.go               # Main application file
```

## 🛠️ Configuration Files

### Core Template Files (Keep)
- `AGENTS.md` - Agent responsibilities and delegation patterns
- `CLAUDE.md` - Project guidelines and architecture decisions  
- `.cursorrules` - AI assistant configuration and development rules
- `.gitignore` - Version control ignore patterns (update as needed)
- `.editorconfig` - Universal editor configuration

### Technology-Specific Files (Add as needed)
- **JavaScript/TypeScript**: `package.json`, `tsconfig.json`, `eslint.config.js`
- **Python**: `requirements.txt` or `pyproject.toml`, `setup.py`
- **Go**: `go.mod`, `go.sum`
- **Rust**: `Cargo.toml`, `Cargo.lock`
- **Java**: `pom.xml` or `build.gradle`

## 🔒 Security Patterns

This template enforces security-first development:

### Input Validation
```typescript
// Example with Zod (TypeScript)
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8)
})
```

```python
# Example with Pydantic (Python)
from pydantic import BaseModel, EmailStr

class User(BaseModel):
    email: EmailStr
    password: str
```

### Authentication Patterns
- Secure session management with appropriate token expiration
- Multi-factor authentication for sensitive operations
- Role-based access control with proper middleware
- Secure password hashing and storage

### Rate Limiting
```javascript
// Example rate limiting pattern
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts'
})
```

## 🧪 Testing Strategy

### Test Coverage Targets
- **Unit Tests**: 80% coverage for business logic
- **Integration Tests**: 15% coverage for API endpoints and database operations
- **E2E Tests**: 5% coverage for critical user journeys

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

## 📋 Agent Usage Examples

### Frontend Development
```bash
# Delegate UI work to FrontendAgent
"Create a responsive navigation component with accessibility support"
"Redesign the user profile page following our design system"
"Implement the login form with proper validation"
```

### Backend Development  
```bash
# Delegate API work to BackendAgent
"Create a secure user registration endpoint with rate limiting"
"Implement JWT authentication middleware"
"Add password reset functionality with email verification"
```

### Database Operations
```bash
# Delegate database work to DatabaseAgent
"Design a user roles and permissions schema"
"Create a migration to add audit logging"
"Optimize the user query to prevent N+1 problems"
```

## 🚀 Deployment Patterns

### Environment Configuration
```bash
# Environment variables pattern
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
JWT_SECRET=your-secret-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker Support
```dockerfile
# Example Dockerfile pattern
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### CI/CD Pipeline
```yaml
# Example GitHub Actions
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Security audit
        run: npm audit
      - name: Accessibility tests
        run: npm run test:a11y
```

## 🔄 Maintenance

### Regular Updates
- **Dependencies**: Update regularly with proper testing
- **Security**: Apply security patches immediately  
- **Performance**: Monitor and optimize based on metrics
- **Documentation**: Keep current with code changes

### Quality Gates
- All code must pass linting and formatting checks
- Test coverage must meet minimum thresholds
- Security scans must pass without high-severity issues
- Accessibility tests must pass for user-facing features

## 📚 Documentation

### Additional Resources
- **Architecture**: See `CLAUDE.md` for detailed architecture guidelines
- **Agent Usage**: See `AGENTS.md` for detailed agent responsibilities  
- **Security**: See `agents/rules/security.mdc` for security patterns
- **Code Style**: See `agents/rules/style.mdc` for formatting rules

### Getting Help
1. **Check the agent files** in `agents/rules/*.mdc` for implementation patterns
2. **Review `CLAUDE.md`** for architecture and technology selection guidance
3. **Use the agents** defined in `AGENTS.md` for specialized development tasks
4. **Follow security patterns** to maintain enterprise-grade security standards

---

**Ready to start building?** Choose your technology stack, adapt the configuration files, and begin development with enterprise-grade patterns from day one.
