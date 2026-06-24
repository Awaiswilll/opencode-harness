# OpenCode AI Agent Harness

A **comprehensive, categorized collection** of 80+ specialized AI agents, 260+ domain skills, 35+ slash commands, and 24 agent prompt files — ready to plug into OpenCode, Claude Code, Cursor, Codex, or any AI coding assistant.

## Pluggable Into OpenCode

### Option 1: Clone & Symlink (Recommended)

```bash
git clone https://github.com/Awaiswilll/opencode-harness.git ~/opencode-harness
~/opencode-harness/scripts/install.js
```

This symlinks `agents/` and `skills/` into your `~/.config/opencode/`.

### Option 2: npm Global Install

```bash
npm install -g opencode-harness
npx opencode-harness-install
```

### Option 3: Per-Project (Add to opencode.jsonc)

```jsonc
{
  "skills": {
    "paths": ["./node_modules/opencode-harness/skills"]
  }
}
```

### Option 4: Manual Symlinks

```bash
ln -s /path/to/harness/agents ~/.config/opencode/agents
ln -s /path/to/harness/skills ~/.config/opencode/skills

## Repository Structure

```
opencode-harness/
├── agents/              # 87 expert agents, categorized
│   ├── engineering-workflow/   # planner, architect, tdd-guide, code-reviewer...
│   ├── code-review/            # language reviewers (python, rust, go, java...)
│   ├── build-and-fix/          # build resolvers (cpp, go, rust, java...)
│   ├── security/               # security-reviewer, penetration testing
│   ├── ml-ai/                  # MLE, GAN, ML workflows
│   ├── mobile/                 # Flutter, Swift, Kotlin, HarmonyOS
│   ├── networking/             # Network architecture, config, troubleshooting
│   ├── business/               # Marketing, SEO, ecommerce, content creation
│   ├── personal-productivity/  # Goal setting, growth, finance, coordination
│   ├── creative-design/        # Graphic design, typography
│   ├── opensource/             # Forking, packaging, sanitization
│   └── healthcare/             # Healthcare domain review
├── skills/              # 260+ domain skills, categorized
│   ├── engineering/     # TDD, e2e, API design, agent harnesses, benchmarks
│   ├── frontend/        # React, Vue, Next.js, Nuxt, motion, a11y
│   ├── backend/         # Django, Laravel, Spring Boot, NestJS, Quarkus
│   ├── languages/       # Python, Rust, Go, Java, C++, Perl, C#, F#
│   ├── mobile/          # Kotlin, Swift, Flutter, Compose Multiplatform
│   ├── data-science/    # ML pipelines, PyTorch, scientific research
│   ├── database/        # PostgreSQL, MySQL, ClickHouse, migrations
│   ├── security/        # Review, scan, compliance (HIPAA, SOC2, Defi)
│   ├── design/          # UI/UX, branding, slides, video, icons
│   ├── network-infra/   # Cisco, BGP, homelab, WireGuard, VLAN
│   ├── business/        # Marketing, finance, logistics, CRM, compliance
│   └── tools-platforms/ # GitHub, Jira, MCP servers, Google Workspace
├── config/              # Ready-to-use OpenCode/Claude Code configuration
│   ├── commands/        # 35 slash commands (plan, tdd, code-review...)
│   ├── prompts/agents/  # 24 agent prompt templates
│   ├── tools/           # TypeScript tool implementations
│   ├── instructions/    # Security, coding standards, workflow rules
│   ├── plugins/         # ECC hooks plugin for automation
│   └── mcp-servers.json # 26+ MCP server configs (GitHub, Jira, Supabase...)
```

## Agent Categories

| Category | Agents | What They Do |
|----------|--------|-------------|
| **Engineering Workflow** | 17 | Plan, architect, code review, TDD, refactor, test, debug |
| **Code Review** | 17 | Language-specific reviewers (Python, Rust, Go, Java, TS...) |
| **Build & Fix** | 11 | Build error resolution for every major language |
| **Security** | 2 | Vulnerability scanning, security reviews |
| **ML/AI** | 6 | MLE pipelines, GAN workflows, conversation analysis |
| **Mobile** | 7 | Flutter, Swift, Kotlin, HarmonyOS, Dart |
| **Networking** | 4 | Network architecture, config, troubleshooting |
| **Business** | 10 | Marketing, SEO, ecommerce, content, copywriting |
| **Personal** | 5 | Goal setting, growth, finance, coordination |
| **Creative** | 2 | Graphic design, typography |
| **Open Source** | 3 | Forking, packaging, sanitization |
| **Healthcare** | 1 | Healthcare domain compliance |

## Available Commands

| Command | Description |
|---------|-------------|
| `/plan` | Create implementation plan |
| `/tdd` | Enforce TDD workflow (80%+ coverage) |
| `/code-review` | Review code for quality & security |
| `/security` | Run comprehensive security review |
| `/build-fix` | Fix build and TypeScript errors |
| `/e2e` | Generate/run Playwright E2E tests |
| `/refactor-clean` | Remove dead code, consolidate |
| `/orchestrate` | Multi-agent orchestration |
| `/learn` | Extract patterns and learnings |
| `/verify` | Run verification loop |
| `/eval` | Run evaluation against criteria |

## MCP Servers Included

26+ MCP server configs: GitHub, Jira, Supabase, Firecrawl, Vercel, Railway, Cloudflare, ClickHouse, Exa Search, Context7, Playwright, fal.ai, Browserbase, Devfleet, Confluence, and more.

## Source

This harness is sourced from [ECC (Everything Claude Code)](https://github.com/Awaiswilll/ECC) — an agent operating system for AI coding assistants. All agents and skills have been categorized and organized for easy discovery and use.

## License

MIT
