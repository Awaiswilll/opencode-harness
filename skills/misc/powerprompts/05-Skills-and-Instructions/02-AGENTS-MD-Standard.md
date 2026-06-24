# AGENTS.md Open Standard

> The open standard specification for guiding coding agents — adopted by 60,000+ GitHub repos and 20+ coding agents.

---

## Table of Contents

1. [Overview](#overview)
2. [The AGENTS.md Specification](#the-agentsmd-specification)
3. [Structure: Build Commands, Code Style, Test Requirements, Files to Never Modify](#structure-build-commands-code-style-test-requirements-files-to-never-modify)
4. [Hierarchical AGENTS.md in Monorepos](#hierarchical-agentsmd-in-monorepos)
5. [Example AGENTS.md File](#example-agentsmd-file)
6. [Adoption and Ecosystem](#adoption-and-ecosystem)
7. [Best Practices](#best-practices)
8. [References](#references)

---

## Overview

### What Is AGENTS.md?

`AGENTS.md` is an **open standard** (stewarded by the Agentic AI Foundation under the Linux Foundation) for a markdown file that tells AI coding agents how to work with a project. It sits in the root of a repository and provides structured, machine-readable instructions covering:

- How to build, test, and lint the project
- Code style and conventions to follow
- Test requirements and coverage expectations
- Files and directories the agent must never modify
- Available skills and agent capabilities

### Why AGENTS.md Was Created

Coding agents traditionally had no standard way to learn about a project. They would:

1. Guess build commands from common patterns (often wrong)
2. Infer code style from existing files (inconsistent)
3. Modify files they shouldn't (breaking configuration)
4. Waste tokens discovering what should be obvious

`AGENTS.md` solves this by providing a **single source of truth** that every agent can read at the start of a session. The result is faster, more accurate, and more predictable agent behavior.

### Key Design Principles

| Principle | Description |
|-----------|-------------|
| **Open** | Free to implement, no proprietary dependencies |
| **Simple** | Plain markdown, no special syntax required |
| **Structured** | Consistent sections agents can parse reliably |
| **Hierarchical** | Nested files for monorepos and multi-project repos |
| **Deterministic** | Exact commands, not descriptions |
| **Non-intrusive** | Only guides agent behavior, doesn't control it |

### Supported Agents (20+)

- **Claude Code** (Anthropic) — Native support
- **OpenAI Codex** — Full support
- **GitHub Copilot** — Chat and agent mode support
- **Cursor** — Agent mode with AGENTS.md loading
- **Windsurf** (Codeium) — Agent skill integration
- **Cline** — Open-source support
- **Roo Code** — Open-source support
- **Continue** — IDE plugin support
- **Sourcegraph Cody** — Enterprise support
- **CodeGPT** — Multi-agent support
- **Aider** — Pair programming agent
- **OpenHands** — Research agent support
- **SWE-Agent** — Automated SWE benchmark agent
- And more...

---

## The AGENTS.md Specification

### File Location

The standard location is a single `AGENTS.md` file in the repository root:

```
repo-root/
├── AGENTS.md
├── src/
├── tests/
└── package.json
```

Agents discover this file by scanning the working directory and its ancestors. The **nearest AGENTS.md** takes precedence.

### Required Sections

Only the **title** is strictly required. All other sections are optional but recommended:

```markdown
# Project Name
```

### Recommended Sections

| Section | Purpose | When to Include |
|---------|---------|-----------------|
| `## Build Commands` | Exact commands for building, testing, linting | Always |
| `## Code Style` | Conventions, patterns, naming rules | Always |
| `## Test Requirements` | Test structure, coverage, mocking | If project has tests |
| `## Files the Agent Must Never Modify` | Protected files and directories | Always |
| `## Architectural Conventions` | Project structure and patterns | For larger projects |
| `## Skills` | Available skill files | If skills are used |
| `## Environment` | Required tools, versions, env vars | If project has specific deps |

### File Format

Plain markdown with the following conventions:

- **Section headers**: `## Section Name` (H2) for major sections
- **Sub-sections**: `### Sub-section` (H3) for details within sections
- **Commands**: Inline code backticks or fenced code blocks
- **Lists**: Bullet or numbered lists for grouped items
- **Emphasis**: Bold or italic for important points

---

## Structure: Build Commands, Code Style, Test Requirements, Files to Never Modify

### Build Commands

The most critical section. Agents execute these commands frequently — they must be exact.

```markdown
## Build Commands

### Development
- `npm run dev` — Start development server with hot reload
- `npm run watch` — Watch mode for TypeScript compilation

### Production Build
- `npm run build` — Production build output to `dist/`
- `npm run build -- --analyze` — Build with bundle analysis

### Testing
- `npm test` — Run all tests (unit + integration)
- `npm run test:unit` — Unit tests only
- `npm run test:integration` — Integration tests only
- `npm run test -- --watch` — Watch mode for TDD

### Linting and Formatting
- `npm run lint` — ESLint with auto-fix
- `npm run format` — Prettier formatting
- `npm run typecheck` — TypeScript type checking
```

**Format rules:**
- Each entry is: `` - `command` — description ``
- Use the exact command the agent should run
- Include flags and arguments
- Describe what the command does briefly

### Code Style

Defines the conventions the agent should follow when writing code.

```markdown
## Code Style

### TypeScript
- Use strict mode (`strict: true` in tsconfig)
- Prefer interfaces over type aliases for object shapes
- Use `type` for unions, intersections, and utility types
- Avoid `any` — use `unknown` and narrow with type guards
- Use `const` assertions for literal types

### Naming Conventions
- **PascalCase**: Components, interfaces, types, classes, enums
- **camelCase**: Functions, methods, variables, parameters, properties
- **UPPER_CASE**: Constants (primitive values), enum values
- **kebab-case**: File names, directory names

### File Organization
- One component per file
- Co-locate tests with source: `Component.tsx` + `Component.test.tsx`
- Index files for barrel exports
- Max 200 lines per file (split if exceeded)

### React/JSX
- Use functional components with hooks
- Props interface defined above the component
- Destructure props in function parameters
- Use `React.FC` return type annotation
- Fragment shorthand `<>...</>` for multiple children
```

### Test Requirements

Tells the agent what testing conventions and standards to follow.

```markdown
## Test Requirements

### Test Framework
- Vitest (preferred) or Jest
- React Testing Library for component tests
- Playwright for E2E tests

### Test Structure
- Tests alongside source: `Component.tsx` → `Component.test.tsx`
- Describe blocks for grouping: `describe('Component', () => { ... })`
- Test names should read as sentences: `test('renders with default props', ...)`

### Coverage Requirements
- Minimum 80% line coverage
- Minimum 70% branch coverage
- 100% coverage for utility functions and helpers
- No untested error paths

### Patterns
- Mock external services and APIs
- Use MSW (Mock Service Worker) for HTTP mocks
- Snapshot tests for UI components only
- Integration tests for critical user flows
- Unit tests for business logic and utilities

### Running Tests
- `npm test` — Before every commit
- `npm run test:coverage` — Check coverage before merging
- `npm run test:e2e` — Full E2E suite (CI only)
```

### Files the Agent Must Never Modify

Critical safety section. Lists files and directories the agent must treat as read-only.

```markdown
## Files the Agent Must Never Modify

### Configuration Files
- `src/config/*` — All configuration files
- `deployment/*.yaml` — Deployment configuration
- `.github/workflows/*.yml` — CI/CD pipelines
- `docker-compose.yml` — Docker configuration
- `terraform/` — Infrastructure as code
- `.env*` — Environment files (may contain secrets)

### Build and Dependency Files
- `package-lock.json` — Never modify lock files
- `pnpm-lock.yaml` — Lock file for pnpm
- `yarn.lock` — Lock file for yarn
- `tsconfig.json` — TypeScript configuration (unless explicitly requested)

### Generated Files
- `dist/` — Build output
- `node_modules/` — Dependencies
- `coverage/` — Test coverage reports
- `.next/` — Next.js build output

### Security-Critical Files
- `src/auth/*` — Authentication logic
- `src/middleware/*` — Security middleware
- `.gitignore` — Git ignore rules
- `.npmrc` — NPM configuration
```

**Why this section matters:** Without explicit "never modify" rules, agents may:
- Modify CI/CD pipeline files, breaking deployments
- Edit lock files, causing dependency mismatches
- Overwrite configuration, causing environment-specific failures
- Modify auth logic, introducing security vulnerabilities

---

## Hierarchical AGENTS.md in Monorepos

### The Problem

In monorepos with multiple projects, a single root-level `AGENTS.md` is too generic. Each project may have its own build commands, code style overrides, and protected files.

### The Solution: Hierarchical AGENTS.md

Place `AGENTS.md` files at multiple levels of the repository. Child files inherit from parent files, with the nearest file taking precedence for specific settings.

### Inheritance Model

```
monorepo/
├── AGENTS.md                    # Root: global conventions
├── packages/
│   ├── frontend/
│   │   ├── AGENTS.md            # Frontend-specific overrides
│   │   └── src/
│   │       └── components/
│   │           └── AGENTS.md    # Component-specific (optional)
│   ├── backend/
│   │   ├── AGENTS.md            # Backend-specific
│   │   └── ...
│   └── shared/
│       └── AGENTS.md            # Shared library conventions
└── docs/
    └── AGENTS.md                # Documentation-specific rules
```

### Merge Rules

| Section | Root AGENTS.md | Child AGENTS.md | Result |
|---------|---------------|-----------------|--------|
| Build Commands | `npm run build:all` | `npm run build:frontend` | Child overrides for same key |
| Code Style | `max-line-length: 100` | `max-line-length: 120` | Child value wins |
| Never Modify | `deployment/` | `deployment/frontend/` | Union of both lists |
| Test Requirements | `min-coverage: 80%` | — | Inherited from parent |
| Skills | `test`, `lint` | `deploy-frontend` | Child list replaces parent |

### Implementation Pattern

**Root AGENTS.md** (monorepo root):
```markdown
# Monorepo Project

## Build Commands
- `npm run build:all` — Build all packages
- `npm test` — Run all tests across packages
- `npm run lint` — Lint all packages

## Code Style
- TypeScript strict mode across all packages
- PascalCase for components and types
- camelCase for functions and variables

## Files the Agent Must Never Modify
- `.github/workflows/*.yml`
- `deployment/*.yaml`
- `packages/*/src/config/*`
```

**Child AGENTS.md** (packages/frontend):
```markdown
# Frontend Package

## Build Commands
- `npm run build:frontend` — Build frontend only (overrides root)
- `npm run test:frontend` — Run frontend tests only
- `npm run dev` — Start frontend dev server

## Code Style
- Max line length: 120 (overrides root's 100)
- Use styled-components for styling
- File names in kebab-case

## Files the Agent Must Never Modify
- `src/styles/theme.ts` — Design tokens (adds to parent union)
- `public/` — Static assets
```

### Discovery Algorithm

When an agent starts in a subdirectory:

1. Look for `AGENTS.md` in the current directory
2. If found, **stop** — this is the primary file
3. Walk up directory tree to find parent `AGENTS.md`
4. Merge parent into child using the merge rules
5. Repeat until root is reached or no more files found
6. Cache the merged result for the session

---

## Example AGENTS.md File

### Complete Production Example

```markdown
# Acme SaaS Platform

A multi-tenant B2B SaaS platform built with Next.js, tRPC, Prisma, and PostgreSQL.

## Build Commands

### Development
- `pnpm dev` — Start all services in development mode
- `pnpm dev:frontend` — Start frontend only (port 3000)
- `pnpm dev:api` — Start API only (port 4000)
- `pnpm db:studio` — Open Prisma Studio for database management

### Building
- `pnpm build` — Production build (all packages)
- `pnpm build:frontend` — Frontend production build
- `pnpm build:api` — API production build
- `pnpm build -- --analyze` — Build with bundle analysis

### Testing
- `pnpm test` — Run all tests
- `pnpm test -- --coverage` — Run tests with coverage report
- `pnpm run test:e2e` — Playwright E2E tests
- `pnpm run test:watch` — Watch mode for TDD

### Linting and Type Checking
- `pnpm lint` — ESLint with auto-fix
- `pnpm format` — Prettier formatting check
- `pnpm format:fix` — Prettier formatting fix
- `pnpm typecheck` — TypeScript type checking across all packages

## Code Style

### TypeScript
- `strict: true` in all tsconfig files
- No `any` — use `unknown` with type guards
- Prefer `interface` for public APIs, `type` for internal unions
- Use branded types for IDs: `type UserId = string & { readonly __brand: 'UserId' }`
- JSDoc comments for all exported functions and types

### Naming
- PascalCase: components, interfaces, types, enums, classes
- camelCase: functions, methods, variables, React hooks (useXxx)
- UPPER_CASE: environment variables, magic constants
- kebab-case: file and directory names
- Prefix event handlers with `handle`: `handleClick`, `handleSubmit`
- Prefix private methods with `_`: `_calculateTotal`

### React / Next.js
- App Router for all new pages
- Server Components by default; Client Components only when needed
- Use `use server` for server actions, `use client` for interactivity
- Import types with `type` keyword: `import type { User } from './types'`
- Use `next/image` for all images, `next/link` for navigation

### Database (Prisma)
- All queries go through service layer (not directly in components)
- Use transactions for multi-table operations
- Soft delete: `deletedAt: DateTime | null`
- Add `@updatedAt` to all models for change tracking

## Test Requirements

### Framework
- Vitest for unit and integration tests
- React Testing Library for component tests
- Playwright for E2E tests
- MSW for API mocking in integration tests

### Coverage
- Minimum 85% line coverage overall
- 100% coverage for: validation logic, utility functions, database queries
- 70%+ coverage for: pages and components
- No regressions — new code must not lower existing coverage

### Test Structure
- Co-locate: `Component.tsx` → `Component.test.tsx`
- Integration tests in `__tests__/integration/`
- E2E tests in `e2e/`
- Factories and fixtures in `test/factories/` and `test/fixtures/`

### Patterns
- Mock all external services (stripe, sendgrid, datadog)
- Use Prisma factories for test data
- Snapshot test only stable UI components
- Test error states and loading states alongside happy paths
- Accessibility checks with `@testing-library/jest-dom`

## Files the Agent Must Never Modify

### Infrastructure and Configuration
- `.github/workflows/*.yml` — CI/CD pipeline definitions
- `deployment/` — Kubernetes and Terraform configs
- `docker-compose*.yml` — Docker Compose configurations
- `Dockerfile*` — Docker build definitions
- `terraform/` — Infrastructure as code
- `.env*` — Environment files (may contain secrets)
- `next.config.js` — Next.js configuration
- `prisma/schema.prisma` — Database schema (read-only unless requested)
- `pnpm-lock.yaml` — Package lock file
- `tsconfig.json` — TypeScript config
- `.eslintrc*` — ESLint configuration
- `.prettierrc*` — Prettier configuration

### Security
- `src/lib/auth.ts` — Authentication provider setup
- `src/middleware.ts` — Next.js middleware (auth checks)
- `src/lib/session.ts` — Session management
- `src/lib/encryption.ts` — Encryption utilities
- `src/config/` — Application configuration

### Generated
- `.next/` — Next.js build output
- `dist/` — Compiled output
- `coverage/` — Test coverage reports
- `node_modules/` — Dependencies
- `prisma/migrations/` — Database migrations (use CLI)

## Environment

### Required Tools
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker Desktop (for local database)
- PostgreSQL 16 (via Docker or native)

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Auth secret
- `NEXT_PUBLIC_APP_URL` — Application URL
- `STRIPE_SECRET_KEY` — Stripe API key (test mode)
- `SENDGRID_API_KEY` — Email service API key

## Skills
- `deploy-staging` in `skills/deploy-staging.md`
- `db-migrate` in `skills/db-migrate.md`
- `code-review` in `skills/code-review.md`
```

---

## Adoption and Ecosystem

### Adoption Statistics (2026)

| Metric | Value |
|--------|-------|
| GitHub repos with AGENTS.md | 60,000+ |
| Supported coding agents | 20+ |
| Companies with internal AGENTS.md standards | 1,200+ |
| Skills.sh registered skills | 8,500+ |
| Agentic AI Foundation members | 45+ organizations |

### Ecosystem Growth Timeline

- **2024 Q3**: Initial proposal by OpenAI and Anthropic
- **2024 Q4**: Draft specification published
- **2025 Q1**: Agentic AI Foundation formed under Linux Foundation
- **2025 Q2**: Version 1.0 specification released
- **2025 Q3**: Adopted by 10,000+ GitHub repos
- **2026 Q1**: Adopted by 40,000+ repos, 15+ agents
- **2026 Q3**: 60,000+ repos, 20+ agents, formal standardization

### Who Maintains the Standard

The **Agentic AI Foundation** under the **Linux Foundation** stewards the standard. Members include:

- OpenAI
- Anthropic
- Microsoft (GitHub Copilot)
- Google (Gemini)
- Codeium (Windsurf)
- Vercel
- LangChain
- Sourcegraph
- And 35+ other organizations

---

## Best Practices

### Writing Effective AGENTS.md Files

1. **Be command-exact**: Give the exact command with all flags, not a description.

2. **Be specific about constraints**: "Never modify files under `src/config/`" is better than "Be careful with config files."

3. **Organize logically**: Group related commands (build, test, lint) and use consistent formatting.

4. **Include the "why" sparingly**: Agents only need the "what" and "how" — save explanations for developer documentation.

5. **Update when the project changes**: If you change build tools or test frameworks, update AGENTS.md simultaneously.

6. **Test with multiple agents**: Verify your AGENTS.md works correctly with Claude Code, Codex, Cursor, and Copilot.

7. **Keep it concise**: Aim for 50-200 lines. Too much information dilutes the most important instructions.

### Common Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Vague commands | `"Build the project"` | Give exact command: `npm run build` |
| Prose paragraphs | Hard for agents to parse | Use bullet points and structured lists |
| Missing test section | Agent guesses test patterns | Always include test requirements |
| No protected files | Agent may break config | Always list files to never modify |
| Outdated commands | Agent runs wrong commands | Update with every tool change |
| Too much context | Important instructions get lost | Keep focused on agent-relevant info |

### Review Checklist

- [ ] Build commands are exact and tested
- [ ] Test commands and coverage requirements are specified
- [ ] Code style conventions are concrete (not "write good code")
- [ ] Files to never modify are explicitly listed
- [ ] No secrets, API keys, or internal URLs
- [ ] Works with the project's actual build system
- [ ] Tested with the target coding agent(s)
- [ ] Updated within the last month (or note last review date)

---

## References

### Specification
- [agents.md](https://agents.md) — Official AGENTS.md specification
- Agentic AI Foundation — Standard governance body

### Research
- Princeton University: "Measuring the Impact of AGENTS.md" (arXiv 2601.20404)
- Preprint: 28.6% runtime reduction, 16.6% token reduction with AGENTS.md

### Tool Documentation
- Anthropic: "Claude Code and AGENTS.md"
- OpenAI: "AGENTS.md — a simple, open format for guiding coding agents"
- GitHub: "Using AGENTS.md with Copilot"
- Cursor: "Project Rules and AGENTS.md"
- Windsurf: "Agent Skills Configuration"

### Community
- GitHub topic: `agents-md`
- Vercel Labs: `agent-skills` repository (27.5k+ stars)
- [skills.sh](https://skills.sh) — Agent Skills Directory
- Agentic AI Foundation — Membership and governance
