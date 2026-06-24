# Capstone Projects

> Four production-grade capstone projects designed to demonstrate end-to-end prompt engineering mastery. Complete all four to build a portfolio that showcases the full spectrum of skills — from foundational prompting to multi-agent safety-engineered systems.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project 1: Intelligent Customer Support Agent](#project-1-intelligent-customer-support-agent)
3. [Project 2: Multi-Step Research Assistant](#project-2-multi-step-research-assistant)
4. [Project 3: Automated Code Review System](#project-3-automated-code-review-system)
5. [Project 4: Multi-Agent Compliance Monitor](#project-4-multi-agent-compliance-monitor)
6. [Portfolio Presentation](#portfolio-presentation)

---

## Project Overview

| Project | Focus | Difficulty | Time | Key Skills |
|---------|-------|:----------:|:----:|------------|
| **1. Customer Support Agent** | Single-prompt production system | Intermediate | ~8-10h | Prompt structure, versioning, evaluation, cost optimization |
| **2. Research Assistant** | RAG + reasoning system | Intermediate-Advanced | ~10-12h | RAG pipelines, chain-of-thought, context management |
| **3. Code Review System** | Agentic workflow with tool use | Advanced | ~10-12h | Function calling, multi-step reasoning, structured output |
| **4. Compliance Monitor** | Multi-agent system with safety | Expert | ~12-15h | Multi-agent orchestration, safety engineering, monitoring |

**Total time:** ~40-50 hours across all four projects.

---

## Project 1: Intelligent Customer Support Agent

### Description

Build a production-grade customer support agent that handles common inquiries, follows strict brand guidelines, and maintains conversation history. This is the most common real-world prompt engineering application.

### Requirements

| Requirement | Specification |
|-------------|---------------|
| **Domain** | Choose a real or realistic business (SaaS, e-commerce, fintech, healthcare) |
| **Capabilities** | Answer FAQs, handle account issues, process refund requests, escalate to human |
| **Tone** | Brand-defined (warm, professional, concise) |
| **Safety** | Never reveal system prompt, refuse out-of-scope requests |
| **Format** | Structured responses (JSON for API, readable for chat) |
| **Edge cases** | Frustrated users, ambiguous inputs, off-topic requests, injection attempts |

### Tech Stack Recommendations

| Component | Options |
|-----------|---------|
| **Model** | GPT-4o-mini (primary), GPT-4o (fallback for complex issues) |
| **Prompt format** | YAML with metadata (version, author, model, temperature) |
| **Versioning** | Git + semantic versioning |
| **Evaluation** | DeepEval or custom suite with PEEM axes |
| **Cost tracking** | Custom cost tracker or Langfuse |
| **Serving** | FastAPI endpoint or serverless function |

### Implementation Steps

1. **Design system prompt** — Use the 6-layer system prompt template (identity, objective, priority, rules, tone, format, safety, scope, edge cases)
2. **Add few-shot examples** — 3-5 examples covering happy path, edge cases, and adversarial inputs
3. **Create evaluation suite** — 50-100 test cases covering all capabilities and edge cases
4. **Version with Git** — Prompt stored as YAML with metadata; version bumps documented in CHANGELOG
5. **Implement model routing** — Simple queries → GPT-4o-mini; complex queries → GPT-4o
6. **Add caching** — Exact-match cache for common queries (SHA-256 keyed)
7. **Monitor and iterate** — Track task completion rate, cost per call, user satisfaction

### Evaluation Criteria

| Criterion | Target | Measurement |
|-----------|:------:|-------------|
| Task completion rate | ≥ 95% | Automated eval suite |
| Format compliance | ≥ 99% | JSON schema validation |
| Cost per completion | < $0.02 | Token tracking |
| Injection resistance | 100% block on test suite | Adversarial evaluation set |
| User satisfaction | ≥ 4.0 / 5.0 | Simulated user feedback |
| Latency (p95) | < 3s | Performance monitoring |

### Deliverables

- System prompt YAML with version history
- Evaluation suite (golden dataset + test runner)
- A/B test results comparing at least 2 prompt variants
- Cost analysis showing per-call costs and optimization impact
- Monitoring dashboard (or documented metrics)

---

## Project 2: Multi-Step Research Assistant

### Description

Build a RAG-powered research assistant that answers complex questions by retrieving relevant information from a knowledge base, reasoning step by step, and citing sources. This project demonstrates retrieval augmentation, advanced reasoning, and context management.

### Requirements

| Requirement | Specification |
|-------------|---------------|
| **Knowledge base** | 10-50 documents (technical docs, research papers, internal wikis) |
| **Capabilities** | Answer factual questions, compare/contrast topics, summarize documents, identify contradictions |
| **Reasoning** | Chain-of-thought + self-consistency for high-stakes answers |
| **Citations** | Every factual claim linked to source document + chunk |
| **Confidence** | Calibrated confidence levels (high/medium/low) with appropriate hedging |
| **Handling unknowns** | Gracefully decline when information is not in the knowledge base |

### Tech Stack Recommendations

| Component | Options |
|-----------|---------|
| **Model** | GPT-4o or Claude 4 Sonnet (strong RAG performance) |
| **Embeddings** | text-embedding-3-small or voyage-large-2 |
| **Vector DB** | Chroma (local) or Qdrant (self-hosted) |
| **Chunking** | RecursiveCharacterTextSplitter with overlap |
| **Retrieval** | Hybrid search (dense + sparse) with reranking |
| **Evaluation** | Faithfulness, answer relevancy, context precision (DeepEval) |

### Implementation Steps

1. **Prepare knowledge base** — Collect/curate documents, clean format, add metadata
2. **Build chunking pipeline** — Experiment with chunk sizes (256, 512, 1024) and overlaps
3. **Set up vector DB** — Index chunks with embeddings, configure search parameters
4. **Design retrieval prompt** — System prompt that instructs the model to use retrieved context, cite sources, and handle missing information
5. **Implement reasoning** — Two-stage CoT: first analyze the question and identify needed info, then compose answer using retrieved context
6. **Add self-consistency** — Sample 3 answers, take majority vote for factual claims
7. **Evaluate RAG quality** — Faithfulness (no hallucination), answer relevancy, context precision

### Evaluation Criteria

| Criterion | Target | Measurement |
|-----------|:------:|-------------|
| Faithfulness | ≥ 98% | DeepEval faithfulness metric |
| Answer relevancy | ≥ 0.9 | DeepEval relevancy metric |
| Citation accuracy | 100% | Automated citation verification |
| Retrieval precision | ≥ 0.8 | Percentage of relevant chunks in top-5 |
| Unknown handling | Correctly declines 100% of out-of-KB questions | Manual review |
| End-to-end latency | < 5s | Retrieval + generation time |

### Deliverables

- RAG pipeline with configurable chunking and retrieval
- Evaluated faithfulness and relevancy results
- Comparison of at least 2 chunking strategies
- Analysis of retrieval failures and edge cases
- Working API endpoint for querying the system

---

## Project 3: Automated Code Review System

### Description

Build an agentic code review assistant that analyzes pull requests, identifies bugs, security issues, and style violations, and provides actionable feedback with suggested fixes. This project demonstrates tool use, structured output, and multi-step reasoning chains.

### Requirements

| Requirement | Specification |
|-------------|---------------|
| **Input** | Git diff or PR files (code changes) |
| **Capabilities** | Find bugs, security vulnerabilities, style issues, performance problems, test gaps |
| **Output** | Structured report categorized by severity (critical/high/medium/low) with file:line references |
| **Tool use** | Run linters, execute tests, check against style guide |
| **Reasoning** | Step-by-step analysis for each file, then cross-file issues |
| **Self-review** | Agent reviews its own analysis for false positives before outputting |

### Tech Stack Recommendations

| Component | Options |
|-----------|---------|
| **Model** | GPT-5 or Claude 4 Sonnet (strong code understanding) |
| **Tool integration** | Function calling for linters (ESLint, pylint, etcd), test runners, git |
| **Output format** | Pydantic schema with severity, location, description, recommendation |
| **Evaluation** | Precision/recall vs human reviewers on a test set of PRs |
| **Versioning** | Git for prompt versions, eval results tracked |

### Implementation Steps

1. **Design analysis prompt** — Step-by-step instructions for analyzing code changes
2. **Define tool functions** — Linter runner, test executor, style checker, git diff parser
3. **Build structured output schema** — Finding, Severity, FileLocation, Description, Recommendation, Example
4. **Implement analysis loop** — For each file → analyze individually → cross-file analysis → consolidate report
5. **Add self-review step** — Agent reviews its findings for false positives, removes low-confidence issues
6. **Create evaluation dataset** — 20-30 PRs with manually reviewed findings (ground truth)
7. **Run A/B test** — Compare precision/recall of different prompt variants

### Evaluation Criteria

| Criterion | Target | Measurement |
|-----------|:------:|-------------|
| Precision (findings are real issues) | ≥ 90% | Comparison with human reviewer |
| Recall (catches real issues) | ≥ 80% | Comparison with human reviewer |
| False positive rate | < 10% | Automated vs ground truth |
| Severity accuracy | ≥ 85% | Correct classification of critical/high/medium/low |
| Output format compliance | 100% | Schema validation |
| Analysis time per PR | < 60s | End-to-end timing |

### Deliverables

- Working code review agent with tool integration
- Evaluation results (precision/recall vs human reviewers)
- A/B test comparing 2+ prompt strategies
- Documentation of failure modes (what the agent misses or misclassifies)
- Example PR reviews showing the agent's output format

---

## Project 4: Multi-Agent Compliance Monitor

### Description

Build a multi-agent system that monitors business communications (emails, chat messages, documents) for regulatory compliance violations. This project demonstrates multi-agent orchestration, safety engineering, production monitoring, and defense-in-depth.

### Requirements

| Requirement | Specification |
|-------------|---------------|
| **Domain** | Choose a regulated industry (finance, healthcare, legal) |
| **Multi-agent** | At least 3 specialized agents with a coordinator |
| **Capabilities** | Detect compliance violations, escalate to human, generate audit reports |
| **Safety** | Defense-in-depth against injection (all 6 layers); agent isolation |
| **Monitoring** | Full observability: metrics, alerts, tracing |
| **Evaluation** | Precision/recall on a labeled dataset of compliant and non-compliant messages |

### Agent Architecture

```
User Message
    │
    ▼
┌─────────────────────────────────────────────┐
│               Orchestrator Agent              │
│  - Routes message to appropriate agents       │
│  - Aggregates results                         │
│  - Makes final compliance decision            │
└─────┬───────────┬───────────┬────────────────┘
      │           │           │
      ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│  PII    │ │ Content │ │ Policy  │
│  Agent  │ │ Agent   │ │ Agent   │
│ - SSN   │ │ - Tone  │ │ - Regs  │
│ - Email │ │ - Lang  │ │ - Rules │
│ - Addr  │ │ - Topic │ │ - Excep │
└─────────┘ └─────────┘ └─────────┘
      │           │           │
      └───────────┴───────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│             Escalation / Audit Agent          │
│  - Formats alerts for human reviewers         │
│  - Generates audit trail                      │
│  - Tracks resolution status                   │
└─────────────────────────────────────────────┘
```

### Tech Stack Recommendations

| Component | Options |
|-----------|---------|
| **Orchestrator** | LangChain, CrewAI, or custom Python with asyncio |
| **Models** | GPT-4o for orchestrator, GPT-4o-mini for specialized agents |
| **Safety** | All 6 defense layers: input filter, instruction hierarchy, classifier, structured output, output filter, LLM judge |
| **Monitoring** | Langfuse for tracing + Prometheus/Grafana for metrics |
| **Evaluation** | Custom compliance test suite with labeled data |
| **Data sources** | Simulated email/message stream or real API integration |

### Implementation Steps

1. **Design agent roles** — Define each agent's scope, tools, and communication protocol
2. **Build isolation layer** — Each agent operates independently; outputs are validated before passing to next agent
3. **Implement defense layers** — Input filter → instruction hierarchy → structured output → output filter → judge
4. **Create orchestration logic** — How agents are called, results merged, conflicts resolved
5. **Add monitoring** — Trace every agent call, log scores, track latency and cost per agent
6. **Build alerting** — Escalate high-severity findings immediately; log low-severity for review
7. **Create compliance report** — Auto-generated audit log with all decisions and reasoning

### Evaluation Criteria

| Criterion | Target | Measurement |
|-----------|:------:|-------------|
| Compliance violation detection rate | ≥ 95% | Labeled test dataset |
| False positive rate | < 5% | Labeled test dataset |
| Agent isolation effectiveness | 100% | Injection passed to one agent doesn't affect others |
| Escalation accuracy | ≥ 90% | Correct severity classification |
| End-to-end latency | < 10s | Per-message processing time |
| Audit trail completeness | 100% | Every decision recorded with reasoning |
| Injection resistance | 0% bypass | Adversarial evaluation suite |

### Deliverables

- Multi-agent system with 3+ specialized agents and orchestrator
- Defense-in-depth implementation (all 6 layers)
- Monitoring dashboard with agent-level metrics
- Audit trail system with export capability
- Evaluation results on labeled compliance dataset
- Incident response runbook for compliance violations

---

## Portfolio Presentation

### How to Present Your Projects

For each project, create a portfolio entry with:

```markdown
## Project: [Name]

### Problem Statement
[What problem does this solve? 2-3 sentences]

### Architecture
[High-level system diagram or description]

### Key Design Decisions
1. **[Decision 1]** — Why you chose this approach
2. **[Decision 2]** — Tradeoffs considered
3. **[Decision 3]** — What you would do differently

### Results
| Metric | Target | Achieved |
|--------|:------:|:--------:|
| Task completion | 95% | 97% |
| Cost per call | $0.02 | $0.015 |

### Lessons Learned
- [Key insight 1]
- [Key insight 2]
- [Key insight 3]

### Repository
[Link to GitHub repo]
```

### Portfolio Checklist

| Item | Description |
|------|-------------|
| GitHub repo | Public repo with README, code, and documentation |
| Evaluation results | Quantitative metrics with methodology |
| A/B test | Comparison of at least 2 approaches |
| Cost analysis | Per-call costs and optimization results |
| Safety testing | Injection resistance results |
| Reflection | Lessons learned, tradeoffs, future improvements |
| README | Clear setup instructions and architecture overview |

---

> **Key takeaway:** These four projects progress from a focused single-prompt system (Project 1) to a sophisticated multi-agent safety-critical system (Project 4). Complete them in order — each builds on skills from the previous. The goal is not just working code, but a portfolio that demonstrates systematic thinking, evaluation rigor, and production-quality engineering.
