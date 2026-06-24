# Technique Selector

> *Which prompting technique should you use? A quick reference guide.*

## Table of Contents

1. [Quick Reference Table](#quick-reference-table)
2. [Decision Flowchart](#decision-flowchart)
3. [Technique Selection by Task Type](#technique-selection-by-task-type)
4. [Selection by Constraint](#selection-by-constraint)
5. [Technique Compatibility Matrix](#technique-compatibility-matrix)
6. [Common Anti-Patterns](#common-anti-patterns)

---

## Quick Reference Table

| You Need This | Primary Technique | Secondary / Combo | Chapter |
|--------------|-------------------|-------------------|---------|
| Reliable multi-step reasoning | Chain-of-Thought | + Self-Consistency for reliability | 01 |
| Explore multiple solution paths | Tree-of-Thought | + Multi-Perspective for lighter version | 02 |
| Agent that uses tools | ReAct | + Reflection for quality | 03 |
| Generate/optimize prompts automatically | Meta-Prompting | + DSPy for automated optimization | 04 |
| Control response style | Style Prompting | + Persona for depth | 05 |
| Match audience knowledge level | Audience Prompting | + Style for voice | 05 |
| Activate domain expertise | Persona Engineering | + CoT for reasoning | 05 |
| Enforce strict output rules | Constraint-Based Prompting | + Self-Refine for verification | 05 |
| Stop bad response patterns | Negative/Contrastive | + Few-Shot with bad examples | 05 |
| Reduce hallucination | Generated Knowledge | + Self-Consistency | 05 |
| Teach a complex topic | Least-to-Most | + Step-Back for principles | 05 |
| Solve from first principles | Step-Back Prompting | + CoT for execution | 05 |
| Maximize info density | Chain-of-Density | Iterative refinement | 05 |
| Improve output quality | Self-Refine | + Constraint verification | 05 |
| Empathetic responses | Emotion Prompting | + Persona for authenticity | 05 |
| Ground reasoning in facts | ReAct | + Tool use for verification | 03 |
| High-stakes factual answer | Self-Consistency | + Generated Knowledge | 01 |
| Production system prompt | Meta-Prompting | + Self-Refine loop | 04 |
| Explain to a 10-year-old | Audience Prompting | + Least-to-Most | 05 |
| Debug code systematically | CoT + Self-Refine | + Least-to-Most for complex bugs | 01, 05 |

---

## Decision Flowchart

```
START: What do you need to accomplish?
│
├── REASONING TASKS
│   ├── Simple arithmetic / logic
│   │   └── → Chain-of-Thought (01)
│   │
│   ├── Complex multi-step problem
│   │   ├── Single likely path exists?
│   │   │   ├── Yes → CoT + Self-Consistency (01)
│   │   │   └── No  → Tree-of-Thought (02)
│   │   │
│   │   └── Multiple valid approaches?
│   │       └── → ToT or Multi-Perspective (02)
│   │
│   ├── Teach / explain something
│   │   └── → Least-to-Most (05) + Audience (05)
│   │
│   └── Solve from first principles
│       └── → Step-Back Prompting (05)
│
├── AGENT TASKS
│   ├── Need to use external tools?
│   │   └── → ReAct (03)
│   │
│   ├── Need multiple agents collaborating?
│   │   └── → ReAct + Orchestration (03)
│   │
│   └── Need graceful failure handling?
│       └── → ReAct with failure protocol (03)
│
├── CONTENT GENERATION
│   ├── Need a specific tone/style?
│   │   ├── Emotional register → Emotion Prompting (05)
│   │   ├── Professional voice → Style Prompting (05)
│   │   └── Expert authority  → Persona Engineering (05)
│   │
│   ├── Writing for a specific audience?
│   │   └── → Audience Prompting (05)
│   │
│   ├── Generate summaries
│   │   └── → Chain-of-Density (05)
│   │
│   └── Need to revise/generate prompts
│       └── → Meta-Prompting (04)
│
├── QUALITY IMPROVEMENT
│   ├── Current output is low quality
│   │   └── → Self-Refine / Iterative Refinement (05)
│   │
│   ├── Model fabricates information
│   │   └── → Generated Knowledge (05) + Tool Use (03)
│   │
│   ├── Model ignores format instructions
│   │   └── → Constraint-Based (05) + Contrastive examples (05)
│   │
│   └── Model adds unwanted fluff
│       └── → Negative Prompting (05)
│
└── PRODUCTION / OPTIMIZATION
    ├── Need to automate prompt engineering
    │   └── → Meta-Prompting (04) + DSPy
    │
    ├── Need reliable structured output
    │   └── → Constraint-Based (05) + Schema enforcement
    │
    └── Need to optimize prompt performance
        └── → Meta-Prompting with eval loop (04)
```

### Flowchart in Text Form

```
                     ┌──────────────────────────┐
                     │  What does your task      │
                     │  require most?             │
                     └────────────┬─────────────┘
                                  │
          ┌───────────┬───────────┼───────────┬───────────┐
          │           │           │           │           │
          ▼           ▼           ▼           ▼           ▼
     Reasoning    Acting w/   Content      Quality     Production
     & Logic      Tools       Creation    Improvement  Optimization
          │           │           │           │           │
          │           ▼           ▼           ▼           ▼
          │       ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
          │       │ ReAct   │ │ Style   │ │Self-    │ │ Meta-   │
          │       │ (03)    │ │(05)     │ │Refine   │ │Prompting│
          │       └─────────┘ └─────────┘ └─────────┘ │ (04)    │
          │                                           └─────────┘
          ▼
   ┌──────────────┐
   │ Multiple     │
   │ valid paths? │
   ├──────┬───────┤
   │ Yes  │ No    │
   │      │       │
   ▼      ▼       │
 ┌────┐ ┌────┐    │
 │ ToT│ │ CoT│    │
 │(02)│ │(01)│    │
 └────┘ └─┬──┘    │
          │       │
          ▼       │
   ┌──────────┐   │
   │ Need     │   │
   │ reliable?│   │
   ├────┬─────┤   │
   │ Yes│ No  │   │
   │    │     │   │
   ▼    │     │   │
 ┌──────┐│     │   │
 │Self- ││     │   │
 │Consis││     │   │
 │(01)  ││     │   │
 └──────┘│     │   │
         ▼     │   │
    ┌────────┐ │   │
    │ Done   │◄┘   │
    └────────┘     │
                   ▼
            ┌──────────────┐
            │ Quality OK?   │
            ├──────┬───────┤
            │ No   │ Yes   │
            │      │       │
            ▼      │       │
       ┌────────┐  │       │
       │ Self-  │  │       │
       │ Refine │  │       │
       │ (05)   │  │       │
       └────────┘  │       │
                   ▼       │
            ┌────────┐     │
            │ Done   │◄────┘
            └────────┘
```

---

## Technique Selection by Task Type

### Math & Logic

| Specific Task | Primary | Secondary |
|--------------|---------|-----------|
| Arithmetic word problems | CoT | Self-Consistency |
| Algebraic proofs | Step-Back | CoT |
| Probability/statistics | Step-Back | Generated Knowledge |
| Logical puzzles | ToT | Multi-Perspective |
| Game strategy (chess, etc.) | ToT (DFS) | Multi-Perspective |

### Code & Software Engineering

| Specific Task | Primary | Secondary |
|--------------|---------|-----------|
| Debug failing tests | ReAct | CoT |
| Code review | Persona (senior dev) | Negative (bad patterns) |
| Generate from spec | Least-to-Most | Self-Refine |
| Refactor code | Constraint-Based | Contrastive examples |
| Architecture design | ToT (BFS) | Multi-Perspective |
| API design | Step-Back | Persona (architect) |

### Content & Writing

| Specific Task | Primary | Secondary |
|--------------|---------|-----------|
| Brand blog posts | COSTAR framework | Style + Audience |
| Technical documentation | Audience Prompting | Least-to-Most |
| Creative fiction | Style + Persona | Emotion |
| Email campaigns | Audience + Emotion | Constraint (length) |
| Executive summaries | Chain-of-Density | Audience (exec) |
| Social media | Style + Constraint | Negative (no fluff) |

### Analysis & Research

| Specific Task | Primary | Secondary |
|--------------|---------|-----------|
| Competitive analysis | Step-Back (frameworks) | Multi-Perspective |
| Literature review | Generated Knowledge | Chain-of-Density |
| Data interpretation | CoT | Self-Consistency |
| Causal analysis | Step-Back | Multi-Perspective |
| Risk assessment | Multi-Persona Debate | Emotion (skeptical) |

### Customer-Facing

| Specific Task | Primary | Secondary |
|--------------|---------|-----------|
| Support tickets | Persona (support) + Emotion | Constraint (format) |
| FAQ responses | Constraint-Based | Audience Prompting |
| Onboarding emails | Audience + Style | Least-to-Most |
| Complaint resolution | Emotion Prompting | Persona (empathy) |

---

## Selection by Constraint

### When You Have Limited Budget

| Constraint | Recommended Technique | Why |
|------------|----------------------|-----|
| Low token budget | Standard prompting + Step-Back | Minimal overhead |
| Low latency requirement | Zero-shot CoT | One call, no iterations |
| Low cost target | CoT with temperature=0 | Predictable, minimal retries |
| Single API call | Audience + Style + Constraints | Combine in one prompt |

### When Quality Is Critical

| Constraint | Recommended Technique | Why |
|------------|----------------------|-----|
| Zero errors tolerated | Self-Consistency (k=10+) | Multiple verifications |
| Must cite sources | ReAct with tool use | Grounded in real data |
| Complex requirements | Constraint + Self-Refine | Multi-pass verification |
| Safety-critical | Constraint + Negative | Explicit boundaries |

### When Speed Is Critical

| Constraint | Recommended Technique | Why |
|------------|----------------------|-----|
| <500ms response | Zero-shot direct | No CoT overhead |
| <2s response | CoT (short) | Single step-by-step |
| Streaming needed | CoT without Self-Consistency | Single path, token streaming |
| High throughput | CoT + caching | Reuse common reasoning paths |

---

## Technique Compatibility Matrix

Can techniques be combined? Check compatibility before layering.

```
Technique               | CoT | ToT | ReAct | Meta | Style | Pers | Aud | Neg | GK | LtM | SB | CoD | SR
------------------------|-----|-----|-------|------|-------|------|-----|-----|----|-----|----|-----|----
Chain-of-Thought (CoT)  |  ✓  |  ✅  |   ✅   |  ✅   |   ✅   |   ✅   |  ✅   |  ✅  |  ✅ |  ✅  | ✅ |  ✅  | ✅
Tree-of-Thought (ToT)   |  ✅  |  ✓  |   ⚠️   |  ✅   |   ❌   |   ❌   |  ❌   |  ❌  |  ⚠️ |  ❌  | ❌ |  ❌  | ⚠️
ReAct                   |  ✅  |  ⚠️  |   ✓   |  ✅   |   ✅   |   ✅   |  ✅   |  ✅  |  ✅ |  ❌  | ✅ |  ❌  | ✅
Meta-Prompting (Meta)   |  ✅  |  ✅  |   ✅   |  ✓   |   ✅   |   ✅   |  ✅   |  ✅  |  ✅ |  ✅  | ✅ |  ✅  | ✅
Style Prompting (Style) |  ✅  |  ❌  |   ✅   |  ✅   |   ✓   |   ✅   |  ✅   |  ✅  |  ✅ |  ✅  | ✅ |  ✅  | ✅
Persona (Pers)          |  ✅  |  ❌  |   ✅   |  ✅   |   ✅   |   ✓   |  ✅   |  ✅  |  ✅ |  ✅  | ✅ |  ✅  | ✅
Audience (Aud)          |  ✅  |  ❌  |   ✅   |  ✅   |   ✅   |   ✅   |  ✓   |  ✅  |  ✅ |  ✅  | ✅ |  ✅  | ✅
Neg/Contrast (Neg)      |  ✅  |  ❌  |   ✅   |  ✅   |   ✅   |   ✅   |  ✅   |  ✓  |  ✅ |  ✅  | ✅ |  ✅  | ✅
Generated Knowledge (GK)|  ✅  |  ⚠️  |   ✅   |  ✅   |   ✅   |   ✅   |  ✅   |  ✅  |  ✓ |  ✅  | ✅ |  ✅  | ✅
Least-to-Most (LtM)     |  ✅  |  ❌  |   ❌   |  ✅   |   ✅   |   ✅   |  ✅   |  ✅  |  ✅ |  ✓  | ✅ |  ✅  | ✅
Step-Back (SB)          |  ✅  |  ❌  |   ✅   |  ✅   |   ✅   |   ✅   |  ✅   |  ✅  |  ✅ |  ✅  | ✓ |  ✅  | ✅
Chain-of-Density (CoD)  |  ✅  |  ❌  |   ❌   |  ✅   |   ✅   |   ✅   |  ✅   |  ✅  |  ⚠️ |  ✅  | ✅ |  ✓  | ✅
Self-Refine (SR)        |  ✅  |  ⚠️  |   ✅   |  ✅   |   ✅   |   ✅   |  ✅   |  ✅  |  ✅ |  ✅  | ✅ |  ✅  | ✓

Legend: ✅ = Compatible, ⚠️ = Compatible but expensive/complex, ❌ = Incompatible, ✓ = Self
```

### Recommended Technique Stacks

| Use Case | Stack |
|----------|-------|
| Production reasoning system | CoT → Self-Consistency → Constraint → Self-Refine |
| Autonomous research agent | ReAct → Tool Use → Self-Refine → CoT (for synthesis) |
| Brand voice content | Persona → Audience → Style → Constraint |
| Complex code generation | Step-Back → Least-to-Most → Self-Refine |
| High-quality summaries | CoT (analysis) → Chain-of-Density → Self-Refine |
| Adaptive tutoring | Audience → Least-to-Most → Generated Knowledge |
| Factual verification | Generated Knowledge → ReAct (tool search) → Self-Consistency |

---

## Common Anti-Patterns

| Anti-Pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| Using ToT for simple arithmetic | Massive token waste | Use CoT or direct answer |
| Using CoT after every prompt | Annoying verbosity | Only use when reasoning is needed |
| Self-Refine on every response | 5x latency, marginal gain | Only refine important responses |
| Stacking 6+ techniques | Conflicting instructions | Pick 2-3 compatible techniques |
| Emotion prompting for technical code | Irrelevant framing | Use Persona (engineer) instead |
| Meta-prompting for trivial tasks | Cost > value | Write prompt manually |
| ReAct without error handling | Agent gets stuck | Always include failure protocol |
| Negative prompting without examples | Ambiguous | Use contrastive examples |
| Step-back for concrete tasks | Unnecessary abstraction | Use CoT or direct approach |
| Ignoring recombinatory potential | Single technique obsession | Layer 2-3 techniques |

---

> *The best prompting technique is the simplest one that solves the problem. Start simple, measure, then add complexity only when needed.*
