# Project Name

A short description of what this project does.

## Build Commands

### Development
- `npm run dev` — Start development server with hot reload

### Production Build
- `npm run build` — Production build

### Testing
- `npm test` — Run all tests
- `npm run test:watch` — Watch mode for TDD

### Linting and Formatting
- `npm run lint` — Lint with auto-fix
- `npm run format` — Format code
- `npm run typecheck` — TypeScript type checking

## Code Style

### TypeScript
- Use strict mode (`strict: true` in tsconfig)
- Prefer interfaces over type aliases for object shapes
- Use `type` for unions, intersections, and utility types
- Avoid `any` — use `unknown` and narrow with type guards

### Naming Conventions
- **PascalCase**: Components, interfaces, types, classes, enums
- **camelCase**: Functions, methods, variables, parameters
- **kebab-case**: File names, directory names

### File Organization
- One component per file
- Co-locate tests with source: `Component.tsx` + `Component.test.tsx`
- Max 200 lines per file (split if exceeded)

## Test Requirements

### Framework
- Vitest (preferred) or Jest

### Coverage
- Minimum 80% line coverage
- Mock external services and APIs
- Integration tests for critical user flows

## Files the Agent Must Never Modify

### Configuration
- `.github/workflows/*.yml` — CI/CD pipelines
- `deployment/*.yaml` — Deployment configuration
- `docker-compose.yml` — Docker configuration
- `.env*` — Environment files (may contain secrets)

### Build and Dependencies
- `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` — Lock files
- `tsconfig.json` — TypeScript configuration (unless explicitly requested)

### Generated Files
- `dist/` — Build output
- `node_modules/` — Dependencies
- `coverage/` — Test coverage reports

### Security
- `src/auth/*` — Authentication logic
- `src/middleware/*` — Security middleware

## Environment

### Required Tools
- Node.js >= 20.0.0
- npm or pnpm

### Environment Variables
- (List project-specific env vars here)

## Skills

Reference this project's skills or agents from the configured list.

---

# ECC — Agent Instructions (v2.0.0-rc.1)

## Core Principles

1. **Agent-First** — Delegate to specialized agents for domain tasks
2. **Test-Driven** — Write tests before implementation, 80%+ coverage required
3. **Security-First** — Never compromise on security; validate all inputs
4. **Immutability** — Always create new objects, never mutate existing ones
5. **Plan Before Execute** — Plan complex features before writing code

## Available Agents (ECC)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| planner | Implementation planning | Complex features, refactoring |
| architect | System design and scalability | Architectural decisions |
| tdd-guide | Test-driven development | New features, bug fixes |
| code-reviewer | Code quality and maintainability | After writing/modifying code |
| security-reviewer | Vulnerability detection | Before commits, sensitive code |
| build-error-resolver | Fix build/type errors | When build fails |
| e2e-runner | End-to-end Playwright testing | Critical user flows |
| refactor-cleaner | Dead code cleanup | Code maintenance |
| doc-updater | Documentation and codemaps | Updating docs |
| cpp-reviewer | C/C++ code review | C and C++ projects |
| cpp-build-resolver | C/C++ build errors | C and C++ build failures |
| docs-lookup | Documentation lookup via Context7 | API/docs questions |
| go-reviewer | Go code review | Go projects |
| go-build-resolver | Go build errors | Go build failures |
| kotlin-reviewer | Kotlin code review | Kotlin/Android/KMP projects |
| kotlin-build-resolver | Kotlin/Gradle build errors | Kotlin build failures |
| database-reviewer | PostgreSQL/Supabase specialist | Schema design, query optimization |
| python-reviewer | Python code review | Python projects |
| java-reviewer | Java and Spring Boot code review | Java/Spring Boot projects |
| java-build-resolver | Java/Maven/Gradle build errors | Java build failures |
| loop-operator | Autonomous loop execution | Run loops safely, monitor stalls |
| harness-optimizer | Harness config tuning | Reliability, cost, throughput |
| rust-reviewer | Rust code review | Rust projects |
| rust-build-resolver | Rust build errors | Rust build failures |

## Commands Available

| Command | Description | Agent |
|---------|-------------|-------|
| `/plan` | Create implementation plan | planner |
| `/tdd` | Enforce TDD workflow (80%+ coverage) | tdd-guide |
| `/code-review` | Review code for quality/security | code-reviewer |
| `/security` | Run comprehensive security review | security-reviewer |
| `/build-fix` | Fix build and TypeScript errors | build-error-resolver |
| `/e2e` | Generate/run E2E Playwright tests | e2e-runner |
| `/refactor-clean` | Remove dead code, consolidate duplicates | refactor-cleaner |
| `/orchestrate` | Multi-agent orchestration for complex tasks | planner |
| `/learn` | Extract patterns and learnings | — |
| `/checkpoint` | Save verification state | — |
| `/verify` | Run verification loop | — |
| `/eval` | Run evaluation against criteria | — |
| `/update-docs` | Update documentation | doc-updater |
| `/update-codemaps` | Update codemaps | doc-updater |
| `/test-coverage` | Analyze test coverage | tdd-guide |
| `/go-review` | Go code review | go-reviewer |
| `/go-test` | Go TDD workflow | tdd-guide |
| `/go-build` | Fix Go build errors | go-build-resolver |
| `/skill-create` | Generate skills from git history | — |
| `/projects` | List known projects and instinct stats | — |

## Development Workflow (ECC)

1. **Plan** — Use `/plan` or `planner` agent for complex features
2. **TDD** — Write tests first via `/tdd` (80%+ coverage)
3. **Review** — Use `/code-review` immediately after writing code
4. **Security** — Use `/security` before commits on sensitive code
5. **Commit** — Conventional commits format (`feat:`, `fix:`, `refactor:`, etc.)

## MCP Servers (Configured in `mcp-configs/mcp-servers.json`)

18 servers available: jira, github, firecrawl, supabase, memory, omega-memory, longhand, sequential-thinking, vercel, railway, cloudflare*, clickhouse, exa-web-search, context7, magic, filesystem, playwright, fal-ai, browserbase, browser-use, devfleet, token-optimizer, laraplugins, confluence, evalview, squish
