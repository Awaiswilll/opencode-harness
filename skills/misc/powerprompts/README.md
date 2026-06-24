# Powerpromtpts 🚀

**Your Ultimate Prompt Engineering Knowledge Base — From Basics to Advanced Professional Level**

A comprehensive, curated collection of prompt engineering resources, frameworks, techniques, agent architectures, subagent patterns, skills systems, and production best practices. Built by scanning the top GitHub repositories and synthesizing the latest research (2026).

---

## Repository Structure

```
Powerpromtpts/
├── 01-Foundations/          # Core prompt engineering concepts
├── 02-Frameworks/           # Prompt engineering frameworks (COSTAR, CRISPE, etc.)
├── 03-Techniques/           # Advanced techniques (CoT, ToT, ReAct, etc.)
├── 04-Agents-and-Subagents/ # Agent architectures & delegation patterns
├── 05-Skills-and-Instructions/ # Skills-based prompting, AGENTS.md, SKILL.md
├── 06-Security-and-Safety/  # Prompt injection defense, red teaming
├── 07-Production/           # CI/CD, versioning, monitoring, cost optimization
├── 08-Learning-Path/        # Structured curriculum from beginner to pro
├── 09-Repo-Scanner-Results/ # Top GitHub repos for prompt engineering
├── 10-Templates/            # Ready-to-use prompt templates
├── 11-Prompt-Library/       # 1000+ ChatGPT prompts library (12 domains)
├── 12-Agents/               # 12 professional domain agents for opencode
└── dependencies/            # Related tools, papers, references
```

---

## Quick Start

| If you're... | Start with... |
|--------------|---------------|
| **Complete beginner** | `08-Learning-Path/` → foundational concepts |
| **Intermediate practitioner** | `02-Frameworks/` + `03-Techniques/` |
| **Building agents** | `04-Agents-and-Subagents/` + `05-Skills-and-Instructions/` |
| **Production engineer** | `06-Security-and-Safety/` + `07-Production/` |
| **Looking for templates** | `10-Templates/` for ready-to-use prompts |
| **Need ready-made prompts** | `11-Prompt-Library/` with 1000+ fill-in templates |
| **Running opencode** | `12-Agents/` — 12 domain-specific primary agents (`@agent-name`) |
| **Researching best repos** | `09-Repo-Scanner-Results/` |

---

## What's Inside

### 📚 Foundations (01)
- How LLMs work: tokens, context windows, temperature, sampling
- Anatomy of a prompt: roles, instructions, constraints, format
- Zero-shot vs few-shot vs many-shot learning

### 🏗️ Frameworks (02)
- **COSTAR**: Context, Objective, Style, Tone, Audience, Response
- **CRISPE**: Capacity, Role, Insight, Statement, Personality, Experiment
- **RISEN**: Role, Instructions, Steps, End Goal, Narrowing
- **CLEAR**: Concise, Logical, Explicit, Adaptive, Reflective
- 15+ additional frameworks with examples

### ⚡ Advanced Techniques (03)
- Chain-of-Thought (CoT) & Tree-of-Thought (ToT)
- ReAct (Reasoning + Acting)
- Self-Consistency & Self-Refine
- Meta-Prompting & Recursive Self-Improvement
- Contrastive Prompting & Generated Knowledge
- Least-to-Most & Step-Back Prompting

### 🤖 Agents & Subagents (04)
- AI Agent architectures and patterns
- Multi-agent orchestration strategies
- Subagent delegation topologies
- Lead-agent / worker-agent patterns
- Tool-use prompting with MCP (Model Context Protocol)

### 🛠️ Skills & Instructions (05)
- Skills-based prompting (SKILL.md / AGENTS.md)
- AGENTS.md open standard specification
- Reusable skill packages
- Agent capability manifests

### 🔒 Security & Safety (06)
- Prompt injection defense (6-layer framework)
- OWASP LLM Top 10
- Instruction hierarchy & context segregation
- Red teaming tools and methodologies
- Incident response playbook

### 🏭 Production (07)
- Prompt versioning & lifecycle management
- CI/CD pipelines for prompts
- A/B testing methodology
- Evaluation frameworks (PEEM)
- Cost optimization & model routing
- Monitoring & observability

### 🎓 Learning Path (08)
- 8-stage roadmap (0-Orientation through Capstone)
- Free and paid courses
- Recommended reading
- Career timeline
- Hands-on projects

### 🔍 Repo Scanner Results (09)
- Top 20 prompt engineering GitHub repositories
- Curated by category (Guides, Tools, Libraries, etc.)
- Stars, descriptions, key features

### 📝 Templates (10)
- Production system prompt templates
- Agent system prompts
- Framework-specific templates
- Evaluation and test prompt templates

### 🤖 Domain Agents (12)
- **12 professional opencode primary agents** for domain-specific prompt engineering
- Advertising, Content Creation, Copywriting, Creative Writing, E-Commerce
- Editing & Proofreading, Goal Setting, Graphic Design, Personal Finance
- Personal Growth, Persuasion & Influence, Social Media Management
- Each agent: expert system prompt + domain knowledge + prompt library references
- **Locations:**
  - `~/.config/opencode/agents/` — auto-discovered by opencode (`@agent-name`)
  - `C:\Users\awais\OneDrive\Documents\dev\` — working dev copy
  - `12-Agents/` — this repo (version-controlled backup)

### 📖 Prompt Library (11)
- **1000+ ready-to-use prompt templates** from the book by Arnold Issac
- 12 domain-specific chapters with fill-in-the-blank templates
- **Advertising**: Ad copy, design, social media ads, strategy, analytics
- **Content Creation**: Writing, video, audio, SEO, content marketing
- **Copywriting**: Headlines, direct response, web copy, email, sales
- **Creative Writing**: Fiction, poetry, screenwriting, creative nonfiction
- **E-Commerce**: Store design, product sourcing, payments, shipping
- **Editing & Proofreading**: Grammar, style guides, proofreading techniques
- **Goal Setting**: SMART goals, long-term/short-term planning, visualization
- **Graphic Design**: Typography, color theory, logo design, print/digital
- **Personal Finance**: Budgeting, investing, retirement, insurance, taxes
- **Personal Growth**: Time management, emotional intelligence, communication
- **Persuasion & Influence**: Negotiation, leadership influence, ethics
- **Social Media**: Platform strategy, content calendars, analytics, ads

---

## Sources

This repository synthesizes knowledge from:
- **Top GitHub repos**: dair-ai/Prompt-Engineering-Guide, f/prompts.chat, stanfordnlp/dspy, langgptai/LangGPT, microsoft/promptflow, and 15+ more
- **Academic papers**: Wei et al. (CoT), Yao et al. (ReAct, ToT), Wang et al. (Self-Consistency)
- **Official documentation**: OpenAI, Anthropic, Google, IBM
- **Industry frameworks**: PECollective, Stochastic Sandbox, FutureCraft
- **Security standards**: OWASP LLM Top 10, NIST AI RMF

---

## License

MIT — Free to use, modify, and share.

---

> *"Prompt engineering is the new programming paradigm. This repo is your power toolkit."*
