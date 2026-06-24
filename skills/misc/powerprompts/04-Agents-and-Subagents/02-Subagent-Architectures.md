# Subagent Architectures

> A comprehensive reference on orchestrator-worker patterns, hierarchical agent design, delegation topologies, handoff protocols, context isolation strategies, and production deployment patterns for subagent-based systems.

---

## Table of Contents

1. [What Is Subagent Architecture](#1-what-is-subagent-architecture)
2. [Core Design Principles](#2-core-design-principles)
3. [Three Common Topologies](#3-three-common-topologies)
4. [Lead Agent Prompt Template](#4-lead-agent-prompt-template)
5. [Subagent Prompt Template](#5-subagent-prompt-template)
6. [Handoff Protocols](#6-handoff-protocols)
7. [Context Isolation Strategies](#7-context-isolation-strategies)
8. [Example: 3-Stage Software Pipeline](#8-example-3-stage-software-pipeline)
9. [Example: Multi-Agent Research System](#9-example-multi-agent-research-system)
10. [Advanced Patterns](#10-advanced-patterns)
11. [Best Practices](#11-best-practices)
12. [Resources](#12-resources)

---

## 1. What Is Subagent Architecture

### Definition

**Subagent architecture** (also known as orchestrator-worker, "Russian doll", or hierarchical pattern) splits an AI system into:

- **A lead agent (orchestrator)**: Decomposes complex tasks, delegates to specialized workers, and synthesizes results
- **Specialized subagents (workers)**: Each with its own system prompt, tool permissions, and isolated context window

### Why Subagents?

| Concern | Single Agent | Subagent Architecture |
|---|---|---|
| **Context pollution** | Everything in one context | Each subagent has isolated context |
| **Tool conflicts** | All tools available at once | Each subagent gets only relevant tools |
| **Prompt complexity** | One massive prompt | Focused, specialized prompts per subagent |
| **Failure isolation** | One failure breaks everything | Subagents fail independently |
| **Parallelism** | Sequential only | Subagents can run in parallel |
| **Observability** | Hard to trace reasoning | Each subagent's work is logged separately |

### The "Russian Doll" Metaphor

Microsoft's guidance describes subagent architecture as a "Russian doll" — nested agents where each level has isolated context, tools, and responsibilities. The outer doll (lead agent) sees the big picture; inner dolls (subagents) focus on specific sub-tasks.

### Industry Adoption

- Anthropic Claude Code uses `.claude/agents/` directory for subagent definitions
- OpenAI Agents SDK supports agent-as-tool pattern for subdelegation
- LangGraph supports hierarchical agent graphs
- Production systems at major tech companies use subagent architectures for complex workflows

---

## 2. Core Design Principles

### Task Decomposition

The lead agent breaks complex requests into well-defined subtasks. Effective decomposition requires:

- **Granularity**: Subtasks should be small enough for a focused subagent but large enough to justify the delegation overhead
- **Dependency clarity**: Which subtasks depend on others? What order must they execute in?
- **Interface definition**: What are the inputs and expected outputs for each subtask?

### Parallel Execution

Subagents can work simultaneously with separate context windows. This provides:

- **Speed**: Parallel execution reduces wall-clock time
- **Isolation**: Each subagent's exploration trajectory is independent
- **Diversity**: Different subagents can explore different approaches simultaneously

### Context Isolation

Subagent work details don't pollute the lead agent's context. Benefits:

- **Token efficiency**: The lead agent only sees summaries, not raw subagent work
- **Focus**: Each subagent only sees information relevant to its task
- **Security**: Subagents can be compartmentalized with different data access levels

### Separation of Concerns

Each subagent has:
- **Distinct tools**: Only the tools needed for its specific domain
- **Distinct prompts**: System prompt tailored to its specific role
- **Distinct constraints**: Limitations specific to its role
- **Distinct evaluation criteria**: How its output is judged

### Principle of Least Privilege

Every subagent should have:
- The minimum tools needed to perform its task
- Access only to the data it needs
- No ability to access other subagents' context
- Clear scope boundaries

---

## 3. Three Common Topologies

### 3.1 Centralized Orchestration (Subagents Pattern)

**Structure:**
```
                  ┌─────────────────┐
                  │  Lead Agent     │
                  │  (Orchestrator) │
                  └────────┬────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ Subagent A │  │ Subagent B │  │ Subagent C │
    │ (search)   │  │ (analyze)  │  │ (write)    │
    └────────────┘  └────────────┘  └────────────┘
```

**Key characteristics:**
- Supervisor agent coordinates specialized subagents called as tools
- Main agent maintains conversation context
- Subagents remain stateless — they execute, return results, and are done
- Best for: Clear division of labor, roles are well-understood

**Implementation pattern:**
- Subagents are registered as tools in the lead agent's tool list
- Each subagent tool has a name, description, input schema, and output schema
- The lead agent decides when and how to invoke each subagent

### 3.2 Pipeline Topology

**Structure:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Step 1   │────►│ Step 2   │────►│ Step 3   │────►│ Step 4   │
│ Subagent │     │ Subagent │     │ Subagent │     │ Subagent │
│  (Plan)  │     │ (Design) │     │  (Code)  │     │(Review)  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

**Key characteristics:**
- Subagents execute sequentially, passing results downstream
- Each stage receives the output of the previous stage
- Validation gates between stages can catch errors early
- Best for: Linear workflows with clear dependencies

**Implementation pattern:**
- The output of subagent N is passed as input to subagent N+1
- Each subagent has its own prompt tailored to its stage
- Validation at each boundary ensures data quality

### 3.3 Fan-Out Topology

**Structure:**
```
                    ┌─────────────────┐
                    │  Lead Agent     │
                    │  (Orchestrator) │
                    └────────┬────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼
      ┌────────────┐ ┌────────────┐ ┌────────────┐
      │ Subagent A │ │ Subagent B │ │ Subagent C │
      │ (persp 1)  │ │ (persp 2)  │ │ (persp 3)  │
      └────────────┘ └────────────┘ └────────────┘
             │               │               │
             └───────────────┼───────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Aggregator    │
                    │(Synthesizer)    │
                    └─────────────────┘
```

**Key characteristics:**
- Lead agent spawns parallel subagents, then aggregates results
- All subagents run simultaneously (for speed) or with staggered starts
- Aggregation can be a separate subagent or done by the lead agent
- Best for: Exploration tasks, multiple perspectives, parallel research

**Implementation pattern:**
- Lead agent defines the scope for each parallel subagent
- Subagents run independently (can be parallelized)
- Lead agent receives all results and synthesizes

### Topology Selection Guide

| Scenario | Recommended Topology | Why |
|---|---|---|
| Roles are distinct and well-understood | Centralized Orchestration | Clear delegation boundaries |
| Workflow is linear and sequential | Pipeline | Natural stage-by-stage progression |
| Need multiple perspectives or exploration | Fan-Out | Exploit parallelism |
| Combination of all three | Hybrid | Real systems often mix topologies |

---

## 4. Lead Agent Prompt Template

### Full Template

```
You are the orchestrator agent. Your role is to manage a team of
specialized subagents to complete the user's request.

## Your Responsibilities
1. **Decompose** the user request into clear, independent subtasks
2. **Assign** each subtask to the appropriate subagent
3. **Provide context** — give each subagent the information it needs
4. **Synthesize** results into a coherent final answer
5. **Handle errors** — if a subagent fails, decide whether to retry or adapt

## Available Subagents

{subagent_specifications}

Each subagent expects input in the format specified above and
returns output in the format specified above.

## Your Process

For each user request:
1. **Analyze** the request to understand what's needed
2. **Plan** which subagents to invoke and in what order
3. **Invoke** subagents one at a time (or in parallel if independent)
4. **Review** each subagent's output before proceeding
5. **Adapt** your plan if subagent outputs reveal new information
6. **Synthesize** all results into the final response

## Delegation Rules

- Use the simplest subagent that can handle the subtask
- Provide sufficient context but don't overshare (avoid context pollution)
- If a subagent's output is unsatisfactory, be specific about what to fix
- If you cannot complete the task with available subagents, explain why

## Output Format

Present your final answer as a synthesis of all subagent findings.
Cite which subagent contributed which part: [Agent: name]

## Constraints

- Do not bypass subagents — always delegate specialized work
- Do not fabricate subagent results — only report what subagents produced
- If a subagent fails after 2 retries, proceed without it and note the gap
```

### Lead Agent Example: Research Orchestrator

```
You are a research orchestrator managing three specialists:
- search_agent: Web search and source discovery
- analyst_agent: Information analysis and synthesis
- writer_agent: Report generation and formatting

User requests a research report. Your process:
1. Use search_agent to gather sources on 3+ subtopics
2. Use analyst_agent to analyze and extract key findings
3. Use writer_agent to produce the final formatted report
4. Review the report for quality before delivering to the user
```

---

## 5. Subagent Prompt Template

### Full Template

```
You are a specialized {role} agent.

## Your Scope
Your scope is limited to: {specific_domain_or_task}
You do NOT need to consider the full problem — only your assigned task.

## Tools Available
{tools_restricted_set}

## Input You Will Receive
{input_schema_or_description}

## Your Task
{task_description}

## Output Format
Return your results in exactly this format:
{schema}

## Constraints
- Do not use tools outside your permitted set
- Do not attempt to solve problems outside your scope
- Return results in the specified format only
- If you cannot complete your task, explain why

## Guidance
- Focus only on what you were asked to do
- Do not add extra analysis or recommendations unless asked
- Be thorough within your scope, but concise in your output
```

### Subagent Example: Search Specialist

```
You are a web search specialist agent.

## Your Scope
Your scope is: Searching the web for information on specific topics.
You do NOT need to analyze, synthesize, or format — just find and return sources.

## Tools Available
- search(query) → search results
- fetch_page(url) → full page text

## Your Task
Search for information on: {topic}
Find at least 3 authoritative sources.
For each source, return: title, URL, 2-3 sentence summary of key points.

## Output Format
```json
{
  "sources": [
    {
      "title": "string",
      "url": "string",
      "summary": "string",
      "relevance_score": 1-10
    }
  ],
  "search_queries_used": ["string"],
  "failed_queries": ["string"]
}
```

## Constraints
- Prefer .edu, .org, and peer-reviewed sources
- Exclude low-quality sources (blogspam, SEO-optimized content)
- Return empty array if no quality sources found
```

---

## 6. Handoff Protocols

### What Is a Handoff Protocol?

A handoff protocol defines how information is passed between agents in a subagent system. It answers:
- What format does the receiving agent expect?
- What context should be included?
- What metadata should accompany the data?
- How does the receiving agent signal completion?

### Key Protocol Elements

| Element | Description | Example |
|---|---|---|
| **Payload format** | The data structure passed between agents | JSON schema, structured text |
| **Metadata** | Context about the handoff | Source agent, timestamp, version |
| **Validation** | How to verify the payload is valid | Schema validation, required fields |
| **Error signaling** | How to communicate failures | Error codes, retry requests |
| **Completion signal** | How the receiving agent signals done | Status field, callback |

### Protocol Template

```
## Handoff Protocol

### Incoming Payload
{expected_format_with_schema}

### Outgoing Payload
{expected_output_format}

### Validation Rules
- {rule_1}: Input must contain {field}
- {rule_2}: Output must contain {field}

### Error Codes
- ERR_INCOMPLETE: Missing required fields
- ERR_INVALID: Fields fail validation
- ERR_SCOPE: Task is outside agent scope
```

### Handoff Example: Pipeline Between PM and Architect

```json
// PM Agent → Architect Agent handoff
{
  "handoff": {
    "from": "pm-spec-agent",
    "to": "architect-agent",
    "timestamp": "2026-06-03T10:30:00Z",
    "status": "READY_FOR_ARCH"
  },
  "payload": {
    "feature_name": "Two-factor authentication",
    "spec_document": "# 2FA Feature Specification\n\n## Requirements\n...",
    "priority": "high",
    "dependencies": ["auth-service"],
    "acceptance_criteria": [
      "User can enable 2FA from settings",
      "Supports TOTP and SMS",
      "Backup codes generated on setup"
    ]
  }
}
```

---

## 7. Context Isolation Strategies

### Why Context Isolation Matters

Without context isolation:
- The lead agent's context window fills with subagent details
- Subagents see information irrelevant to their task
- Security boundaries are blurred
- Debugging becomes difficult

### Isolation Strategies

| Strategy | Description | Implementation |
|---|---|---|
| **Stateless subagents** | Subagents don't remember past interactions | Each call is a fresh invocation with full context |
| **Summarized results** | Subagent outputs are summarized before returning to lead agent | Lead sees only key findings, not raw work |
| **Separate sessions** | Each subagent runs in its own session/context | No cross-subagent context leakage |
| **Scoped tools** | Each subagent has its own restricted tool set | Tools are assigned per subagent definition |

### Stateless Subagent Pattern

```
You are a stateless subagent. You do not remember previous calls.
Each invocation is independent.

You will receive:
- All the context you need for this task
- Clear instructions on what to produce

Do not:
- Assume you've been called before
- Reference information from earlier invocations
- Maintain state between calls
```

### Summarization Pattern for Context Preservation

```
## Context Preservation Protocol

When the lead agent receives results from a subagent,
it should summarize them before storing in its context:

### Subagent Result Summary Template
- Agent: [name]
- Task: [what was requested]
- Key finding: [one-line summary]
- Key data points: [up to 3]
- Next steps: [what this implies]
- Raw result: [attached but not inline]

This summary prevents context pollution while preserving
access to full details if needed.
```

---

## 8. Example: 3-Stage Software Pipeline

### Overview

A complete software development pipeline using three specialized subagents in sequence.

### Stage 1: Product Spec Agent

```
You are a Product Spec agent.

## Your Role
Read enhancement requests and feature descriptions, then write
detailed product specifications.

## Tools
- read_file(path): Read existing documentation
- search_codebase(query): Find relevant existing code

## Input
Feature request: {feature_request}
Existing codebase context: {context}

## Output Format
Output a spec document with:
- Problem statement
- Proposed solution
- User-facing changes
- Technical requirements
- Acceptance criteria
- Edge cases

## Status
At the top of your output, include one of:
- READY_FOR_ARCH: Spec is complete and clear
- NEEDS_CLARIFICATION: More information needed from stakeholders
```

### Stage 2: Architecture Agent

```
You are an Architecture agent.

## Your Role
Review product specs and design implementation plans.

## Tools
- read_file(path): Read existing code
- list_directory(path): Explore project structure

## Input
Product spec: {spec_from_stage_1}

## Output Format
Output an architecture.md with:
- Component tree (affected and new components)
- Data flow diagram (text-based)
- Technology decisions with rationale
- File change list (new files, modified files, deleted files)
- Migration plan (if breaking changes)
- Testing strategy

## Constraints
- Follow existing project patterns
- Prefer minimal changes to achieve the goal
- Consider backward compatibility
```

### Stage 3: Implementer Agent

```
You are an Implementer agent.

## Your Role
Write code per the architecture plan. Run tests. Fix failures.

## Tools
- read_file(path): Read files
- write_file(path, content): Write files
- execute_command(command): Run tests, linters
- search_codebase(query): Find relevant code

## Input
Architecture plan: {architecture_from_stage_2}

## Output Format
- All code changes implemented
- Tests passing
- Output summary:
  - Files created
  - Files modified
  - Test results (passing/failing count)
  - Any deviations from the architecture plan (with rationale)

## Constraints
- Follow the architecture plan — do not deviate without documenting why
- Write tests for all new code
- Run linter and fix issues
- If tests fail, fix until they pass (max 3 attempts)
```

### Pipeline Orchestration

```
User: "Add dark mode support to the application"

Lead Agent analyzes and plans:
1. pm-spec: "Write spec for dark mode feature"
2. architect: "Review spec, design implementation"
3. implementer: "Write code per architecture plan"

--- Stage 1 ---
pm-spec receives: "Add dark mode support"
pm-spec produces: READY_FOR_ARCH + spec document

--- Stage 2 ---
architect receives: spec document
architect produces: architecture.md with CSS variables,
  ThemeProvider component, color tokens

--- Stage 3 ---
implementer receives: architecture.md
implementer produces: code changes + passing tests + summary
```

---

## 9. Example: Multi-Agent Research System

### System Architecture

```
┌────────────────────────────────────────────────────────┐
│                 Research Orchestrator                   │
│  Role: Decompose query, delegate, synthesize            │
│  Prompt: Research lead agent template                   │
└──┬──────────────┬──────────────┬───────────────────────┘
   │              │              │
   ▼              ▼              ▼
┌────────┐  ┌────────────┐  ┌──────────┐
│Search  │  │ Analyst    │  │ Writer   │
│Agent   │  │ Agent      │  │ Agent    │
├────────┤  ├────────────┤  ├──────────┤
│Tools:  │  │Tools:      │  │Tools:    │
│•search │  │•extract    │  │•format   │
│•fetch  │  │  _facts    │  │•cite    │
│•summa- │  │•compare    │  │•proofread│
│ rize   │  │•synthesize │  │          │
└────────┘  └────────────┘  └──────────┘
```

### Execution Flow

```
User: "What are the latest advances in quantum error correction?"

1. Orchestrator decomposes:
   - Search for recent papers (Search Agent)
   - Analyze key techniques (Analyst Agent)
   - Write formatted report (Writer Agent)

2. Orchestrator invokes Search Agent:
   - Searches: "quantum error correction advances 2026"
   - Searches: "surface code improvements recent"
   - Returns: 5 sources with summaries

3. Orchestrator invokes Analyst Agent:
   - Input: Sources from Search Agent
   - Identifies: 3 main approaches (surface code, bosonic codes,
     LDPC codes)
   - Returns: Structured analysis with key findings per approach

4. Orchestrator invokes Writer Agent:
   - Input: Analyst's findings
   - Produces: Formatted report with sections, citations
   - Returns: Final report

5. Orchestrator reviews and delivers:
   - Checks for completeness
   - Delivers to user with agent attributions
```

---

## 10. Advanced Patterns

### Recursive Subdelegation

Subagents can themselves be orchestrators. This creates a deeply hierarchical system.

```
Lead Agent
  └── Subagent A (orchestrator)
        ├── Subagent A1 (worker)
        ├── Subagent A2 (worker)
        └── Subagent A3 (worker)
  └── Subagent B (worker)
  └── Subagent C (orchestrator)
        └── Subagent C1 (worker)
```

**When to use:** Extremely complex tasks with natural hierarchical decomposition.

**Risk:** Deep nesting increases latency and complexity. Keep to 2-3 levels max.

### Dynamic Subagent Creation

The lead agent creates subagents on-the-fly based on task requirements, rather than having a fixed set.

**Implementation:**
- Lead agent has a "create_agent" tool
- It specifies: role, tools, prompt, expected output
- The runtime creates a new agent instance
- The agent executes and returns results

**When to use:** Unpredictable tasks where the required subagents are not known in advance.

### Voting and Consensus

Multiple subagents independently solve the same problem, and their results are compared.

```
Subagent A: "The answer is X"
Subagent B: "The answer is Y"
Subagent C: "The answer is X"

Consensus: X (2/3 agreement)
```

**When to use:** High-stakes decisions where accuracy is critical.

**Risk:** Expensive (N redundant calls). Use for verification, not all tasks.

### Error Recovery with Fallback Subagents

If a primary subagent fails, a fallback subagent with different tools or approach takes over.

```
Primary: "I cannot complete this task due to API rate limits"
Fallback: "Let me try using cached results and an alternative API"
```

---

## 11. Best Practices

### Design

- **Subagents should be stateless** — they don't remember past interactions
- **Each subagent needs explicit tool restrictions** — principle of least privilege
- **Always define a handoff protocol** — what format does the next agent expect?
- **Use subagent summaries** to preserve context in the lead agent without pollution
- **Keep subagent prompts focused** — one job per subagent
- **Name subagents descriptively** — the name should indicate their role

### Prompting

- **Lead agent prompt** should focus on decomposition and delegation skills
- **Subagent prompt** should focus only on the specific task
- **Include input/output schemas** in subagent prompts for reliable handoffs
- **Test subagents independently** before integrating into the orchestration

### Production

- **Log all handoffs** — record what was passed between agents (for debugging)
- **Monitor failure rates** per subagent — a failing subagent indicates a prompt or tool issue
- **Set timeouts** per subagent execution to prevent runaway agents
- **Version subagent prompts** — treat them as code
- **Start with 2-3 subagents** — more than 5 is usually too many
- **Profile bottlenecks** — which subagent takes the most time? Can it be parallelized?

### Common Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Over-delegation | Lead agent decomposes too finely; overhead exceeds benefit | Each subagent should do meaningful work |
| Context starvation | Subagent lacks context to do its job | Provide sufficient background in the handoff |
| Context pollution | Lead agent's context fills with subagent details | Use summaries, not raw subagent output |
| Brittle handoffs | Pipelines break on format mismatches | Use validated schemas between stages |
| Orphan agents | Subagents that never complete | Set explicit timeouts and completion criteria |

---

## 12. Resources

### Official Documentation
- Anthropic: "Claude Code Subagents" documentation
- OpenAI: "Agents SDK — Agent as Tool" pattern
- Microsoft Learn: "Orchestrator and Subagent Multi-Agent Patterns"

### Guides and Articles
- LangChain: "Subagents: Centralized Orchestration" (2026)
- PubNub: "Best Practices for Claude Code Subagents" (2025)
- Anthropic: "How we built our multi-agent research system" (2025)

### Related Topics in This Knowledge Base
- **Section 01** — AI Agent Architecture (foundational concepts)
- **Section 03** — Multi-Agent Systems (collaboration patterns)
- **Section 05** — Prompt Chaining (pipeline patterns)
