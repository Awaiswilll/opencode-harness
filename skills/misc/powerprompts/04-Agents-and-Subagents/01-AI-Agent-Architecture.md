# AI Agent Architecture

> A comprehensive reference on designing, building, and prompting AI agents — covering the fundamental patterns, the agent loop, persistence, tool use, multi-step reasoning, and production prompt structures.

---

## Table of Contents

1. [What Makes an AI Agent](#1-what-makes-an-ai-agent)
2. [The Agent Loop](#2-the-agent-loop)
3. [5 Core Agentic Patterns](#3-5-core-agentic-patterns)
4. [Persistence and State Management](#4-persistence-and-state-management)
5. [Tool Use in Agents](#5-tool-use-in-agents)
6. [Multi-Step Reasoning](#6-multi-step-reasoning)
7. [Prompt Structure for Agents](#7-prompt-structure-for-agents)
8. [Production Agent Prompt Template](#8-production-agent-prompt-template)
9. [Best Practices](#9-best-practices)
10. [Resources](#10-resources)

---

## 1. What Makes an AI Agent

### Definition

An **AI agent** is an LLM-powered system that reasons about tasks, makes decisions, and takes actions — including calling external tools, APIs, and databases — operating in a continuous loop: observe → think → act → observe result → think again.

### Agent vs. Chatbot: Three Distinguishing Properties

| Property | Chatbot | Agent |
|---|---|---|
| **Persistence** | Single-turn or stateless; no memory across calls | Runs across minutes/hours across dozens of LLM calls; maintains state |
| **Tool use** | Produces text only | Produces actions (file edits, API calls, browser use, database queries) |
| **Multi-step reasoning** | Linear response generation | Plans, executes, observes, and adjusts autonomously |

A chatbot answers a question. An agent **executes a mission**.

### Industry Context

- Gartner predicts 40% of enterprise applications will embed AI agents by end of 2026
- Every major LLM provider now offers agent SDKs: OpenAI Agents SDK, Anthropic Claude Code + MCP, Google ADK, LangGraph
- The shift from "prompt engineering" to "agent engineering" is the dominant trend in 2026

### When to Use an Agent vs. a Chatbot

**Use a chatbot when:**
- The task is a single Q&A or generation
- No external data or actions are needed
- The interaction is ephemeral

**Use an agent when:**
- The task requires multiple steps coordinated together
- External tools, APIs, or data sources must be consulted
- The system needs to adapt its plan based on intermediate results
- The task runs over an extended period (minutes to hours)

---

## 2. The Agent Loop

The agent loop is the fundamental execution model that distinguishes agents from simpler LLM calls.

### The Core Cycle

```
┌─────────────────────────────────────────────────┐
│                  OBSERVE                          │
│   (Receive input, tool results, environment)      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                   THINK                           │
│   (Reason about current state, plan next action)  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                   ACT                             │
│   (Execute tool call, produce output, decide)     │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│               OBSERVE RESULT                      │
│   (Incorporate tool output back into context)      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
            ┌──────────────┐
            │  Continue?   │───No───► [Final Answer]
            └──────────────┘
                   │ Yes
                   ▼
               [Repeat cycle]
```

### Detailed Walkthrough

**Step 1 — Observe:**
The agent receives the user's request and any available context (conversation history, retrieved documents, previous tool results).

**Step 2 — Think:**
The agent reasons about the current state:
- What is the goal?
- What information do I have?
- What information am I missing?
- What tool should I use next?
- What sub-problem should I solve?

**Step 3 — Act:**
The agent produces an action — either an internal action (reasoning step) or an external action (tool call):
- `Thought:` internal reasoning
- `Action:` tool_name(arguments)
- `Final Answer:` final synthesized response

**Step 4 — Observe Result:**
The system runtime executes the tool and feeds the result back as an `Observation:`. The agent incorporates this into its context.

**Step 5 — Loop or Terminate:**
The agent either continues the cycle or outputs its final answer.

### Implementation in Code

```python
def agent_loop(system_prompt, user_query, tools, max_steps=20):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_query}
    ]

    for step in range(max_steps):
        response = llm_call(messages)

        if response.contains("Final Answer:"):
            return extract_final_answer(response)

        if response.contains("Action:"):
            action = parse_action(response)
            result = execute_tool(action, tools)
            messages.append({"role": "assistant", "content": response})
            messages.append({"role": "tool", "content": result})

    return "Max steps exceeded — returning partial result."
```

---

## 3. 5 Core Agentic Patterns

The Journal of AI (2026) identifies five fundamental agentic patterns that form the building blocks of all agent architectures.

### 3.1 Tool Use Pattern

The agent selects and calls tools from a defined set. Tools can be APIs, search engines, code interpreters, file systems, databases, or browser actions.

**When to use:** Any task requiring external data, computation, or side effects.

**Key design decisions:**
- Tool selection criteria — when to use which tool
- Argument format — how the agent specifies tool parameters
- Return value handling — how results feed back into reasoning

```python
tools = [
    {"name": "search", "description": "Web search", "parameters": {"query": "string"}},
    {"name": "calculator", "description": "Math evaluation", "parameters": {"expression": "string"}},
]
```

### 3.2 Reflection Pattern

The agent critiques its own outputs before finalizing. This is a self-verification step that catches errors and improves quality.

**When to use:** High-stakes outputs where correctness is critical (code, legal documents, medical advice).

**Prompt pattern:**
```
Generate your answer. Then review it for:
1. Factual accuracy — are all claims supported?
2. Completeness — does it fully address the question?
3. Consistency — are there internal contradictions?
4. Safety — could anything be misinterpreted?

Revise based on your review.
```

**Research finding:** Reflection alone improves correctness by 12-18% across benchmark tasks.

### 3.3 ReAct Pattern (Reasoning + Acting)

Interleaves chain-of-thought reasoning with tool use in a single loop. The agent cycles through: Thought → Action → Observation → Thought → ... → Final Answer.

**When to use:** Tasks requiring both reasoning and external information gathering.

**Key characteristic:** Every reasoning step is grounded in real observations, collapsing the hallucination surface.

**Detailed in Section 08 of this knowledge base.**

### 3.4 Planning Pattern

The agent decomposes tasks into sub-plans before executing. Planning can be:
- **Linear**: Step-by-step predetermined plan
- **Hierarchical**: Plan with sub-plans and dependencies
- **Dynamic**: Plan that adapts based on intermediate results

**When to use:** Complex, multi-step tasks where ordering matters.

**Prompt pattern:**
```
Before executing, create a plan:
1. Break the task into subtasks
2. Order them by dependency
3. For each subtask, specify:
   - What tool/information is needed
   - Expected output
   - Success criteria
4. Execute the plan, adapting if needed
```

### 3.5 Multi-Agent Collaboration Pattern

Multiple agents coordinate to solve a task. Typically organized in an orchestrator-worker topology (see Section 02 - Subagent Architectures).

**When to use:** Open-ended exploration, tasks requiring diverse expertise, high-complexity problems.

**Key research finding:** Multi-agent outperformed single-agent by 90.2% on research evals (Anthropic, 2025).

---

## 4. Persistence and State Management

### What Persistence Means for Agents

Unlike chatbots that operate in a stateless request-response cycle, agents maintain state across multiple LLM calls. This includes:

- **Conversation history**: Previous turns in the current session
- **Tool call history**: What tools were called and what they returned
- **Accumulated context**: Documents retrieved, files read, data computed
- **Task progress**: Where the agent is in its plan

### State Management Strategies

| Strategy | Description | Trade-off |
|---|---|---|
| **Full context** | Keep all messages in context window | Hits token limits; costly for long sessions |
| **Sliding window** | Keep last N turns; summarize older ones | Loses detail from early turns |
| **Summarization** | Periodically summarize conversation history | Loses nuance; summary quality matters |
| **Structured state** | Maintain a separate state object (JSON) that the agent reads/writes | Complex to implement; most reliable |

### Structured State Example

```json
{
  "task": "Research quantum computing cryptography impact",
  "progress": {
    "phase": "gathering",
    "subtopics_covered": ["Shor's algorithm", "post-quantum crypto"],
    "remaining": ["QKD", "NIST standards"]
  },
  "findings": [
    {"topic": "Shor's algorithm", "summary": "...", "sources": ["url1"]}
  ],
  "tool_call_count": 7,
  "errors_encountered": 0
}
```

---

## 5. Tool Use in Agents

### How Tool Use Works

1. The system prompt defines available tools with their signatures
2. The agent decides which tool to call based on its reasoning
3. The agent emits a structured tool call (e.g., `Action: search("quantum computing")`)
4. The runtime intercepts the tool call, executes it, and returns the result
5. The result is injected back into the agent's context as an observation
6. The agent continues reasoning with the new information

### Tool Definition Format

```
Tool: search(query: string) → list of {title, url, snippet}
Tool: calculator(expression: string) → number
Tool: read_file(path: string) → string
Tool: execute_code(language: string, code: string) → {stdout, stderr}
Tool: database_query(sql: string) → list of rows
Tool: send_email(to: string, subject: string, body: string) → status
```

### Tool Selection Principles

- **Principle of least privilege**: Give agents only the tools they need
- **Clear descriptions**: Each tool needs a clear description so the agent knows when to use it
- **Error states**: Tools should return structured errors, not crash
- **Rate limiting**: Instruct agents to avoid hammering APIs

### See Also

Full coverage of tool use prompting is in **Section 04 - Tool-Use Prompting** of this knowledge base.

---

## 6. Multi-Step Reasoning

### Why Multi-Step Reasoning Matters

Single-step LLM calls have no opportunity to correct course. If the first answer is wrong, the model doesn't know it. Multi-step reasoning allows:

1. **Decomposition**: Break complex problems into simpler sub-problems
2. **Verification**: Check intermediate results before proceeding
3. **Adaptation**: Change approach when intermediate results indicate a problem
4. **Composition**: Combine findings from multiple reasoning paths

### Reasoning Strategies

**Linear Chaining:**
```
Step 1: Understand the problem
Step 2: Gather needed information
Step 3: Analyze information
Step 4: Form conclusion
Step 5: Verify conclusion
```

**Breadth-First (Tree-like):**
```
Explore multiple hypotheses simultaneously
Evaluate each against evidence
Prune weak hypotheses
Deepen exploration on promising hypotheses
```

**Depth-First (Refinement):**
```
Generate initial answer
Identify weaknesses
Refine specific parts
Repeat until satisfactory
```

### Example: Multi-Step Research Reasoning

```
Thought: I need to understand the impact of quantum computing on cryptography.
This breaks into three sub-questions:
1. What quantum algorithms threaten current crypto?
2. What is post-quantum cryptography?
3. What is the timeline for quantum threat?

Let me start with sub-question 1.
Action: search("Shor's algorithm impact RSA encryption")
Observation: [search results...]

Thought: RSA and ECC are vulnerable to Shor's algorithm.
Now let me check which other algorithms are at risk.
Action: search("quantum algorithms cryptography threat")
...
```

---

## 7. Prompt Structure for Agents

### The Agent System Prompt Template

```
You are an AI agent with the following capabilities:

## Tools
{tool_definitions}

## Goal
{high_level_objective}

## Process
{step_by_step_process_description}

## Constraints
- {boundary_1}
- {boundary_2}
- What NOT to do: {negative_constraints}

## Decision Criteria
{how_to_choose_between_tools_or_actions}

## Error Handling
{what_to_do_when_tools_fail}

## Stopping Condition
{when_to_return_final_answer}
```

### Key Differences from Chatbot Prompts

| Aspect | Chatbot Prompt | Agent Prompt |
|---|---|---|
| **Goal** | Answer the question | Complete a mission autonomously |
| **Tools** | None or implied | Explicit tool definitions with signatures |
| **Process** | Optional | Required — defines the loop |
| **Error handling** | "Say you don't know" | "Try alternative approach, then fail gracefully" |
| **Stopping condition** | After one response | After task completion or max steps |
| **State awareness** | None | Must track own progress |

### Example: Research Agent Prompt

```
You are a research agent with these tools:
- search(query) → web search results
- read(url) → page content
- summarize(text) → condensed summary

Goal: Investigate the impact of quantum computing on cryptography.
Process: For each major topic, search → read → summarize.
When you have covered 3+ distinct subtopics, synthesize findings.

Constraints:
- Never fabricate sources
- If search returns nothing, note it explicitly
- Limit search to reputable sources (.edu, .org, peer-reviewed)

Return a structured report with sections:
- Overview
- Key Findings
- Sources (with URLs)
```

---

## 8. Production Agent Prompt Template

### Full Template with All Sections

```
# IDENTITY
You are an AI agent operating in a production environment.
Your purpose: {one_sentence_mission_statement}

# AVAILABLE TOOLS
{tool_definitions}

# MISSION
{detailed_objective}

# EXECUTION PROTOCOL
You operate in the following loop:
1. **Assess**: What is my current state? What do I know? What am I missing?
2. **Plan**: What should I do next? Which tool should I call?
3. **Act**: Execute the tool call or produce output
4. **Observe**: Incorporate the result
5. **Repeat** or **Finalize**

# DECISION FRAMEWORK
When choosing between tools:
- If you need information → use search or read
- If you need computation → use calculator or execute_code
- If you have enough information → synthesize and respond

# ERROR HANDLING
- If a tool call fails → retry once, then try alternative approach
- If all approaches fail → state what you couldn't determine
- If the user asks something outside your scope → explain your limitations

# STOPPING CONDITIONS
- All required information gathered and synthesized
- Maximum of {N} tool calls reached
- User explicitly cancels
- Irresolvable error encountered

# OUTPUT FORMAT
{structure_specification}

# HARD CONSTRAINTS
These are NOT suggestions — they are hard rules:
- Never {prohibited_action_1}
- Never {prohibited_action_2}
- Always {mandatory_action}
```

---

## 9. Best Practices

### Prompt Design

- **Define explicit stopping conditions** — agents don't ask for clarification; they need clear termination criteria
- **Anticipate failure states** — tools fail, searches return nothing, APIs time out
- **Use "never" rules** as hard constraints alongside positive instructions
- **Be specific about tool selection** — ambiguous tool descriptions lead to incorrect choices
- **Place critical instructions first** — agents pay most attention to the first ~500 words

### Architecture Decisions

- **Prefer single-agent** for deterministic tasks with clear success criteria
- **Prefer multi-agent** for open-ended exploration and research tasks (90.2% improvement per Anthropic)
- **Start simple** — add complexity (subagents, reflection, planning) only when needed
- **Log everything** — agent behavior is harder to debug than single LLM calls

### Production Considerations

- **Rate limiting**: Instruct agents to add delays between API calls
- **Token budgeting**: Allocate context window budget across system prompt, history, and tool results
- **Observability**: Log every Thought/Action/Observation cycle for debugging
- **Human-in-the-loop**: For critical actions (deployments, financial transactions), require human approval
- **Version control**: Agent prompts evolve; track changes in your prompt repository

### Common Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| No stopping condition | Agent runs forever consuming tokens | Add explicit termination criteria |
| Vague tool descriptions | Agent uses wrong tool | Describe exactly when to use each tool |
| No error handling | Agent crashes or halts on first failure | Define fallback behavior for each tool |
| Overloaded prompt | Agent ignores mid-prompt instructions | Keep core rules in first 500 words |
| Missing context budget | Tools fill context window; agent loses state | Implement summarization or sliding window |

---

## 10. Resources

### Papers
- Yao et al.: "ReAct: Synergizing Reasoning and Acting in Language Models" (arXiv:2210.03629)
- Wei et al.: "Chain-of-Thought Prompting Elicits Reasoning" (NeurIPS 2022)
- Wang et al.: "Self-Consistency Improves Chain of Thought Reasoning" (ICLR 2023)

### Official Documentation
- OpenAI: "Agents SDK" and "Function Calling" documentation
- Anthropic: "Building Effective Agents" (2024) and "Claude Code" documentation
- Google: "Agent Development Kit (ADK)"

### Guides and Articles
- LangChain: "Choosing the Right Agent Architecture" (2026)
- SurePrompts: "AI Agents Prompting Guide" (2026)
- dev.to: "The Complete Guide to AI Agent Architectures" (L. Fryer, 2026)
- Anthropic: "How we built our multi-agent research system" (2025)

### Tools and Frameworks
- OpenAI Agents SDK
- Anthropic Claude Code
- LangChain / LangGraph
- Google ADK (Agent Development Kit)
- CrewAI
- AutoGen (Microsoft)
