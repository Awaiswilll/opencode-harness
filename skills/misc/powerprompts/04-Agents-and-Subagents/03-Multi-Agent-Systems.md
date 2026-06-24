# Multi-Agent Systems

> A comprehensive reference on multi-agent collaboration patterns, communication protocols, coordination strategies, and conflict resolution — covering when and why multiple agents outperform single-agent systems.

---

## Table of Contents

1. [What Are Multi-Agent Systems](#1-what-are-multi-agent-systems)
2. [When Multi-Agent Beats Single-Agent](#2-when-multi-agent-beats-single-agent)
3. [Multi-Agent Collaboration Patterns](#3-multi-agent-collaboration-patterns)
4. [Agent Communication Protocols](#4-agent-communication-protocols)
5. [Coordination Strategies](#5-coordination-strategies)
6. [Conflict Resolution Between Agents](#6-conflict-resolution-between-agents)
7. [Multi-Agent System Prompt Architectures](#7-multi-agent-system-prompt-architectures)
8. [Example: Multi-Agent Research System](#8-example-multi-agent-research-system)
9. [Example: Multi-Agent Code Review System](#9-example-multi-agent-code-review-system)
10. [Best Practices](#10-best-practices)
11. [Resources](#11-resources)

---

## 1. What Are Multi-Agent Systems

### Definition

A **multi-agent system (MAS)** involves multiple specialized AI agents collaborating to solve tasks that are too complex, broad, or multi-faceted for a single agent. Each agent has its own:
- **System prompt** — defining its role, expertise, and behavior
- **Tool set** — restricted to what its role requires
- **Context window** — isolated from other agents
- **Decision-making logic** — how it approaches its assigned task

### Key Distinction: Multi-Agent vs. Subagent

| Aspect | Subagent Architecture (Hierarchical) | Multi-Agent System (Collaborative) |
|---|---|---|
| **Structure** | Lead agent + workers | Peer agents, sometimes with a coordinator |
| **Communication** | Lead delegates to workers | Agents communicate bidirectionally |
| **Decision-making** | Lead agent decides all | Agents negotiate, debate, vote |
| **State** | Workers are stateless | Agents may maintain state |
| **Typical topology** | Star (orchestrator-centric) | Mesh, ring, or star |

In practice, most production systems blend both patterns.

### The Spectrum of Multi-Agent Collaboration

```
Simple coordination           Tight collaboration
    │                                │
    ▼                                ▼
Centralized     Pipeline     Peer-to-peer    Debate/Consensus
Delegation      Workflow     Collaboration   Systems
(§02)           (§02/§05)                   (This section)
```

---

## 2. When Multi-Agent Beats Single-Agent

### The 90.2% Improvement Finding

Anthropic's research (2025) demonstrated that multi-agent systems outperformed single-agent systems by **90.2% on research evaluation tasks**. This is not incremental — it's transformative.

### Why Multi-Agent Systems Excel

| Factor | Single-Agent Limitation | Multi-Agent Advantage |
|---|---|---|
| **Expertise breadth** | One prompt must cover all domains | Each agent specializes deeply |
| **Context window** | One context window for everything | Each agent has its own focused context |
| **Tool surface** | All tools compete for attention | Each agent has only relevant tools |
| **Exploration strategy** | One exploration path | Multiple parallel exploration paths |
| **Self-correction** | Self-critique is limited | Agents critique each other (stronger) |
| **Confirmation bias** | Single perspective | Multiple perspectives challenge assumptions |

### When to Use Multi-Agent vs. Single-Agent

**Use single-agent when:**
- The task is well-defined and deterministic
- A single domain of expertise is required
- Speed and cost are primary concerns
- The task can be completed in 1-3 steps

**Use multi-agent when:**
- The task spans multiple domains
- Open-ended exploration is required
- Multiple perspectives are valuable
- Factual accuracy is critical (verification through redundancy)
- The task has high complexity or ambiguity

### Decision Matrix

```
Task Complexity → Low     ──────►  Single Agent
                  │
                  ▼ High
                  │
           Domain Breadth → Narrow  ──►  Single Agent + Tools
                  │
                  ▼ Broad
                  │
             Accuracy Need → Moderate ──►  Multi-Agent (2-3 agents)
                  │
                  ▼ High
                  │
           Multi-Agent (3-5 agents) with Verification
```

### Cost-Benefit Analysis

| Aspect | Single-Agent | Multi-Agent (3 agents) |
|---|---|---|
| **Token cost** | 1x baseline | 3-5x (parallel agents) |
| **Latency** | Fast | Slower (but parallelism helps) |
| **Accuracy (research tasks)** | Baseline | +90.2% (Anthropic) |
| **Error diversity** | One error mode | Independent error modes |
| **Debugging complexity** | Simple | Complex — many interaction paths |
| **Prompt engineering effort** | One prompt | Multiple prompts + protocols |

---

## 3. Multi-Agent Collaboration Patterns

### 3.1 Debate Pattern

Multiple agents with different perspectives argue for their positions, then converge on a consensus.

```
Agent A (Pro): "The evidence supports approach X because..."
Agent B (Con): "Approach X has these flaws: ... I propose Y because..."
Agent C (Synthesizer): "Both have merit. The optimal approach combines X and Y..."

Result: Synthesis of multiple viewpoints
```

**When to use:** Decisions with trade-offs, strategic planning, ethical considerations.

**Prompt structure:**
```
You are Agent {role} in a multi-agent debate.
Your position: {position}

Rules:
1. State your position with evidence
2. Listen to other agents' arguments
3. Challenge claims that lack evidence
4. Be willing to update your position
5. Aim for the best collective outcome, not to "win"
```

### 3.2 Expert Panel Pattern

Each agent is a domain expert contributing specialized knowledge to a shared problem.

```
Agent (Security): "From a security standpoint, the risks are..."
Agent (UX): "The user experience impact would be..."
Agent (Infrastructure): "The infrastructure cost implications are..."

Result: Multi-faceted analysis
```

**When to use:** Problems requiring diverse expertise, product reviews, architectural decisions.

### 3.3 Verification Pattern

One agent produces output, another agent verifies it. Can be extended to multi-stage verification.

```
Generator Agent: Produces candidate answer
Verifier Agent: Checks for errors, omissions, hallucinations
Refiner Agent: Fixes issues identified by Verifier
Final Verifier: Confirms all issues resolved
```

**When to use:** High-stakes outputs (medical, legal, financial, code).

### 3.4 Ensemble Pattern

Multiple agents independently solve the same problem, and results are compared/voted.

```
Agent A: Answer = 42 (reasoning: ...)
Agent B: Answer = 42 (reasoning: ...)
Agent C: Answer = 7  (reasoning: ...)

Final: 42 (2/3 consensus)
```

**When to use:** Factual questions, math problems, classification tasks.

**Key insight:** Independent agents make different errors. Voting cancels out random errors.

### 3.5 Specialization Pattern

Each agent has a unique capability, and they work together like a team.

```
Agent (Researcher): Finds information
Agent (Analyst): Interprets information
Agent (Writer): Formats output
Agent (Reviewer): Quality checks
```

**When to use:** Production pipelines where different skills are needed sequentially or in parallel.

### Pattern Selection Guide

| Pattern | Best For | Number of Agents | Communication |
|---|---|---|---|
| **Debate** | Trade-off decisions, strategy | 2-3 | Bidirectional, iterative |
| **Expert Panel** | Multi-faceted analysis | 3-5 | Each speaks once, synthesized |
| **Verification** | Accuracy-critical tasks | 2-4 | Sequential, handoff |
| **Ensemble** | Factual accuracy | 3-5 | Independent, then vote |
| **Specialization** | Production pipelines | 2-5 | Sequential or parallel |

---

## 4. Agent Communication Protocols

### Why Protocols Matter

In multi-agent systems, agents need to communicate results, requests, and status updates. Without a clear protocol:
- Information is lost between agents
- Agents misinterpret each other's outputs
- Debugging becomes impossible

### Protocol Types

#### 4.1 Structured Message Protocol

Each communication between agents follows a defined schema.

```json
{
  "from": "agent_name",
  "to": "agent_name",
  "type": "result | request | error | status",
  "payload": { ... },
  "metadata": {
    "timestamp": "ISO8601",
    "message_id": "uuid",
    "in_reply_to": "uuid"
  }
}
```

**Prompt instructing agents to use this protocol:**
```
When communicating with other agents, use this format:
{
  "to": "[target agent]",
  "type": "request | response | error | status_update",
  "content": "[your message]",
  "context": "[relevant context for the other agent]"
}
```

#### 4.2 Shared Blackboard Protocol

Agents read from and write to a shared knowledge base (the "blackboard").

```
┌─────────────────────────────────────────────┐
│                 BLACKBOARD                    │
│  - problem statement                         │
│  - findings so far                           │
│  - open questions                            │
│  - proposed solutions                        │
│  - verified claims                           │
└─────────────────────────────────────────────┘
      ▲            ▲            ▲
      │            │            │
  Agent A      Agent B      Agent C
```

**Prompt instructing agents to use blackboard:**
```
You share a workspace with other agents.
Write your findings to the shared blackboard.
Read the blackboard before starting work — others may have
already contributed relevant information.

Blackboard structure:
- ## Findings: What we've discovered
- ## Open Questions: What we still need to answer
- ## Proposed Solutions: Candidates under consideration
- ## Verified: Claims confirmed by multiple agents
```

#### 4.3 Direct Handoff Protocol

Agent A passes a specific task to Agent B with full context.

```
Agent A completes work → packages result with context → passes to Agent B
Agent B receives package → processes → passes to Agent C (or back)
```

**Prompt instructing agents to use handoff:**
```
When handing off to the next agent, include:
1. What was accomplished
2. Key findings or decisions made
3. What the next agent needs to do
4. Any warnings or caveats

Handoff format:
---
HANDOFF TO: [agent_name]
ACCOMPLISHED: [summary]
FINDINGS: [key_points]
NEXT STEPS: [what_to_do_next]
CAVEATS: [warnings]
---
```

### Protocol Selection Guide

| Protocol | Best For | Complexity | Fault Tolerance |
|---|---|---|---|
| **Structured Message** | Complex multi-turn conversations | High | High (retry, ack) |
| **Shared Blackboard** | Collaborative research, analysis | Medium | Medium (conflicts possible) |
| **Direct Handoff** | Linear pipelines | Low | Low (failure propagates) |

---

## 5. Coordination Strategies

### Centralized Coordination

A coordinator agent manages the workflow, assigns tasks, and handles results.

```
Coordinator → Agent A → result → Coordinator → Agent B → result → Coordinator
```

**Pros:** Simple, clear ownership, easy to debug.
**Cons:** Single point of failure, coordinator can be bottleneck.

### Decentralized Coordination

Agents coordinate directly with each other without a central authority.

```
Agent A ←→ Agent B
  ↕        ↕
Agent C ←→ Agent D
```

**Pros:** No single point of failure, scales well.
**Cons:** Complex protocols, hard to debug, can get stuck in loops.

### Hierarchical Coordination

Multiple levels of coordination (lead agents coordinating sub-teams).

```
Top Coordinator
  ├── Team A Coordinator
  │     ├── Agent A1
  │     └── Agent A2
  └── Team B Coordinator
        ├── Agent B1
        └── Agent B2
```

**Pros:** Scales to large teams, natural decomposition.
**Cons:** Latency from hierarchy, complex prompt engineering.

### Market-Based Coordination

Agents bid on tasks based on their capabilities and current load.

```
Coordinator: "Task available: 'Search for X' — who can do it?"
Agent A: "Bid: 3 tokens" (busy)
Agent B: "Bid: 1 token" (available)
Agent C: "Bid: 2 tokens" (somewhat busy)
→ Coordinator assigns to Agent B
```

**Pros:** Efficient resource allocation, load balancing.
**Cons:** Complex to implement, overhead of bidding protocol.

### Strategy Selection Guide

| Strategy | Best For | Scalability | Complexity |
|---|---|---|---|
| **Centralized** | Simple workflows, few agents | Low-Medium | Low |
| **Decentralized** | Peer collaboration, research | Medium | High |
| **Hierarchical** | Large teams, enterprise | High | Medium-High |
| **Market-Based** | Dynamic workloads | High | Very High |

---

## 6. Conflict Resolution Between Agents

### Why Conflicts Happen

- **Different information**: Agents may have retrieved different data
- **Different reasoning**: Same data, different interpretation
- **Different priorities**: What Agent A optimizes for may differ from Agent B
- **Hallucination**: One agent may be confidently wrong

### Resolution Strategies

#### 6.1 Weighted Voting

Each agent votes, with weights based on confidence or expertise.

```
Agent A: "Answer X" (confidence: 0.9, expertise: security)
Agent B: "Answer Y" (confidence: 0.6, expertise: UX)
Agent C: "Answer X" (confidence: 0.8, expertise: infrastructure)

Weighted score for X: 0.9 + 0.8 = 1.7
Weighted score for Y: 0.6
Result: X
```

**Prompt for weighted voting:**
```
When disagreeing with another agent:
1. State your position and confidence level (0-1)
2. Provide evidence for your position
3. Explain why you disagree with the alternative
4. If confidence is below 0.7, flag for human review

Resolution: The position with the highest weighted confidence wins.
Confidence should be based on: source quality, certainty of evidence,
and alignment with your expertise.
```

#### 6.2 Evidence-Based Arbitration

Agents present evidence, and a neutral arbitrator agent judges.

```
Arbitrator: "Both agents claim different answers. Agent A, what's your evidence?"
Agent A: "Source: paper X, which found that..."
Agent B: "Source: paper Y, which found that..."
Arbitrator: "Paper X is more recent and more authoritative. Result favors Agent A."
```

**Prompt for arbitrator:**
```
You are a neutral arbitrator. Your role is to resolve disagreements
between agents based on the evidence presented.

Process:
1. Hear both sides
2. Evaluate the quality of evidence each agent provides
3. Consider: source authority, recency, relevance, consistency
4. Make a ruling with justification
5. If evidence is equally balanced, flag for human review
```

#### 6.3 Escalation Protocol

If agents cannot agree, escalate to a human or to a more capable model.

```
Agent A and B disagree → they discuss (2 rounds)
→ Still disagree → escalate to Agent C (senior model)
→ Agent C resolves → if still stuck, escalate to human
```

**Prompt for escalation:**
```
Resolution Protocol:
1. Discuss disagreement with the other agent (max 2 rounds)
2. If no consensus, summarize the disagreement and escalate
3. Escalation includes:
   - Both positions and their evidence
   - What was discussed
   - What remains unresolved
   - Recommended human input needed
```

#### 6.4 Confidence-Based Agreement

If all agents have high confidence in the same answer, accept it. If low confidence or disagreement, do more research.

```
Thresholds:
- All agents confidence > 0.8 and agree → Accept
- Any agent confidence < 0.5 → Do more research
- Disagreement → Debate round → Escalate if still disagree
```

### Conflict Prevention

Better to prevent conflicts than resolve them:
- **Align prompts**: Ensure all agents have consistent instructions about factuality
- **Share evidence**: Encourage agents to cite sources
- **Define scope**: Clearly specify each agent's domain to reduce overlap
- **Prioritize sources**: Define a global source hierarchy

---

## 7. Multi-Agent System Prompt Architectures

### System Prompts for Multi-Agent Systems

Each agent in an MAS needs a prompt that covers:
1. Its own role and expertise
2. The overall system (so it understands its place)
3. Communication protocol (how to interact with peers)
4. Coordination rules (who to report to, when to escalate)

### Agent Prompt Template for MAS

```
You are {agent_name}, a {role_description} agent.

## Your Place in the System
You are part of a multi-agent system with these agents:
{list_of_other_agents}

## Your Expertise
{domain_knowledge_and_capabilities}

## Your Tools
{tool_set}

## Communication Protocol
Use the structured message format:
{
  "to": "[agent_name]",
  "type": "request | response | error | status_update",
  "content": "[message]",
  "confidence": 0-1
}

## Coordination Rules
- Report significant findings to {coordinator_agent}
- If you detect an error in another agent's output, flag it
- If you cannot complete your task, notify {coordinator_agent}
- Do NOT override other agents' decisions without discussion

## Conflict Resolution
If you disagree with another agent:
1. State your evidence
2. Listen to their evidence
3. If still disagree after 1 round, escalate to {arbitrator_agent}
```

### System Prompt for Coordinator Agent

```
You are the coordinator of a multi-agent system.

## Your Agents
{list_of_agents_with_capabilities}

## Your Responsibilities
1. Receive user requests and decompose them into sub-tasks
2. Assign sub-tasks to the most appropriate agents
3. Monitor agent progress and handle failures
4. Resolve conflicts between agents (see conflict resolution protocol)
5. Synthesize final output from all agent contributions

## Conflict Resolution Protocol
1. First, have disagreeing agents debate (1 round each)
2. If still unresolved, make a judgment based on evidence
3. If evidence is equally strong, flag for human review

## Output Format
Present the final answer with agent attributions:
[Agent: name] contributed [finding].
```

---

## 8. Example: Multi-Agent Research System

### System Configuration

```
Agents:
1. Research Planner — decomposes research question into sub-questions
2. Web Searcher (×3) — three independent search agents
3. Fact Checker — verifies claims against sources
4. Synthesis Writer — produces final report
5. Reviewer — quality checks the final report
```

### Execution Flow

```
User: "What is the current state of fusion energy research?"

1. Research Planner:
   Decomposes into sub-questions:
   - Major fusion projects and their timelines
   - Key technological breakthroughs (2024-2026)
   - Economic viability analysis
   - Remaining challenges

2. Web Searcher (3 parallel agents):
   Each covers different sub-questions independently
   Returns sources with relevance scores

3. Fact Checker:
   Cross-references all claims from searchers
   Flags unsupported claims for re-search
   Confirms verified facts

4. Synthesis Writer:
   Produces comprehensive report
   Organized by sub-question
   Cites sources properly

5. Reviewer:
   Checks for completeness and accuracy
   Ensures all sub-questions answered
   Flags any remaining issues

6. Final output delivered to user
```

### Performance Characteristics

- **Token cost**: ~5x single agent (but on research evals, accuracy improved by 90.2%)
- **Latency**: 2-3x single agent (parallel searchers mitigate some overhead)
- **Factuality**: Significantly higher (agents verify each other)
- **Coverage**: More comprehensive (multiple search paths)

---

## 9. Example: Multi-Agent Code Review System

### System Configuration

```
Agents:
1. Security Reviewer — checks for OWASP Top 10 vulnerabilities
2. Performance Reviewer — identifies performance bottlenecks
3. Style Reviewer — checks code style and conventions
4. Logic Reviewer — verifies correctness and edge cases
5. Lead Reviewer — aggregates all feedback, prioritizes issues
```

### Execution Flow

```
Developer submits PR code.

1. All four specialist reviewers analyze independently (parallel)

2. Security Reviewer:
   - Checks: injection, XSS, auth flaws, data exposure
   - Reports: 2 medium-severity findings

3. Performance Reviewer:
   - Checks: N+1 queries, memory leaks, unnecessary allocations
   - Reports: 1 high-severity finding (N+1 query in loop)

4. Style Reviewer:
   - Checks: formatting, naming, imports, documentation
   - Reports: 3 style issues

5. Logic Reviewer:
   - Checks: edge cases, error handling, race conditions
   - Reports: 1 critical bug (off-by-one in pagination)

6. Lead Reviewer:
   - Aggregates all findings
   - Prioritizes: Critical > High > Medium > Style
   - Removes duplicates
   - Produces unified review with action items
   - Assigns responsibility: "Security issues → Developer A, Performance → Developer B"
```

### Conflict Resolution in Code Review

```
If Security Reviewer and Performance Reviewer conflict:
- Security says: "Validate input in every request handler"
- Performance says: "Batch validations for efficiency"

Lead Reviewer resolves:
"Implement per-request validation for security-critical fields.
Batch validation for non-critical fields. Document the trade-off."
```

---

## 10. Best Practices

### System Design

- **Start with 2-3 agents** — more agents means more complexity, communication overhead, and debugging difficulty
- **Define clear interfaces** — agent boundaries should be explicit and well-documented
- **Isolate agent contexts** — each agent should only see information relevant to its task
- **Design for failure** — agent A should be able to function even if agent B is down
- **Use timeouts** — any agent that doesn't respond within N seconds is considered failed

### Prompt Engineering

- **Each agent needs its own specialized prompt** — reuse is a mistake (leads to role confusion)
- **Include system context** — each agent should understand its place in the larger system
- **Define communication format** explicitly — don't leave it to chance
- **Set confidence thresholds** — agents should know when to flag uncertainty
- **Test agents independently** before testing interactions

### Production Considerations

- **Log all inter-agent messages** — this is your primary debugging tool
- **Trace end-to-end** — each user request should have a trace ID that follows it through all agents
- **Monitor agent health** — track per-agent success rates, latency, and error types
- **Set cost budgets** — multi-agent systems can be expensive; cap total tokens per request
- **Human-in-the-loop for critical decisions** — some disagreements need human judgment

### Common Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| No communication protocol | Agents produce output in incompatible formats | Define structured handoff schemas |
| Redundant work | Multiple agents searching the same thing | Share state via blackboard |
| Infinite debate | Agents go back and forth without resolution | Set max debate rounds + escalation |
| Context overload | System prompt + instructions exceed context window | Keep agent prompts focused and summarized |
| Cascade failure | One agent's failure causes all agents to fail | Independent execution with fallback |
| Role confusion | Agents overlap in responsibilities | Clear scope boundaries in each prompt |

---

## 11. Resources

### Papers
- Li et al.: "CAMEL: Communicative Agents for 'Mind' Exploration of Large Language Models" (2023)
- Park et al.: "Generative Agents: Interactive Simulacra of Human Behavior" (2023)
- Wu et al.: "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation" (2023)

### Official Documentation
- OpenAI: "Multi-Agent Systems" in Agents SDK docs
- Microsoft: "AutoGen" multi-agent framework documentation
- LangChain: "Multi-Agent Architectures" guide

### Guides and Articles
- Anthropic: "How we built our multi-agent research system" (2025)
- LangChain: "Choosing the Right Multi-Agent Architecture" (2026)
- VMware: "Understanding Multi-Agent Systems in AI" (2026)

### Related Topics in This Knowledge Base
- **Section 01** — AI Agent Architecture (foundational concepts)
- **Section 02** — Subagent Architectures (hierarchical patterns)
- **Section 04** — Tool-Use Prompting (tools agents use)
- **Section 05** — Prompt Chaining (pipeline patterns)
