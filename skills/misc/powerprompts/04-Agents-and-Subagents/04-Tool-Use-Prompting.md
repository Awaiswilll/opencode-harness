# Tool-Use Prompting

> A comprehensive reference on designing prompts that enable LLMs to invoke external tools — covering the Model Context Protocol (MCP), tool definition formats, system prompts, error handling, security, and production patterns.

---

## Table of Contents

1. [What Is Tool-Use Prompting](#1-what-is-tool-use-prompting)
2. [Model Context Protocol (MCP)](#2-model-context-protocol-mcp)
3. [Tool Definition Format](#3-tool-definition-format)
4. [System Prompt for Tool-Use](#4-system-prompt-for-tool-use)
5. [Research Agent with Tools](#5-research-agent-with-tools)
6. [Tool Selection and Routing Patterns](#6-tool-selection-and-routing-patterns)
7. [Error Handling and Fallback Patterns](#7-error-handling-and-fallback-patterns)
8. [Security Considerations](#8-security-considerations)
9. [Advanced Tool-Use Patterns](#9-advanced-tool-use-patterns)
10. [Best Practices](#10-best-practices)
11. [Resources](#11-resources)

---

## 1. What Is Tool-Use Prompting

### Definition

**Tool-use prompting** instructs LLMs to invoke external tools (APIs, search engines, code interpreters, databases, file systems, browser actions) as part of their reasoning process. The model emits structured tool calls; the runtime executes them and feeds results back as observations.

### The Core Mechanism

```
┌─────────────────────────────────────────────────┐
│                   LLM Model                       │
│  "I need to search for information..."            │
│  Action: search("latest AI news")                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                 Runtime/Orchestrator               │
│  1. Parse "Action: search(...)"                   │
│  2. Execute search API                            │
│  3. Return result as "Observation: ..."           │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                   LLM Model                       │
│  "Now I have search results. Let me analyze..."   │
└─────────────────────────────────────────────────┘
```

### Why Tool Use Matters

- **Grounds LLM responses in reality** — reduces hallucination by replacing speculation with facts
- **Extends capabilities** — beyond text generation to computation, data access, and real-world actions
- **Enables autonomous agents** — without tools, agents can only think; with tools, they can do
- **Foundation of all agentic systems** — every agent pattern (ReAct, Planning, Multi-Agent) depends on tool use

### Tool Use vs. Function Calling

| Provider | Term | Mechanism |
|---|---|---|
| OpenAI | Function Calling / Structured Outputs | Native API with JSON Schema |
| Anthropic | Tool Use | Tool definitions in API, MCP |
| Google | Tool Use / Function Calling | Tool definitions in API |
| Open/Standard | MCP (Model Context Protocol) | Standardized protocol, provider-agnostic |
| Prompt-based | ReAct-style | Model emits text: `Action: tool(args)` |

---

## 2. Model Context Protocol (MCP)

### What Is MCP?

The **Model Context Protocol (MCP)** — created by Anthropic and donated to the Linux Foundation in December 2025 — standardizes how AI agents connect to external tools, data sources, and services. It is analogous to USB for peripherals, but for AI tool connectivity.

### Key Facts

- **Created by**: Anthropic
- **Stewarded by**: Linux Foundation (since Dec 2025)
- **Adoption**: Supported across OpenAI, Google, Anthropic, and 75+ connectors
- **Standardization**: Open protocol, provider-agnostic
- **Analogy**: MCP is to AI tools what USB is to computer peripherals

### MCP Architecture

```
┌───────────────┐     MCP Protocol     ┌─────────────────┐
│  AI Agent     │◄────────────────────►│  MCP Server     │
│  (Client)     │                      │  (Tool Host)    │
└───────┬───────┘                      └────────┬────────┘
        │                                       │
        │                                       ├── Search API
        │                                       ├── Database
        │                                       ├── File System
        │                                       ├── Code Interpreter
        │                                       └── Custom Tools
```

**Components:**
1. **MCP Client**: The AI agent or application
2. **MCP Server**: Hosts tool implementations
3. **MCP Protocol**: Standardized message format for tool discovery, invocation, and result return

### MCP Tool Discovery

MCP servers expose their capabilities via a discovery endpoint:

```json
{
  "tools": [
    {
      "name": "search_web",
      "description": "Search the web for information",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string", "description": "Search query" },
          "count": { "type": "integer", "description": "Results count", "default": 5 }
        },
        "required": ["query"]
      }
    }
  ]
}
```

### Benefits of MCP

- **Interoperability**: Same tool works across OpenAI, Anthropic, Google
- **Standardized definitions**: Consistent format reduces engineering overhead
- **Security**: Standardized authentication and permission model
- **Discoverability**: Agents can discover available tools dynamically

---

## 3. Tool Definition Format

### Basic Tool Definition

Each tool needs:
1. **Name** — identifier the model uses to call it
2. **Signature** — parameters with types
3. **Description** — what it does (critical for model to choose correctly)
4. **Return type** — what the model can expect back

```
Tool: search(query: string) → list of {title, url, snippet}
Tool: calculator(expression: string) → number
Tool: read_file(path: string) → string
Tool: execute_code(language: string, code: string) → {stdout, stderr}
Tool: database_query(sql: string) → list of rows
Tool: send_email(to: string, subject: string, body: string) → status
```

### Detailed Tool Definition with Descriptions

```
## search
Searches the web and returns relevant results.
Use when you need current information, facts, or data not in your training.
Parameters:
  - query (string, required): The search query
  - max_results (integer, optional): Number of results (default: 5)
Returns: List of {title, url, snippet}

## calculator
Evaluates mathematical expressions.
Use for any arithmetic, algebra, or numerical computation.
Parameters:
  - expression (string, required): Math expression to evaluate
Returns: Number

## read_file
Reads content from a file on the local filesystem.
Use to access project files, configuration, or saved data.
Parameters:
  - path (string, required): Absolute or relative file path
Returns: String content of the file
```

### JSON Schema Format (API-level)

```json
{
  "tools": [
    {
      "name": "search_web",
      "description": "Search the web for current information",
      "input_schema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "The search query string"
          },
          "num_results": {
            "type": "integer",
            "description": "Number of results to return (1-10)",
            "default": 5
          }
        },
        "required": ["query"]
      }
    },
    {
      "name": "fetch_url",
      "description": "Retrieve the text content of a URL",
      "input_schema": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "description": "The URL to fetch"
          }
        },
        "required": ["url"]
      }
    }
  ]
}
```

### Tool Description Best Practices

| Do | Don't |
|---|---|
| Be specific about when to use this tool | "Use for various tasks" (vague) |
| Describe the return format | Omit what the tool returns |
| Specify parameter constraints | Leave parameter boundaries unclear |
| Mention rate limits or costs | Hide limitations |
| Give examples of good queries | Give abstract descriptions |

---

## 4. System Prompt for Tool-Use

### The Standard Tool-Use System Prompt

```
You have access to the following tools:

{tool_definitions}

## How to Use Tools
To use a tool, respond in this format:
Action: tool_name(arguments)

The system will execute the tool and respond with:
Observation: [result]

## Rules
1. Always reason before acting:
   Thought: [your reasoning about what to do next]
   Action: [tool call]

2. Use observations to inform next steps:
   Thought: [analyze the observation]
   Action: [next tool call or Final Answer]

3. If a tool fails, try an alternative approach:
   - Retry with different parameters
   - Use a different tool
   - If nothing works, state the limitation

4. When you have enough information:
   Final Answer: [your synthesized response]

5. Never fabricate tool results.
   Never call tools with fake or assumed parameters.
   If you're unsure of a parameter, ask or skip the tool call.
```

### Minimal Version (for token efficiency)

```
Tools: {tool_list}

Format:
Thought: [reasoning]
Action: tool(args)
Observation: [system response]
...repeat until done...
Final Answer: [answer]

Rules: Reason first. Use tools when needed. Never fabricate results.
```

### Tool-Use with ReAct Loop (Full Pattern)

```
You are a ReAct agent. You MUST alternate between:
- Thought: Your internal reasoning
- Action: A tool call in the format tool_name(arguments)
- Observation: The result of your action (provided by the system)

Available tools:
{tools}

Critical rules:
- Every Action MUST be preceded by a Thought
- Every Action MUST be followed by an Observation
- Do NOT fabricate observations — only use what the system provides
- If stuck after 3 attempts, respond: Final Answer: Unable to complete
- When you have sufficient information, respond: Final Answer: [answer]

Begin:
```

### Provider-Specific Additions

**For OpenAI (Function Calling):**
```
You have functions available that you can call when needed.
The system will provide function results automatically.
Use functions to gather information, perform computations, or take actions.
When you have enough information, respond directly.
```

**For Anthropic (Tool Use):**
```
You have the following tools available.
Use <function_calls> tags when invoking tools.
The system will provide the results in <function_results> tags.
Base your responses on the actual tool results provided.
```

**For MCP-based systems:**
```
You have access to tools provided by MCP servers.
{tool_definitions_from_mcp_discovery}
Use the standard Action/Observation pattern.
```

---

## 5. Research Agent with Tools

### Complete System Prompt

```
You are a research assistant with the following tools:

## search_web(query, num_results=5)
Searches the web. Use for finding current information, sources, and data.
- query: The search query
- num_results: Number of results (1-10, default 5)

## fetch_page(url)
Retrieves the full text content of a webpage.
Use when you need details beyond search snippets.
- url: The URL to fetch

## extract_facts(text)
Extracts structured facts from a block of text.
Use to distill key information from articles.
- text: The text to extract facts from

## Your Process
For each research query:
1. Plan: What do I need to learn? What are the sub-topics?
2. Search: Find relevant sources
3. Read: Fetch the most promising results
4. Extract: Pull out key facts
5. Synthesize: Combine findings into a coherent answer
6. Cite: Reference sources with [number] notation

## Rules
- Search across multiple queries for comprehensive coverage
- Fetch at least 2-3 sources before synthesizing
- If a search returns few results, try different search terms
- Never fabricate sources or data
- If information is unavailable, clearly state that
- Cite every factual claim with a source number

## Output Format
Provide a structured report:
### Overview
### Key Findings (with [source] citations)
### Sources
[1] Title — URL
[2] Title — URL
```

### Example Interaction

```
User: What are the latest advances in solid-state battery technology?

Thought: I need to find recent information about solid-state battery advances.
Let me start with a broad search.
Action: search_web("solid state battery advances 2026")
Observation: [5 results about solid-state battery breakthroughs...

Thought: The results show several promising developments. Let me read the most
comprehensive article for details.
Action: fetch_page("https://example.com/solid-state-battery-breakthroughs")
Observation: [Full article text about Toyota's solid-state battery timeline,
QuantumScape's results, and Samsung's advances...]

Thought: Let me also search for specific companies' progress.
Action: search_web("QuantumScape solid state battery 2026 results")
Observation: [Results about QuantumScape's latest milestones...]

Thought: I have good coverage now. Let me also check a third area for
comprehensive coverage.
Action: search_web("solid state battery challenges 2026")
Observation: [Results about remaining challenges...]

Thought: I now have sufficient information across multiple subtopics.
Let me synthesize the findings.
Final Answer:
### Overview
Solid-state battery technology has seen significant advances in 2026...

### Key Findings
1. Toyota announced plans for solid-state battery production by 2027 [1]
2. QuantumScape achieved 1000+ cycle life in testing [2]
3. Samsung demonstrated high-energy-density prototype [1]
4. Key challenges remain: manufacturing cost, dendrite formation [3]

### Sources
[1] "Solid-State Battery Breakthroughs 2026" — example.com/article1
[2] "QuantumScape Q4 2025 Results" — example.com/article2
[3] "Challenges in Solid-State Battery Commercialization" — example.com/article3
```

---

## 6. Tool Selection and Routing Patterns

### Deterministic Routing

The system prompt explicitly states which tool to use for which situation.

```
Tool selection rules:
- For current events → use search_web
- For math/computation → use calculator
- For code execution → use execute_python
- For file operations → use read_file / write_file
- For data analysis → use analyze_data
```

### Conditional Routing

The model decides based on the query characteristics.

```
Analyze the user's request and select tools based on:
1. Does it ask for current information? → Search tools
2. Does it ask for computation? → Calculator / code tools
3. Does it ask about files? → File system tools
4. Does it ask for creative writing? → No tools needed (generate directly)

You may use multiple tools in sequence if the task requires it.
```

### Fallback Routing

If the primary tool fails, try alternatives.

```
Tool selection with fallback:
1. Try the primary tool for the task
2. If it fails, try an alternative tool that could provide similar information
3. If all tools fail, report what you couldn't determine

Example:
- Primary: search_web("topic")
- Fallback: search_web("topic 2025") [if primary returns nothing]
- Final fallback: State that current information is unavailable
```

### Dynamic Tool Creation

In advanced systems, agents can create new tools dynamically.

```
You can create new tools when needed:
1. Identify a repeated pattern in your work
2. Define a tool with name, parameters, and implementation
3. Register it with the system
4. Use it in subsequent steps

Tool definition format:
Tool: [name]([params]) → [return type]
Description: [when to use this tool]
```

---

## 7. Error Handling and Fallback Patterns

### Common Tool Failures

| Failure Mode | Cause | Handling Strategy |
|---|---|---|
| **Network error** | API unreachable | Retry with backoff |
| **Rate limit** | Too many calls | Wait, reduce frequency |
| **Invalid parameters** | Bad argument from model | Fix parameters, retry |
| **Empty results** | No data found | Try different approach |
| **Timeout** | Tool took too long | Use smaller scope |
| **Permission denied** | Access not granted | Report limitation |

### Error Handling Prompt Pattern

```
## Error Handling
When a tool call fails:

### Case 1: Tool Returns Error
- Read the error message carefully
- Retry with corrected parameters (once)
- If still failing, try a different tool approach
- Log: "Tool X failed with error Y. Attempted fix: Z."

### Case 2: Tool Returns Empty Results
- Try different search terms or parameters
- Broaden the scope if needed
- If 3 attempts yield nothing, report: "No results found for [query]"

### Case 3: All Tools Fail
- State: "I was unable to complete [task] because [reason]."
- Suggest alternative approaches the user could try manually
- Do not fabricate results to compensate

### General Rules
- Never pretend a tool succeeded when it failed
- Always retry once before switching strategies
- Log all errors for debugging
- If the same tool fails repeatedly, stop using it
```

### Example: Error Recovery

```
Action: search_web("quantum error correction latest")
Observation: Error: Rate limit exceeded. Try again in 10 seconds.

Thought: Rate limit hit. Let me wait briefly and retry with a more
specific query that will return fewer results and be faster.
Action: wait(2)
Observation: Done

Action: search_web("surface code quantum error correction 2026")
Observation: [3 results...]

Thought: More specific query worked. Let me proceed with these results.
```

### Graceful Degradation Strategy

```
If tool use degrades:
1. First attempt: Full tool use with all capabilities
2. Reduced attempt: Core tools only (avoid rate-limited or slow tools)
3. Minimal attempt: Single search, no fetches — synthesize from snippets
4. Fallback: Respond from knowledge alone, clearly stating limitations

Always inform the user of the degradation level.
```

---

## 8. Security Considerations

### Principle of Least Privilege

Give agents only the tools they need, and only the permissions they need.

```
// DO NOT give agents destructive tools without safeguards:
Tool: delete_file(path)     // ❌ Dangerous without confirmation
Tool: execute_shell(cmd)    // ❌ Extremely dangerous
Tool: write_file(path, content)  // ⚠️ Require confirmation for critical files

// Better approach:
Tool: create_file(path, content)  // ✅ Limited to non-existent files
Tool: read_file(path)             // ✅ Read-only
Tool: search_files(pattern)       // ✅ Read-only
```

### Security Measures

| Measure | Description | Implementation |
|---|---|---|
| **Tool scoping** | Limit which tools are available per agent | Per-agent tool lists |
| **Parameter validation** | Validate all tool arguments | Schema validation before execution |
| **Rate limiting** | Limit tool call frequency | Max calls per minute |
| **Confirmation gates** | Require confirmation for destructive actions | Human-in-the-loop for deletes, writes |
| **Audit logging** | Log every tool call with parameters | For post-hoc analysis |
| **Sandboxing** | Execute code in isolated environments | Docker, sandboxed interpreters |
| **Output filtering** | Sanitize tool outputs before display | Strip sensitive data |

### Security Prompt Instructions

```
## Security Rules
- Never call tools with user-provided parameters without validation
- Never access files outside the permitted directory
- Never execute commands without explicit user approval
- Never share tool output that contains personal or sensitive information
- If asked to perform an unsafe action, refuse and explain why

## Unsafe Action Examples
❌ "Delete the production database"
❌ "Read /etc/passwd"
❌ "Execute this shell command: [untrusted input]"

## Safe Alternatives
✅ "I cannot delete files. Can I help you archive or move them instead?"
✅ "I don't have access to system files. Can I help with project files?"
✅ "I cannot execute arbitrary shell commands. Can I run a specific script?"
```

### MCP Security Model

MCP provides standardized security features:
- **Authentication**: OAuth2, API keys
- **Authorization**: Per-tool permission scopes
- **Audit**: Complete call logging
- **Sandboxing**: Tools run in isolated environments
- **Rate limiting**: Managed at the MCP server level

---

## 9. Advanced Tool-Use Patterns

### Tool Composition

Combine multiple tools to accomplish complex tasks.

```
Task: "Compare the price of NVIDIA stock today vs. 1 year ago"

1. search_web("NVIDIA stock price today")
2. fetch_page(stock_url)
3. extract_facts(page_content)
4. search_web("NVIDIA stock price June 2025")
5. fetch_page(historical_url)
6. calculator("current_price - historical_price")

→ Final: "NVIDIA stock is up $X (Y%) since last year"
```

### Tool Chaining with Dependencies

Some tools depend on the output of previous tools.

```
Step 1: search_web("best restaurants in Chicago") → returns URLs
Step 2: fetch_page(url[0]) → returns restaurant details
Step 3: extract_facts(details) → returns structured data
Step 4: calculator("average_rating among top 5") → returns number
```

### Conditional Tool Execution

Tools are called only when certain conditions are met.

```
Search for information.
If search returns ≥3 results → fetch the top 2 pages for details.
If search returns 1-2 results → broaden search terms.
If search returns 0 results → try alternative search or report unavailability.
```

### Tool Use with Iterative Refinement

Use tools to iteratively improve an output.

```
Generate initial answer → search for verification → update answer
→ search remaining claims → final verification → output
```

### Hybrid: Tool Use + Reasoning

Alternate between reasoning and tool use for complex tasks.

```
Thought: I need to understand the impact of AI on healthcare.
Let me break this into sub-topics: diagnostics, drug discovery, robotics.

Action: search_web("AI diagnostics accuracy 2026 studies")
Observation: [results]

Thought: AI diagnostics show high accuracy. Let me now check drug discovery.
Action: search_web("AI drug discovery breakthroughs 2026")
...
```

---

## 10. Best Practices

### Prompt Design

- **Be explicit about tool selection criteria** — describe exactly when to use each tool
- **Define fallback behavior** for every tool failure
- **Include "never" rules** — "Never fabricate tool results" is essential
- **Keep tool descriptions clear and concise** — 1-2 sentences per tool
- **Reason before acting** — enforce Thought → Action ordering in the prompt

### Token Efficiency

- Tool definitions typically add 150-300 tokens per call
- Remove tools that aren't relevant to the current task
- Use brief descriptions for well-known tools (calculator, search)
- Consider having different tool sets for different phases of a task

### Production Considerations

- **Log every tool call** — parameters, result, latency, errors
- **Set budgets** — max tool calls per request (typically 10-25)
- **Monitor tool success rates** — low success rate = prompt or tool issue
- **Version tools** — changes to tool behavior should be tracked
- **Test tool combinations** — not just individual tools
- **Rate limit at the system level** — don't rely on the agent to self-regulate

### Common Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Ambiguous tool descriptions | Agent uses wrong tool | Be specific: "Use for X, not for Y" |
| No error handling | Agent halts on tool failure | Define fallback in prompt |
| Too many tools | Agent confused about selection | Group tools, limit per agent |
| No stopping condition | Agent calls tools indefinitely | Set max calls, explicit stop criteria |
| Fabricated tool results | Agent makes up data when tired | Add "Never fabricate tool results" rule |
| Tool call loops | Agent calls tool → observation → same tool | Add diversity instructions |

---

## 11. Resources

### Official Documentation
- OpenAI: "Function Calling" documentation
- Anthropic: "Tool Use" documentation + MCP specification
- Google: "Function Calling" in Gemini API

### MCP Resources
- MCP Specification: Linux Foundation repository
- MCP Connectors Directory: 75+ pre-built connectors
- MCP Quickstart Guide

### Papers
- Yao et al.: "ReAct: Synergizing Reasoning and Acting in Language Models" (arXiv:2210.03629)
- Schick et al.: "Toolformer: Language Models Can Teach Themselves to Use Tools" (2023)

### Guides
- SurePrompts: "AI Agents Prompting Guide" (2026)
- Anthropic: "Building Effective Agents" (2024)
- LangChain: "Tool Use Patterns" documentation

### Related Topics in This Knowledge Base
- **Section 01** — AI Agent Architecture (agent loop fundamentals)
- **Section 06** — Memory-Augmented Prompting (memory as a tool)
- **Section 08** — ReAct Patterns (Reasoning + Acting)
