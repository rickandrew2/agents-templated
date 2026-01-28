## Project Guidelines

This project uses **Next.js + Node/Express API + Prisma + Postgres + Tailwind + Playwright**.
These rules are for both humans and AI helpers (Cursor / Claude / rick).

- High-level **project and code rules** live here in `CLAUDE.md`.
- Detailed **agent responsibilities** live in `AGENTS.MD`.
- Concrete **Cursor rule files** live in `.cursor/rules/*.mdc`.

Read this file first to understand how to structure code, then consult `AGENTS.MD` for which agent to use.

### Tech Stack & Architecture

- **Frontend**: Next.js (React, App Router when possible), Tailwind CSS for styling.
- **Backend**: Node/Express API routes (or Next.js API routes where appropriate).
- **Data**: Postgres via Prisma ORM. Prisma is the **only** way to talk to the DB from app code.

High-level principles:

- Prefer **feature‑oriented structure** (group by feature/domain, not by layer only).
- Keep **shared types** in a common module (e.g. `@/lib/types`), reused in API + UI.
- Business logic lives in **services/use‑cases**, not inside route handlers or components.

### Coding Style

- Use **TypeScript** everywhere (no `any` unless absolutely necessary).
- Components:
  - Use functional React components.
  - Use `PascalCase` for components, `camelCase` for hooks and helpers.
  - Prefer **server components** in Next.js unless you truly need client features.
- Styling:
  - Use Tailwind utility classes; avoid custom CSS files unless necessary.
  - Reuse existing components before creating new ones.

### Frontend Development (Gemini MCP)

When working on UI/design tasks, use the **Gemini** agent defined in `AGENTS.MD`.

- New visual component (popup, card, section, etc.) → `snippet_frontend` or `create_frontend`.
- Redesign/restyle of existing UI → `modify_frontend` (not `snippet_frontend`).
- Pure text/logic or trivial tweaks → do it directly without Gemini.

### Backend & Data Rules

- **Express / Next.js routes**:
  - Validate input at the edge (Zod or similar).
  - Never trust client data; always re‑fetch important data from the DB.
  - Return typed responses and consistent error shapes.
- **Prisma**:
  - No raw SQL unless there is a clear performance reason.
  - All schema changes must go through migrations; never edit the DB manually.

### Security & Secrets

- Never commit secrets (API keys, DB URLs, JWT secrets). Use environment variables.
- For authenticated endpoints, always check auth/authorization via the existing helpers.
- Do not log passwords, tokens, or other sensitive data.

### Testing (Playwright & Others)

- Use **Playwright** for end‑to‑end / UI flows.
- Unit/integration tests should live next to the code they test when possible.
- Prefer testing **behavior** over implementation details.

### Common Commands (example)

- Install deps: `pnpm install` (or `npm install` / `yarn` – adjust to your actual choice).
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Tests: `pnpm test`
- Playwright: `pnpm playwright test`
