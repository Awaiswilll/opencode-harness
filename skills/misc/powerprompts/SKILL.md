---
name: powerprompts
description: >-
  Comprehensive prompt engineering knowledge base — foundations, frameworks,
  techniques, agent architectures, subagent patterns, skills systems, templates,
  and production best practices. Includes 12 domain-specific primary agents
  (advertising, copywriting, content creation, creative writing, e-commerce,
  editing, goal setting, graphic design, personal finance, personal growth,
  persuasion, social media).
version: 1.0.0
tags:
  - prompt-engineering
  - agents
  - subagents
  - frameworks
  - system-prompts
  - security
  - production
  - templates
---

# Powerprompts — Prompt Engineering Knowledge Base

A comprehensive, curated collection of prompt engineering resources, frameworks, techniques, agent architectures, subagent patterns, skills systems, and production best practices.

## Sections

### 01-Foundations
Core prompt engineering concepts: How LLMs work, anatomy of a prompt, shot learning paradigms, output formats, best practices.

### 02-Frameworks
Prompt engineering frameworks: COSTAR, CRISPE, RISEN, CLEAR, and 15+ additional frameworks with examples.

### 03-Techniques
Advanced techniques: Chain-of-Thought, Tree-of-Thought, ReAct, Meta-Prompting, Self-Consistency, Self-Refine, Contrastive Prompting, Generated Knowledge, Least-to-Most, Step-Back Prompting.

### 04-Agents-and-Subagents
AI agent architectures, multi-agent orchestration, subagent delegation topologies, tool-use prompting with MCP, prompt chaining, memory-augmented prompting.

### 05-Skills-and-Instructions
Skills-based prompting (SKILL.md/AGENTS.md), AGENTS.md open standard specification, system prompt engineering, persona-based prompting, recursive self-improvement.

### 06-Security-and-Safety
Prompt injection defense (6-layer framework), OWASP LLM Top 10, instruction hierarchy, context segregation, red teaming tools, incident response playbook.

### 07-Production
Prompt versioning, CI/CD pipelines, A/B testing, evaluation frameworks (PEEM), cost optimization, model routing, monitoring and observability.

### 08-Learning-Path
8-stage roadmap from beginner to pro, free/paid courses, recommended reading, career timeline, hands-on capstone projects.

### 09-Repo-Scanner-Results
Top 20 prompt engineering GitHub repositories curated by category (Guides, Tools, Libraries).

### 10-Templates
Ready-to-use templates: perfect prompt template, production system prompts, agent system prompts, subagent templates, framework templates, evaluation templates, SKILL.md template.

### 11-Prompt-Library
1000+ ready-to-use fill-in-the-blank prompt templates across 12 domains (advertising, content creation, copywriting, creative writing, e-commerce, editing, goal setting, graphic design, personal finance, personal growth, persuasion, social media).

### 12-Agents
13 OpenCode primary agents (auto-discovered from `~/.config/opencode/agents/`):
- software-house-coordinator — Coordinates full-stack development projects
- advertising-expert — Ad copy, campaign strategy, creative briefs
- content-creation-expert — Blogs, video, podcasts, SEO, newsletters
- copywriting-expert — Headlines, sales copy, email, landing pages
- creative-writing-expert — Fiction, poetry, screenwriting, storytelling
- ecommerce-expert — Store setup, product sourcing, marketing
- editing-proofreading-expert — Grammar, style guides, structural editing
- goal-setting-expert — SMART goals, OKRs, habit formation, productivity
- graphic-design-expert — Design principles, typography, AI image generation
- personal-finance-expert — Budgeting, investing, retirement, tax planning
- personal-growth-expert — Mindset, EQ, communication, time management
- persuasion-influence-expert — Cialdini principles, negotiation, rhetoric
- social-media-expert — Platform strategy, content calendars, analytics

## Usage

Reference this skill when the user needs:
- Prompt engineering guidance (frameworks, techniques, best practices)
- Agent/subagent architecture design
- System prompt engineering patterns
- Production prompt management (versioning, testing, monitoring)
- Security best practices for LLM applications
- Domain-specific prompt templates and agent configurations

Invoke the 13 primary agents by name via `@agent-name` in OpenCode.
