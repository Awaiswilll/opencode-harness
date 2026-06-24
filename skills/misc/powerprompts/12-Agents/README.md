# 12 Professional Domain Agents for opencode

> World-class AI agents specialized in 12 prompt engineering domains.
> Designed for integration with the [opencode](https://opencode.ai) agent system.

These agents are registered as **subagents** in the opencode configuration
at `~/.config/opencode/agents/` and can be invoked by primary agents
(such as the `software-house-coordinator`) using the Task tool.

---

## Agent Roster

| # | Agent | Domain | Color | File |
|---|-------|--------|-------|------|
| 1 | **Advertising Expert** | Ad copy, campaign strategy, visual design, market research | `#E63946` | [advertising-expert.md](advertising-expert.md) |
| 2 | **Content Creation Expert** | Blogs, articles, video, podcasts, SEO, newsletters, strategy | `#2A9D8F` | [content-creation-expert.md](content-creation-expert.md) |
| 3 | **Copywriting Expert** | Headlines, sales copy, direct response, email, landing pages | `#F4A261` | [copywriting-expert.md](copywriting-expert.md) |
| 4 | **Creative Writing Expert** | Fiction, poetry, creative nonfiction, screenwriting, storytelling | `#9B5DE5` | [creative-writing-expert.md](creative-writing-expert.md) |
| 5 | **E-Commerce Expert** | Store setup, product sourcing, payments, shipping, marketing | `#E76F51` | [ecommerce-expert.md](ecommerce-expert.md) |
| 6 | **Editing & Proofreading Expert** | Grammar, style guides, structural editing, proofreading | `#264653` | [editing-proofreading-expert.md](editing-proofreading-expert.md) |
| 7 | **Goal Setting Expert** | SMART goals, OKRs, habit formation, productivity, planning | `#2D6A4F` | [goal-setting-expert.md](goal-setting-expert.md) |
| 8 | **Graphic Design Expert** | Design principles, typography, color theory, AI image generation | `#7209B7` | [graphic-design-expert.md](graphic-design-expert.md) |
| 9 | **Personal Finance Expert** | Budgeting, investing, retirement, debt, insurance, tax planning | `#0077B6` | [personal-finance-expert.md](personal-finance-expert.md) |
| 10 | **Personal Growth Expert** | Mindset, EQ, communication, habits, time management, mindfulness | `#40916C` | [personal-growth-expert.md](personal-growth-expert.md) |
| 11 | **Persuasion & Influence Expert** | Cialdini principles, rhetoric, negotiation, ethical influence | `#D62828` | [persuasion-influence-expert.md](persuasion-influence-expert.md) |
| 12 | **Social Media Expert** | Platform strategy, content calendars, community, analytics, paid | `#8338EC` | [social-media-expert.md](social-media-expert.md) |

---

## How They Work

Each agent is a **subagent** (mode: `subagent`) in the opencode system.
Primary agents, like the **Software House Coordinator**, can delegate
domain-specific tasks to any of these experts using the Task tool.

### Example Delegation Flow

1. User asks for help with a Facebook ad campaign
2. The primary agent identifies the domain → calls **Advertising Expert**
3. Advertising Expert generates reusable `[Placeholder]` prompt templates
4. User copies the prompt template and uses it with any LLM

### Agent File Format

Each agent follows the opencode specification:
```markdown
---
description: >-
  When to use this agent
mode: subagent
color: "#HEXCODE"
---

[Expert system instructions...]
```

---

## Integration with Prompt Library

These agents are designed to work alongside the
[11-Prompt-Library](../11-Prompt-Library/) chapters. Each agent references
its corresponding domain chapter in the prompt library for template
patterns and best practices. Together they form a complete
prompt engineering ecosystem:

- **11-Prompt-Library**: The raw prompt template collection (1000+ templates)
- **12-Agents**: Intelligent agents that know how to create and use those templates

---

## Installation

These agents are pre-installed in your opencode configuration at:
```
~/.config/opencode/agents/
```

They are auto-discovered by opencode and available for delegation
by any primary agent.

To add them to a different opencode installation, copy the `.md` files
to the target's `~/.config/opencode/agents/` directory.

---

*Part of the Powerpromtpts ecosystem — 1000+ Prompts for ChatGPT by Arnold Issac*
