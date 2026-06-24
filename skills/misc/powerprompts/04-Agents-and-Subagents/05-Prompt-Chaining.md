# Prompt Chaining

> A comprehensive reference on designing sequential, branching, and parallel LLM workflows — covering six core workflow patterns, validation at each boundary, routing, code generation pipelines, and observability strategies.

---

## Table of Contents

1. [What Is Prompt Chaining](#1-what-is-prompt-chaining)
2. [Six Core Workflow Patterns](#2-six-core-workflow-patterns)
3. [Sequential Chain with Validation](#3-sequential-chain-with-validation)
4. [Branching and Router Patterns](#4-branching-and-router-patterns)
5. [Parallelization and Map-Reduce](#5-parallelization-and-map-reduce)
6. [Orchestration Pattern](#6-orchestration-pattern)
7. [Iterative and Refinement Patterns](#7-iterative-and-refinement-patterns)
8. [Code Generation Pipeline Example](#8-code-generation-pipeline-example)
9. [Observability and Logging](#9-observability-and-logging)
10. [Error Handling in Chains](#10-error-handling-in-chains)
11. [Best Practices](#11-best-practices)
12. [Resources](#12-resources)

---

## 1. What Is Prompt Chaining

### Definition

**Prompt chaining** breaks complex tasks into a sequence of smaller, focused prompts where the output of one becomes the input of the next. Each step is a discrete LLM invocation with its own:
- **System prompt** — tailored to that step's specific task
- **Validation logic** — checks output quality before passing to next step
- **Error handling** — retry, fallback, or graceful degradation

### Why Chain Prompts?

| Benefit | Monolithic Prompt | Chained Prompts |
|---|---|---|
| **Complexity management** | One massive prompt | Focused steps, each doing one thing |
| **Debugging** | Hard to find which part failed | Each step logs independently |
| **Token efficiency** | Full context every time | Only relevant context per step |
| **Reusability** | Tightly coupled | Steps can be reused across chains |
| **Error isolation** | One error breaks everything | Errors contained per step |
| **Observability** | Black box | Clear input/output per step |

### When to Use Prompt Chaining

Anthropic's guidance: "Try prompt chaining before reaching for full agent loops." Chains are:
- **Simpler** — no complex agent loop needed
- **More reliable** — deterministic flow, no wandering
- **Cheaper** — fewer tokens than open-ended agent loops
- **Easier to debug** — each step is a clear unit

**Use chaining when:**
- The task has clear sequential stages
- Each stage produces a defined intermediate output
- The flow is predictable and doesn't require dynamic replanning
- You need reliability over flexibility

**Use agents when:**
- The task requires dynamic tool selection
- The flow is unpredictable
- The model needs to decide its own next steps

---

## 2. Six Core Workflow Patterns

### Overview

```
1. Chain          A → B → C → D          Sequential, linear
2. Router         Input → Classify → A/B/C  Branching based on input
3. Parallelization  A → B+C+D → E        Fan-out, then aggregate
4. Orchestration  Dynamic planning + delegation  Agent-like
5. Map-Reduce     Split → Map → Reduce   Large input processing
6. Iterative      Generate → Validate → Refine  Loop until quality
```

### 2.1 Chain Pattern

Sequential steps where each step depends on the previous.

```
Input → Step A → Step B → Step C → Output
```

**When to use:** Linear workflows — writing, analysis, processing pipelines.

**Example:**
```
Step 1: Outline → "Create a detailed outline"
Step 2: Draft → "Write section 1 based on outline"
Step 3: Review → "Review for clarity and accuracy"
Step 4: Polish → "Apply feedback, polish"
```

### 2.2 Router Pattern

Classify the input, then dispatch to a specialized handler.

```
Input → Classifier → A (code) ──→ Formatter
                   → B (writing) ──→ Formatter
                   → C (analysis) ──→ Formatter
                           ↓
                     Output
```

**When to use:** Multi-type inputs that need different processing.

### 2.3 Parallelization Pattern

Fan-out to multiple independent LLM calls, then aggregate.

```
Input → Parallel: A, B, C → Aggregator → Output
```

**When to use:** Tasks that benefit from multiple perspectives, or large work that can be split.

### 2.4 Orchestration Pattern

A dynamic pattern where a "planner" step decides the workflow at runtime.

```
Input → Planner → Dynamic chain of steps → Output
```

**When to use:** When the optimal sequence isn't known until runtime.

### 2.5 Map-Reduce Pattern

Split large input, process each chunk independently, combine.

```
Large Input → Split → [Chunk1→Process, Chunk2→Process, ...] → Combine → Output
```

**When to use:** Large documents, batch processing, data transformation.

### 2.6 Iterative Pattern

Loop: generate → validate → refine → validate → ...

```
Input → Generate → Validate → [Pass? → Output | Fail? → Refine → Validate → ...]
```

**When to use:** Quality-critical tasks, writing, code generation, design.

### Pattern Selection Guide

| You Need | Use Pattern | Complexity |
|---|---|---|
| Predictable sequential process | Chain | Low |
| Different handling per input type | Router | Low-Medium |
| Speed through parallelism | Parallelization | Medium |
| Dynamic workflow | Orchestration | High |
| Process large content | Map-Reduce | Medium |
| Iterative quality improvement | Iterative | Medium |

---

## 3. Sequential Chain with Validation

### Anatomy of a Chain Step

Each step in a chain has:

```
┌─────────────────────────────────┐
│         Step Definition          │
├─────────────────────────────────┤
│  Input: [schema or description] │
│  Prompt: [system prompt text]   │
│  Model: [model choice]          │
│  Validation: [check function]   │
│  Error handling: [on fail]      │
│  Output: [schema or description]│
└─────────────────────────────────┘
```

### Chain with Validation Gates

```
Step 1 (Outline Generation)
  Prompt: "Create a detailed outline for: {topic}"
  Validation: Outline has ≥3 sections? Each section has subsection?
  Pass → Step 2 | Fail → Retry (max 2) → Fail → Use default outline

  ↓ (validated outline)

Step 2 (Section Drafting)
  Prompt: "Write section '{section_name}' based on this outline: {outline}"
  Validation: Length > 100 words? Covers all bullet points in outline?
  Pass → Step 3 | Fail → Retry with more detail

  ↓ (validated section)

Step 3 (Review)
  Prompt: "Review this section for: clarity, accuracy, tone. {section}"
  Validation: Score ≥ 7/10 on each criterion?
  Pass → Step 4 | Fail → Go to Step 2 with review feedback

  ↓ (review comments + section)

Step 4 (Polish)
  Prompt: "Apply review feedback: {feedback} to this text: {section}"
  Validation: All feedback items addressed?
  Pass → Output | Fail → Flag for human review
```

### Validation Function Template

```python
def validate_step_output(output, schema, criteria):
    """
    Validate step output against schema and quality criteria.

    Args:
        output: The LLM's output for this step
        schema: Expected structure (JSON schema)
        criteria: Quality checks (list of (name, test_fn) tuples)

    Returns:
        (is_valid: bool, errors: list[str])
    """
    errors = []

    # 1. Schema validation
    try:
        validate_schema(output, schema)
    except SchemaError as e:
        errors.append(f"Schema violation: {e}")

    # 2. Quality criteria
    for name, test_fn in criteria:
        if not test_fn(output):
            errors.append(f"Quality check failed: {name}")

    return len(errors) == 0, errors
```

### Structured Output Between Steps

Use structured schemas to ensure consistent data passing:

```json
// Step 1 Output (Outline)
{
  "title": "Article Title",
  "sections": [
    {
      "heading": "Introduction",
      "subtopics": ["context", "thesis"],
      "estimated_length": "200 words"
    },
    {
      "heading": "Main Body",
      "subtopics": ["point 1", "point 2", "evidence"],
      "estimated_length": "600 words"
    }
  ],
  "tone": "professional",
  "target_audience": "developers"
}
```

---

## 4. Branching and Router Patterns

### Simple Router

Classify the input, then dispatch.

```
Step 1 (Classifier)
  Prompt: "Classify the user's request as one of:
  - code: programming or technical question
  - writing: content creation or editing
  - analysis: data analysis or research
  - other: anything else

  Request: {user_input}
  Classification:"

  → Output: "code" | "writing" | "analysis" | "other"

Step 2 (Route based on classification)
  code → Code Handler: "You are a programming expert..."
  writing → Writing Handler: "You are a writing assistant..."
  analysis → Analysis Handler: "You are a data analyst..."
  other → General Handler: "You are a helpful assistant..."
```

### Multi-Router (Hierarchical Classification)

```
Step 1: Broad classification
  → "code" | "writing" | "analysis"

Step 2: Narrow classification within category
  code → "python" | "javascript" | "rust" | "general"
  writing → "blog" | "email" | "report" | "creative"
  analysis → "statistical" | "financial" | "research"

Step 3: Specialized handler
  python → Python Expert Agent
  blog → Blog Writer Agent
  statistical → Statistician Agent
```

### Conditional Branching

Branch based on intermediate results.

```
Step 1: Analyze complexity
  Prompt: "Rate the complexity of this task (simple/medium/complex): {task}"

  If simple → Step 2a: Direct answer
  If medium → Step 2b: Gather more info, then answer
  If complex → Step 2c: Create plan, execute plan, synthesize

Step 2a: "Provide a direct answer to: {task}"

Step 2b: "What additional information would help answer: {task}?"
  → Get user clarification, then answer

Step 2c:
  3.1 "Create a step-by-step plan for: {task}"
  3.2 Execute each step
  3.3 "Synthesize all findings"
```

### Router with Confidence Check

```
Step 1: Classify with confidence
  "Classify this request: {input}
   Confidence (0-1):"

  If confidence > 0.8 → Route to specialized handler
  If confidence 0.5-0.8 → Route to general handler (more flexible)
  If confidence < 0.5 → Ask user for clarification
```

---

## 5. Parallelization and Map-Reduce

### Parallelization Pattern

```
Input → [Agent A: Security Review,
         Agent B: Performance Review,
         Agent C: UX Review]
         → Aggregator: "Combine all reviews, prioritize findings"
         → Output
```

**Key considerations:**
- Agents must run independently (no shared state)
- Each agent receives the same base input but with a different focus
- Aggregator merges results, removes duplicates, prioritizes

### Map-Reduce Pattern in Detail

**Map Phase:**
```
Split the large input into chunks (e.g., by chapter, by file, by topic).

For each chunk, run the same prompt:
"You are analyzing a section of a larger document.
Your task: {analysis_task}

Section content:
{chunk}

Provide your analysis of this section only."
```

**Reduce Phase:**
```
You are synthesizing analyses from multiple sections.
Individual section analyses:
{all_chunk_results}

Your task: Combine these into a unified analysis.
- Identify themes that appear across sections
- Note any contradictions
- Provide a holistic assessment
```

### Map-Reduce with Overlap

To handle context that spans chunk boundaries, use overlapping chunks.

```
Chunk 1: [lines 1-100]
Chunk 2: [lines 90-190]
Chunk 3: [lines 180-280]

Reduce step handles:
- Deduplication of overlapping information
- Merging references that span boundaries
- Ensuring continuity
```

### When Parallelization Beats Sequential

| Factor | Sequential | Parallel |
|---|---|---|
| **Wall clock time** | Sum of all steps | Max step time (with enough workers) |
| **Context window** | Each step uses full output | Each worker has focused context |
| **Cost** | Minimal (one path) | Higher (multiple paths) |
| **Quality** | Single perspective | Multiple perspectives |
| **Coherence** | High (linear flow) | Needs good aggregation |

---

## 6. Orchestration Pattern

### What It Is

The orchestration pattern combines aspects of chaining with dynamic decision-making. A "planner" step determines the workflow at runtime, making it more flexible than static chains.

### Orchestration Flow

```
Step 1: Plan
  "Analyze this task and create a plan:
   Task: {user_input}
   Available capabilities: {list}

   Plan: What steps, in what order, using which capabilities?"

Step 2-N: Execute plan steps
  Each step follows the plan, checking off completed items.

Final: Synthesize
  "All steps completed. Synthesize results into final output."
```

### Orchestration vs. Agent Loop

| Aspect | Orchestration | Agent Loop |
|---|---|---|
| **Planning** | One-time upfront plan | Continuous replanning |
| **Flexibility** | Moderate (follows plan) | High (adapts every step) |
| **Reliability** | High (structured plan) | Moderate (can wander) |
| **Cost** | Lower (fewer LLM calls) | Higher (continuous reasoning) |
| **Best for** | Well-understood multi-step tasks | Open-ended exploration |

### Orchestration Example

```
User: "Research and write a report on renewable energy trends"

Step 1 — Planner:
  "Plan: 1. Search for recent trends → 2. Analyze findings →
   3. Structure report → 4. Write report → 5. Review and polish"

Step 2 — Search:
  "Search for: renewable energy trends 2026"
  → Results: [sources]

Step 3 — Analyze:
  "Analyze these sources and identify top 5 trends: {sources}"
  → Trends: [5 trends with details]

Step 4 — Structure:
  "Create a report outline covering these trends: {trends}"
  → Outline: [structured outline]

Step 5 — Write:
  "Write the report following this outline: {outline}"
  → Draft report

Step 6 — Review:
  "Review the report for completeness, accuracy, and clarity"
  → Final report
```

---

## 7. Iterative and Refinement Patterns

### Basic Iterative Pattern

```
Generate → Validate → [Pass? → Output | Fail → Refine → Loop]
```

**Implementation:**
```python
def iterative_refine(initial_prompt, validation_fn, max_iterations=3):
    output = llm_call(initial_prompt)
    for i in range(max_iterations):
        is_valid, feedback = validation_fn(output)
        if is_valid:
            return output
        output = llm_call(f"Refine based on: {feedback}\n\nCurrent: {output}")
    return output  # Best effort after max iterations
```

### Progressive Refinement Pattern

Each iteration focuses on a different aspect.

```
Pass 1: "Generate a complete first draft of the content."
Pass 2: "Improve the structure and flow."
Pass 3: "Enhance clarity and simplify language."
Pass 4: "Fix grammar, punctuation, and style issues."
Pass 5: "Final polish — ensure consistent tone and voice."
```

### Self-Critique Loop

```
Step 1: Generate initial output

Step 2: Self-critique
  "Critique your own output. Identify:
   - What is correct
   - What is incorrect or incomplete
   - What could be improved
   - What is missing"

Step 3: Refine
  "Revise your output based on your critique."

Step 4: Verify
  "Did the revision address all critique points?
   If yes → Output
   If no → Return to Step 2 (max 3 loops)"
```

### Iterative with External Feedback

```
Loop:
  1. Generate output
  2. Present to user (or validation system)
  3. Collect feedback
  4. Apply feedback
  5. Re-present

Until: User accepts or max iterations reached
```

---

## 8. Code Generation Pipeline Example

### Full Pipeline

```
User: "Add a user authentication system to the web app"

Step 1: Requirements Analysis
  Prompt: "Analyze this feature request: {request}
           Extract: functional requirements, technical constraints,
           affected files, dependencies"
  Output: structured requirements document
  Validation: All required fields present?

Step 2: Architecture Design
  Prompt: "Given these requirements: {reqs}
           Design the architecture including:
           - Component/class hierarchy
           - Data flow
           - API endpoints
           - Database schema changes
           - Security considerations"
  Output: architecture.md
  Validation: Architecture covers all requirements?

Step 3: Implementation Plan
  Prompt: "Based on the architecture: {arch}
           Create a step-by-step implementation plan:
           - File creation order
           - Dependencies between changes
           - Testing strategy
           - Rollback considerations"
  Output: implementation plan
  Validation: Steps are ordered by dependency?

Step 4: Code Generation (per file)
  Prompt: "Implement {file_path} following the architecture: {arch}
           and implementation plan: {plan}
           Code style: TypeScript, strict mode, no any
           Include: types, implementation, exports"
  Output: file content
  Validation: Compiles? Passes type checks?

Step 5: Test Generation
  Prompt: "Write tests for: {file_content}
           Cover: happy path, error cases, edge cases
           Test framework: {framework}"
  Output: test file content
  Validation: Tests cover >80% of code paths?

Step 6: Integration Review
  Prompt: "Review all generated code for:
           - Consistency across files
           - Architecture compliance
           - Security vulnerabilities
           - Performance implications
           - Missing error handling
           Score each area 1-10"
  Output: review report
  Validation: All scores ≥ 7?

Step 7: Final Polish
  Prompt: "Fix all issues identified in the review: {review}
           Rerun tests. Confirm all pass."
  Output: final code + test results
```

### Pipeline as Code

```python
pipeline = [
    Step("requirements", analyze_requirements_prompt, validate_requirements),
    Step("architecture", design_architecture_prompt, validate_architecture),
    Step("plan", create_implementation_plan_prompt, validate_plan),
    Step("implement", generate_code_prompt, validate_code, repeat_for="files"),
    Step("test", generate_tests_prompt, validate_tests, depends_on="implement"),
    Step("review", integration_review_prompt, validate_review),
    Step("polish", final_polish_prompt, validate_final),
]

def run_pipeline(pipeline, input_data):
    context = {"input": input_data}
    for step in pipeline:
        prompt = render(step.prompt, context)
        for attempt in range(3):  # retry logic
            output = llm_call(prompt)
            is_valid, errors = step.validate(output)
            if is_valid:
                context[step.name] = output
                break
            log_attempt_failure(step.name, attempt, errors)
        else:
            raise PipelineError(f"Step {step.name} failed after 3 attempts")
    return context
```

---

## 9. Observability and Logging

### Why Observability Matters in Chains

- Chains have multiple failure points; you need to know which step failed
- Intermediate outputs help debug quality issues
- Token usage accumulates across steps; you need to track it
- Latency varies per step; you need to identify bottlenecks

### What to Log Per Step

```json
{
  "chain_id": "uuid",
  "step": {
    "name": "requirements_analysis",
    "step_number": 1,
    "start_time": "2026-06-03T10:00:00Z",
    "end_time": "2026-06-03T10:00:05Z",
    "duration_ms": 5234,
    "model": "gpt-4o",
    "tokens": {
      "prompt": 1250,
      "completion": 890,
      "total": 2140
    },
    "validation": {
      "passed": true,
      "checks": [
        {"name": "has_requirements", "passed": true},
        {"name": "has_constraints", "passed": true},
        {"name": "min_length", "passed": true}
      ]
    },
    "output_preview": "## Requirements\n\n1. User registration...",
    "status": "success"
  }
}
```

### Production Logging Template

```
## Observability Configuration

Log per step:
- Chain ID (trace through entire workflow)
- Step name and number
- Model used
- Token counts (prompt, completion, total)
- Latency (duration in ms)
- Validation results (which checks passed/failed)
- Error details (if any)
- Output hash (for deduplication)
- Full input/output (or summary for large outputs)

Log per chain:
- Total tokens
- Total latency
- Number of steps completed
- Number of retries
- Final status (success/failure/partial)

Alert on:
- Step failure rate > 5%
- Token usage > budget per chain
- Latency > 2x baseline for any step
- Validation failure rate > 10%
```

### Debugging with Step Traces

```
Chain: "Add auth system"
─────────────────────────────────────────
Step 1: requirements    ✅  [2.1s, 890 tok]
Step 2: architecture    ✅  [3.4s, 1450 tok]
Step 3: plan            ✅  [1.8s, 720 tok]
Step 4: implement (x3)  ✅  [12.4s, 5230 tok]
  ├── auth.service.ts   ✅  [4.1s, 1740 tok]
  ├── auth.controller   ✅  [3.9s, 1680 tok]
  └── auth.middleware   ✅  [4.4s, 1810 tok]
Step 5: test (x3)       ✅  [8.7s, 3670 tok]
Step 6: review          ⚠️  [2.3s, 980 tok]
  └── Security: 6/10 ⚠️ (XSS vulnerability found)
Step 7: polish          ✅  [3.1s, 1340 tok]
─────────────────────────────────────────
Total: 33.8s, 14,280 tokens
Status: COMPLETED (1 warning)
```

---

## 10. Error Handling in Chains

### Per-Step Error Strategy

```
┌─────────────────────────────────────────────┐
│             Step Execution                    │
├─────────────────────────────────────────────┤
│  1. Execute step with system prompt          │
│  2. Validate output                          │
│     ├─ Pass → Continue to next step          │
│     ├─ Fail → Retry (max 2, with feedback)   │
│     └─ All retries fail →                   │
│          └─ Fallback step                    │
│               ├─ Use cached/previous result  │
│               ├─ Use simplified version      │
│               └─ Mark step as skipped        │
└─────────────────────────────────────────────┘
```

### Graceful Degradation in Chains

```python
def execute_step(step, context, max_retries=2):
    for attempt in range(max_retries + 1):
        try:
            output = llm_call(step.prompt, context)
            is_valid, errors = step.validate(output)
            if is_valid:
                return StepResult(status="success", output=output)

            if attempt < max_retries:
                context["feedback"] = errors
                step.prompt += f"\n\nPrevious attempt had these issues: {errors}"
                continue

            # All retries failed — try fallback
            if step.fallback:
                return execute_fallback(step, context)
            return StepResult(status="skipped", error=errors)

        except Exception as e:
            log_step_error(step.name, attempt, e)
            if attempt == max_retries:
                return StepResult(status="failed", error=str(e))
```

### Error Propagation Rules

```
If Step 2 fails:
- Independent following steps → Execute with note that Step 2 was skipped
- Dependent following steps → Either adapt or halt
- Final output → Include "partial" marker for human review

Error propagation decision matrix:
  Step dependency  │ Independent │ Dependent │ Critical
  ─────────────────┼─────────────┼───────────┼──────────
  Continue chain   │     ✅      │    ⚠️     │    ❌
  Flag for review  │     ⚠️      │    ✅     │    ❌
  Halt chain       │     ❌      │    ⚠️     │    ✅
```

### Fallback Prompt Template

```
## Fallback Mode
The primary approach failed. Use this simplified fallback:

1. Generate a basic version (skip complex analysis)
2. Focus on correctness over completeness
3. If you cannot complete, state: "Partial result — [what's missing]"

Reason for fallback: {error_details}
```

---

## 11. Best Practices

### Design Principles

- **Each step has one job** — focused prompts outperform sprawling instructions
- **Validate at every boundary** — use structured output (JSON schema) between steps
- **Default to prompt chaining** — try chains before full agent loops (Anthropic recommendation)
- **Keep steps independent** — minimize coupling between steps for reusability
- **Design for observability** — log everything from the start

### Prompt Design for Chains

- **Step prompts should be self-contained** — include all context the step needs
- **Be explicit about output format** — each step should produce expected structure
- **Include context from previous steps** — but only what's relevant
- **Use consistent formatting** — schemas, markers, delimiters

### Production Considerations

- **Set timeouts per step** — prevent one slow step from blocking the chain
- **Implement retry with backoff** — transient failures happen
- **Budget tokens per chain** — total cost should be bounded
- **Cache deterministic steps** — if same input produces same output, cache it
- **Monitor step-level metrics** — latency, token usage, success rate
- **Human-in-the-loop** for validation failures or low-confidence outputs

### Chain vs. Agent Decision Guide

| Situation | Use Chain | Use Agent |
|---|---|---|
| Clear sequential stages | ✅ | ❌ |
| Dynamic tool selection needed | ❌ | ✅ |
| High reliability required | ✅ | ⚠️ |
| Open-ended exploration | ❌ | ✅ |
| Fixed budget and latency | ✅ | ⚠️ |
| Complex error recovery | ⚠️ | ✅ |

### Common Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| No validation | Bad data propagates silently | Add validation gates at every boundary |
| Tight coupling | Changing one step breaks others | Pass minimal context; use schemas |
| Over-fragmentation | Many tiny steps with high overhead | Each step should do meaningful work |
| Ignoring errors | Chain continues with garbage | Add error handling per step |
| No observability | Can't debug failures | Log inputs, outputs, validation per step |
| Context loss | Later steps lack context from early steps | Pass summaries forward |

---

## 12. Resources

### Official Documentation
- Anthropic: "Building Effective Agents" (2024) — recommends chains before agents
- LangChain: "LLM Workflows: Patterns, Tools & Production Architecture" (2026)
- AWS: "Workflow for Prompt Chaining" (Prescriptive Guidance)

### Guides and Articles
- GitHub: `aadhil96/agentic-workflow-patterns` — pattern implementations
- LangChain/LangGraph documentation — chaining and orchestration frameworks
- Anthropic: "Prompt Chaining" examples in documentation

### Related Topics in This Knowledge Base
- **Section 01** — AI Agent Architecture (when to use agents vs chains)
- **Section 02** — Subagent Architectures (pipeline topology)
- **Section 03** — Multi-Agent Systems (parallelization patterns)
- **Section 04** — Tool-Use Prompting (tools used in chain steps)
