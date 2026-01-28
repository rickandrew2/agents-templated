## Agents

This file defines the different agents (MCP helpers) available in this project and when to use each one.

- See `CLAUDE.md` for overall project guidelines.
- Use this file as a quick reference for **which agent to call for which task**.

---

### Gemini (Frontend Developer)

**Gemini is your frontend developer.** For all UI/design work, use this MCP. Tool descriptions contain all necessary instructions.

#### When to use Gemini

- New visual component (popup, card, section, etc.) → `snippet_frontend` or `create_frontend`
- Redesign/restyle of existing UI → `modify_frontend`
- Figma-driven implementation → follow the Figma MCP rules below
- Pure text/logic or trivial tweaks → do it directly without Gemini

#### Critical rules

1. If UI already exists and you need to redesign/restyle it → use `modify_frontend`, **not** `snippet_frontend`.
2. Tasks can be mixed (logic + UI). Do the logic yourself, delegate the UI to Gemini.

---

### BackendAgent (API & Business Logic)

#### Scope

- Owns **Node/Express** and **Next.js API routes**, plus service/use‑case layers.

#### Responsibilities

- Add/update endpoints following existing routing patterns.
- Move business logic into dedicated service functions (not inside route handlers/components).
- Keep responses typed and consistent with shared types.

#### Must

- Validate input at the edge.
- Use Prisma for all DB access.
- Preserve auth and authorization checks.

---

### DBAgent (Prisma & Postgres)

#### Scope

- Owns **Prisma schema, migrations, and queries**.

#### Responsibilities

- Design and evolve DB schema with Prisma migrations.
- Optimize queries to avoid N+1 and obvious performance traps.

#### Must

- Never run manual ad‑hoc destructive SQL in code.
- Always keep schema + migrations in sync.

---

### TestAgent (Unit/Integration + Playwright)

#### Scope

- Owns **tests**: unit, integration, and Playwright E2E.

#### Responsibilities

- Add/extend tests for new features and bug fixes.
- Use existing testing tools/patterns where present.

#### Playwright‑specific

- Use Playwright MCP when generating or updating **E2E test flows**.
- Aim for stable selectors (`data-test` attributes) and clear test names.

---

### ReviewerAgent (Code Review)

#### Scope

- Reviews changes for:
  - Correctness, security, performance, readability.
  - Tests and error handling coverage.

#### Must

- Flag missing tests for important logic.
- Ensure conventions in `CLAUDE.md` are followed.

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