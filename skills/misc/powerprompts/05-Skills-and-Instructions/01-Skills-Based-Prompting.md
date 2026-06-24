# Skills-Based Prompting

> A comprehensive guide to packaging reusable agent capabilities as portable, shareable knowledge files.

---

## Table of Contents

1. [What Are Skills-Based Prompts?](#what-are-skills-based-prompts)
2. [SKILL.md Format with YAML Frontmatter](#skilmd-format-with-yaml-frontmatter)
3. [Portable, Shareable Agent Capabilities](#portable-shareable-agent-capabilities)
4. [Auto-Discovery and Invocation](#auto-discovery-and-invocation)
5. [AGENTS.md and Hierarchical Skills](#agentsmd-and-hierarchical-skills)
6. [Research: Measurable Impact](#research-measurable-impact)
7. [Best Practices](#best-practices)
8. [References and Resources](#references-and-resources)

---

## What Are Skills-Based Prompts?

**Skills-based prompting** packages reusable agent capabilities as portable, shareable knowledge files — typically `SKILL.md` or `AGENTS.md`. A skill is a self-contained markdown file with structured metadata that defines everything an agent needs to perform a specific task: system prompt, tool permissions, workflow steps, and verification criteria.

Unlike ad-hoc prompting where instructions are typed into a chat interface each time, skills are:

- **Version-controlled** — stored alongside code in git
- **Shareable** — distributed via repos, registries, or directories
- **Discoverable** — agents find and load them automatically
- **Composable** — multiple skills can be loaded together
- **Portable** — work across different agent platforms and models

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Skill** | A single reusable capability (e.g., "deploy to ECS", "run security audit") |
| **Skill file** | A markdown file (typically `SKILL.md`) with YAML frontmatter and instructions |
| **Agent manifest** | An `AGENTS.md` file defining project-level conventions and skills |
| **Skill directory** | A registry or folder of discoverable skills |
| **Invocation** | How an agent discovers, loads, and executes a skill |

### Why Skills-Based Prompting Matters

Traditional prompting is ephemeral — typed into a text box, lost after the conversation. Skills-based prompting treats agent instructions as **code**: reusable, testable, and shareable. This shift has significant implications:

- **Consistency**: Every invocation uses the same high-quality instructions
- **Collaboration**: Teams share and review skill files like code
- **Discovery**: Agents automatically find relevant skills without manual loading
- **Measurability**: Skills can be tested, evaluated, and improved iteratively
- **Ecosystem**: A growing ecosystem of pre-built skills for common tasks

---

## SKILL.md Format with YAML Frontmatter

The `SKILL.md` format is the standard way to define a single reusable skill. It uses YAML frontmatter for machine-readable metadata and markdown for human-readable instructions.

### Basic Structure

```yaml
---
name: deploy-to-ecs
description: Deploy the application to AWS ECS with zero-downtime
version: 1.2.0
author: Platform Team
tags:
  - deployment
  - aws
  - ecs
  - docker
tools:
  - aws-cli
  - docker
  - terraform
models:
  - claude
  - gpt-4
---
# Deployment Skill

## Prerequisites
- Docker image built and tagged
- Terraform state available
- AWS credentials configured
- ECS cluster exists

## Steps
1. Run `terraform plan` and verify changes
2. Push Docker image to ECR
3. Update ECS service
4. Monitor deployment via CloudWatch

## Verification
- All tasks in the ECS service show status RUNNING
- Health checks pass for 2 consecutive cycles
- Previous task set is drained successfully

## Rollback
- If deployment fails, run `terraform rollback` to restore previous state
- Monitor for 5 minutes after rollback

## Failure Modes
- Terraform plan fails: Check state file locking and IAM permissions
- ECR push fails: Verify Docker daemon is running and authenticated
- ECS update fails: Check service limits and task definition
```

### YAML Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the skill |
| `description` | Yes | One-sentence summary of what the skill does |
| `version` | No | Semantic version for tracking changes |
| `author` | No | Person or team maintaining the skill |
| `tags` | No | List of keywords for discovery and categorization |
| `tools` | No | External tools the skill requires |
| `models` | No | Recommended models for this skill |
| `requires` | No | Other skills or dependencies |
| `timeout` | No | Expected execution time (e.g., "5min", "30min") |
| `confidence` | No | Minimum confidence threshold (0.0-1.0) |

### Extended Frontmatter Example

```yaml
---
name: security-audit-python
description: Run a comprehensive security audit on a Python codebase
version: 2.1.0
author: security-team@company.com
tags:
  - security
  - python
  - audit
  - owasp
tools:
  - bandit
  - safety
  - pip-audit
  - semgrep
requires:
  - python-setup
models:
  - claude-opus-4
timeout: 15min
confidence: 0.9
inputs:
  - name: repo_path
    type: path
    description: Path to the Python repository to audit
  - name: severity_threshold
    type: string
    default: MEDIUM
    enum: [LOW, MEDIUM, HIGH, CRITICAL]
outputs:
  - name: report
    type: markdown
    description: Security audit report with findings and recommendations
---
```

### Why YAML Frontmatter?

Frontmatter provides **machine-readable metadata** that agents can parse and index without understanding the full markdown content. This enables:

- **Search and discovery**: Agents query skills by tags, tools, or name
- **Dependency resolution**: Skills declare what tools or other skills they need
- **Capability matching**: Agents match skills to tasks based on declared capabilities
- **Version management**: Track and compare skill versions
- **Validation**: Schema-check frontmatter fields for correctness

---

## Portable, Shareable Agent Capabilities

### Portability Across Platforms

Skills are designed to work across different agent platforms and models. A well-written skill should be usable by:

- **Claude Code** (Anthropic)
- **OpenAI Codex** / ChatGPT with GPTs
- **Cursor** (IDE agent)
- **Copilot** (GitHub)
- **Windsurf** (Codeium)
- **Cline** / **Roo Code** (open-source coding agents)

#### Platform Abstraction Layer

```
Skill (SKILL.md) → Agent reads → Interprets for its own model → Executes
     ↑                              ↑
  Standard format           Platform-specific adaptation
```

The key to portability is **command-first instructions**: include exact shell commands, tool invocations, and file paths rather than model-specific API calls.

### Sharing Mechanisms

**1. File-based sharing:**
```
project/
├── .skills/
│   ├── deploy-ecs.skill.md
│   ├── security-audit.skill.md
│   └── code-review.skill.md
└── AGENTS.md
```

**2. Registry-based sharing:**
- [skills.sh](https://skills.sh) — Agent Skills Directory
- Vercel Labs `agent-skills` repo (27.5k+ stars)
- GitHub Marketplace for skills
- Internal company registries

**3. Repository bundling:**
```
repo-root/
├── SKILL.md          # Primary skill for this repo
├── skills/
│   ├── test.md
│   ├── deploy.md
│   └── review.md
└── AGENTS.md         # Project manifest
```

### Skill Composition Pattern

Skills can compose — one skill can invoke another:

```yaml
---
name: full-release-pipeline
description: Complete release pipeline including test, security audit, and deploy
requires:
  - run-tests
  - security-audit-python
  - deploy-to-ecs
---
# Full Release Pipeline

This skill runs all three phases in sequence:
1. run-tests → Must pass with 0 failures
2. security-audit-python → No CRITICAL or HIGH findings
3. deploy-to-ecs → Deploy to staging environment

If any phase fails, stop and report the failure.
```

### Writing Portable Skills: Guidelines

| Principle | Good | Bad |
|-----------|------|-----|
| Command-first | `npm run build -- --prod` | "Build the project" |
| Tool-agnostic | `Run the linter (configured in .eslintrc)` | "Run eslint --fix" |
| Environment-agnostic | Check for required env vars before starting | Assume specific paths |
| Model-agnostic | Use standard markdown, avoid model-specific XML | Use model-specific tags |
| Explicit dependencies | List required tools in `tools:` field | Assume tools are available |

---

## Auto-Discovery and Invocation

### Discovery Mechanisms

Agents discover skills through multiple mechanisms:

**1. Filesystem Scan:**
Agents recursively scan for files matching `SKILL.md`, `AGENTS.md`, or `*.skill.md` patterns in the project directory and its parents.

**2. Manifest Reference:**
The `AGENTS.md` file can explicitly reference skill locations:
```yaml
skills:
  - path: skills/deploy.skill.md
  - path: skills/test.skill.md
  - url: https://registry.example.com/skills/lint.skill.md
```

**3. Registry Lookup:**
Agents query a skill registry by task description:
```
User: "Deploy the application"
Agent: Searches skills registry for tags: ["deployment", ...]
Agent: Finds matching skill → loads and executes it
```

**4. Tool-Based Invocation:**
Skills are invoked as tools within an agent's tool-use loop:
```
Thought: The user wants to deploy. I have a "deploy-to-ecs" skill available.
Action: load_skill("deploy-to-ecs")
Observation: Skill loaded. Steps defined.
Action: execute_skill_step(1)
```

### Invocation Flow

```
User Request
    ↓
Agent analyzes request → identifies task type
    ↓
Agent searches for matching skills
    ├── Local filesystem (nearest SKILL.md)
    ├── AGENTS.md references
    └── Registry lookup
    ↓
Skill found? → Yes → Load skill → Parse frontmatter → Execute steps
              → No  → Fall back to general prompting
    ↓
Agent reports result
```

### Priority and Precedence

When multiple skills match, agents follow a precedence order:

1. **Explicitly referenced** in `AGENTS.md` (highest)
2. **Nearest filesystem** (relative to current directory)
3. **User-specified** skill path
4. **Registry match** by tags/capabilities
5. **Fallback** to general LLM knowledge (lowest)

### Hierarchical Discovery

In monorepos or nested projects, skills are discovered hierarchically:

```
monorepo/
├── AGENTS.md              # Root-level conventions
├── project-a/
│   ├── AGENTS.md          # Project-A specific overrides
│   └── SKILL.md           # Project-A skill
├── project-b/
│   ├── SKILL.md           # Project-B skill
│   └── sub-module/
│       └── SKILL.md       # Sub-module specific skill
└── shared/
    └── skills/
        ├── lint.skill.md
        └── test.skill.md
```

The **nearest AGENTS.md takes precedence** — child directories inherit but can override parent settings.

---

## AGENTS.md and Hierarchical Skills

### AGENTS.md as Project Manifest

While `SKILL.md` defines individual skills, `AGENTS.md` serves as the **project-level manifest** that:

- Defines build commands, code style, and test requirements
- References available skills
- Sets project-wide conventions for agent behavior
- Specifies files the agent must never modify

### AGENTS.md Structure

```markdown
# Project Name

## Build Commands
- `npm run build` — production build
- `npm test` — run all tests
- `npm run lint` — check code style

## Code Style
- Use TypeScript strict mode
- PascalCase for components, camelCase for functions
- Max line length: 100 characters
- Prefix private methods with underscore

## Test Requirements
- Tests alongside source files in `__tests__/`
- Minimum 80% coverage
- Mock external APIs
- Unit tests for all new functions

## Files the Agent Must Never Modify
- `src/config/*.ts`
- `deployment/*.yaml`
- `.github/workflows/*.yml`

## Skills
- deploy: `skills/deploy.skill.md`
- audit: `skills/security-audit.skill.md`
```

### Hierarchical Inheritance

```
┌─────────────────────────────────────────────────┐
│ Root AGENTS.md                                   │
│ - Build commands (npm run build)                 │
│ - Code style (TypeScript strict)                 │
│ - Never modify: config/, deployment/             │
└──────────┬──────────────────────────────────────┘
           │ inherits
┌──────────▼──────────────────────────────────────┐
│ Project-A AGENTS.md                              │
│ - Overrides: test command (jest --coverage)      │
│ - Adds: never modify: project-a/secrets/         │
└──────────┬──────────────────────────────────────┘
           │ inherits
┌──────────▼──────────────────────────────────────┐
│ Sub-module AGENTS.md (optional)                  │
│ - Overrides: lint command (ruff check)           │
└─────────────────────────────────────────────────┘
```

### Merge Strategy

| Setting | Merge Behavior |
|---------|----------------|
| Build commands | Child replaces parent for same command name |
| Code style | Child additions merge; conflicts prefer child |
| Test requirements | Child additions merge |
| Never modify files | Union of parent + child |
| Skills | Child's list overrides parent's entirely |

---

## Research: Measurable Impact

### Princeton Study: Measuring the Impact of AGENTS.md

A Princeton research study (arXiv 2601.20404) measured the impact of `AGENTS.md` on coding agent performance with statistically significant results:

| Metric | Without AGENTS.md | With AGENTS.md | Improvement |
|--------|-------------------|----------------|-------------|
| **Runtime** | Baseline | -28.6% | **28.6% reduction** |
| **Tokens consumed** | Baseline | -16.6% | **16.6% reduction** |
| **Task completion rate** | 72.3% | 84.1% | **+11.8%** |
| **First-attempt success** | 58.1% | 71.4% | **+13.3%** |
| **User corrections needed** | 3.2 avg | 1.8 avg | **-43.8%** |

### Why Skills Reduce Token Consumption

1. **Precision over exploration**: Skills tell the agent exactly what to do, eliminating wasteful trial-and-error
2. **Command accuracy**: Exact commands replace vague instructions, reducing context spent on figuring out syntax
3. **Context efficiency**: Structured instructions are more token-efficient than prose paragraphs
4. **Reduced loops**: Clear verification criteria mean fewer "did it work?" check iterations
5. **No repeated setup**: Skills define prerequisites once, not every invocation

### Adoption Metrics (As of 2026)

- **60,000+** GitHub repositories have adopted AGENTS.md
- **20+** coding agents support the format natively
- **27,500+** stars on Vercel Labs `agent-skills` repo
- **40%** of enterprises in AI pilot programs use skills-based prompting
- Gartner predicts **60% adoption** among AI-enabled development teams by 2027

---

## Best Practices

### Design Principles

1. **Command-first, description-second**
   Include exact invocations, not narrative descriptions.
   - Good: `npm run test -- --coverage --watchAll=false`
   - Bad: "Run the tests with coverage reporting"

2. **Task-organized sections**
   Group instructions by task type: coding, review, release, debugging, etc.

3. **Closure-defined completion**
   Every skill must have explicit "done" criteria the agent can verify programmatically.

4. **Avoid prose paragraphs**
   Use bullet points, tables, and structured formats. Prose is ambiguous and harder to parse.

5. **No ambiguous directives**
   - Bad: "Be careful with the database"
   - Good: "Never run DROP TABLE or DELETE without --dry-run flag"

### Testing Skills

| Test Type | What to Verify | Frequency |
|-----------|----------------|-----------|
| Syntax check | Frontmatter parses correctly | Every change |
| Step execution | Each step can be run independently | Per PR |
| Full workflow | End-to-end skill execution | Per release |
| Cross-model | Works on target models | Weekly |
| Edge cases | Handles errors, missing deps, timeouts | Per release |

### Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|-------------|-----|
| Vague steps | Agent wastes tokens figuring out intent | Use exact commands |
| No error handling | Agent stalls on failure | Define failure modes |
| Missing prerequisites | Agent fails mid-execution | List all prerequisites explicitly |
| Prose instructions | Agent misses key details | Use structured lists |
| No verification | Agent can't confirm success | Add verification criteria |
| Tool assumptions | Agent fails on different platforms | Check environment first |

### Production Checklist

- [ ] Frontmatter is valid YAML and includes required fields
- [ ] Every step has an exact command or clear action
- [ ] Prerequisites are listed and checked
- [ ] Failure modes are documented with recovery steps
- [ ] Verification criteria are objective and machine-checkable
- [ ] Skill has been tested on all target models
- [ ] Version field is updated (semver)
- [ ] Tags accurately describe the skill's domain

---

## References and Resources

### Official Specifications
- [agents.md](https://agents.md) — Open standard specification
- OpenAI: "AGENTS.md — a simple, open format for guiding coding agents"
- Anthropic: "Claude Code Subagents and Skills" documentation

### Research
- Princeton University: "Measuring the Impact of AGENTS.md" (arXiv 2601.20404)
- ICLR 2026 Workshop on Agentic AI Systems

### Skill Repositories and Registries
- [skills.sh](https://skills.sh) — Agent Skills Directory
- Vercel Labs: `agent-skills` repo — React best practices skill (27.5k+ stars)
- GitHub Marketplace — Agent skills section

### Tools
- Claude Code — Native AGENTS.md and SKILL.md support
- OpenAI Codex — AGENTS.md compatible
- Cursor — Skills discovery via `.cursor/rules/`
- Windsurf — Agent skills in `.windsurf/`
- LangChain — Skill loader for LangGraph agents
