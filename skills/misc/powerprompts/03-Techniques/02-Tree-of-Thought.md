# Tree-of-Thought Prompting

> *Exploring multiple reasoning paths simultaneously — like a search tree for thinking.*

## Table of Contents

1. [What Is Tree-of-Thought?](#what-is-tree-of-thought)
2. [How ToT Works](#how-tot-works)
3. [Breadth-First vs Depth-First Search](#breadth-first-vs-depth-first-search)
4. [Multi-Perspective Prompting](#multi-Perspective-Prompting)
5. [ToT vs CoT: The Game of 24 Benchmark](#tot-vs-cot-the-game-of-24-benchmark)
6. [Implementation Patterns](#implementation-patterns)
7. [Graph-of-Thought](#graph-of-thought)
8. [When to Use ToT](#when-to-use-tot)
9. [Cost and Trade-offs](#cost-and-trade-offs)
10. [References](#references)

---

## What Is Tree-of-Thought?

**Tree-of-Thought (ToT)** extends Chain-of-Thought by exploring *multiple* reasoning paths simultaneously, organized as a search tree. Introduced by Yao et al. (Princeton/DeepMind, NeurIPS 2023), it frames problem-solving as a tree search where each node is a partial solution or state.

### Core Concept

While CoT follows a single linear path:
```
CoT: Step 1 → Step 2 → Step 3 → ... → Answer
```

ToT branches out, evaluates multiple options at each step, and can backtrack:
```
ToT:
        ┌──→ State B1 ──→ State C1 ──→ ...
        │
Start ──┼──→ State B2 ──→ State C2 ──→ ... ──→ Answer
        │
        └──→ State B3 ──→ State C3 ──→ ...
```

### The Four Components of ToT

| Component | Description |
|-----------|-------------|
| **Thought decomposition** | How to break the problem into intermediate steps (nodes) |
| **State evaluator** | How to score/rank partial solutions (which branches to keep) |
| **Search strategy** | BFS, DFS, or best-first (order of exploration) |
| **Branching factor** | How many alternatives to consider at each step |

---

## How ToT Works

### The ToT Process

```
For each step in the problem-solving process:

1. GENERATE: Propose N alternative next-thoughts from the current state
2. EVALUATE: Score each alternative (promising / unpromising / intermediate)
3. SELECT: Keep the top-K alternatives for further exploration
4. EXPAND: For each kept alternative, repeat the process
5. TERMINATE: Stop when a branch reaches a solution or hits depth limit
```

### Example: Game of 24

Problem: Use 4 numbers (e.g., 4, 9, 10, 13) with basic arithmetic to reach 24.

**CoT approach:** Try one sequence and hope it works.
**ToT approach:** Try many sequences, evaluate partial equations, prune bad branches.

```
Start: [4, 9, 10, 13]

Level 1 (choose two numbers, apply operation):
  ├── 4 + 9 = 13 → remaining: [10, 13, 13]  ← Promising (13 is close to 24)
  ├── 4 × 9 = 36 → remaining: [10, 13, 36]  ← Unpromising (too large)
  ├── 13 - 4 = 9 → remaining: [9, 9, 10]    ← Promising (pair of 9s)
  ├── 13 ÷ 4 ≈ 3.25 → remaining: [3.25, 9, 10] ← Unpromising (fractions)
  ...

Level 2 (continue from promising branches):
  From [10, 13, 13]:
    ├── 10 + 13 = 23 → remaining: [13, 23]  ← Very promising
    ├── 13 - 10 = 3  → remaining: [3, 13]
    ...
  From [9, 9, 10]:
    ├── 9 + 9 = 18  → remaining: [10, 18]
    ├── 10 - 9 = 1  → remaining: [1, 9]
    ...

Level 3 (final steps):
  From [13, 23]: 23 - 13 = 10? No. 23 + 13 = 36? No.
  But: 13 + 10 = 23, then 23 + (13 ÷ 13) = 24? No, 13 used twice.
  ...
```

### Thought Decomposition Strategies

| Strategy | When to Use | Example |
|----------|-------------|---------|
| **Intermediate equations** | Math, logic puzzles | Partial equation state |
| **Sub-questions** | QA, reasoning | "What do we know about X?" |
| **Plan steps** | Task planning | "First gather requirements" |
| **Hypotheses** | Scientific reasoning | "Possible explanation: ..." |
| **Code states** | Debugging | "After line 10, variables are: ..." |

### State Evaluation Techniques

| Method | How It Works | When to Use |
|--------|-------------|-------------|
| **LLM self-evaluate** | Ask LLM to rate each branch as promising/unpromising | General purpose |
| **Heuristic scoring** | Use a simple rule (e.g., "closest to 24") | Well-defined domains |
| **Voting** | Multiple evaluations, take majority | Reducing evaluation noise |
| **Value function** | Train/scaffold a separate evaluator | Production systems |

---

## Breadth-First vs Depth-First Search

### Breadth-First Search (BFS)

Explores all branches at the current depth before going deeper.

```
Level 1: [A1, A2, A3] ← Evaluate all 3
Level 2: [B1, B2, B3, B4, B5, B6] ← Evaluate all 6
Level 3: [C1, C2, ...] ← Continue
```

**When to use BFS:**
- The solution is likely at a moderate depth
- You want to guarantee finding the best solution
- The branching factor is manageable (3-5 alternatives per step)
- You have sufficient budget (BFS is token-expensive)

**Advantages:** Completeness (finds solution if one exists), optimality (shortest path)
**Disadvantages:** High memory/token usage, can explore many unpromising paths

### Depth-First Search (DFS)

Explores one branch to completion before trying alternatives.

```
A1 → B1 → C1 → D1 → (solution or dead end)
Backtrack to C, try C2 → D2 → ...
Backtrack to B, try B2 → ...
```

**When to use DFS:**
- Solutions are deep (many reasoning steps required)
- You want to find *a* solution quickly, not necessarily the best
- Token budget is limited
- Early pruning is reliable

**Advantages:** Lower memory usage, finds deep solutions efficiently
**Disadvantages:** Can get stuck in deep unfruitful branches, may miss better shallow solutions

### Comparison Table

| Factor | BFS | DFS |
|--------|-----|-----|
| Token cost | Higher (explores more nodes) | Lower (focused paths) |
| Memory | Higher (keeps all branches) | Lower (tracks one path) |
| Completeness | Yes, finds solution if exists | Yes, with backtracking |
| Optimality | Yes (shortest path) | No (first found) |
| Best for | Shallow solutions, wide search | Deep solutions, narrow search |
| Branching factor | Needs to be small (3-5) | Can handle larger (5-10) |

### Hybrid Approach: Beam Search

Keep the top-K branches (the "beam") at each level, combining BFS breadth with DFS focus.

```
Beam width = 3:

Level 1: Generate 10 branches → keep top 3
Level 2: From 3 branches, generate 10 total → keep top 3
Level 3: Continue...
```

Beam search is the most practical ToT configuration for production use — it balances exploration depth with token cost.

---

## Multi-Perspective Prompting

A lightweight alternative to full tree search: simulate multiple experts reasoning in parallel.

### The Multi-Expert Pattern

```
Three experts will solve this problem independently.
Each expert shares their reasoning step by step.
After all three have shared, they discuss differences.
Finally, they converge on a single answer.

Problem: [complex problem requiring strategic thinking]
```

### Enhanced Multi-Perspective ToT

```
You are a panel of three experts discussing this problem:

1. A LOGICIAN who approaches problems analytically,
   using formal reasoning and verifiable steps.

2. A CREATIVE THINKER who generates novel approaches,
   considers unconventional solutions, and finds analogies.

3. A CRITIC who evaluates each proposed approach,
   identifies flaws, and stress-tests assumptions.

For this problem:
[problem]

Round 1: Each expert proposes their approach.
Round 2: The critic analyzes each approach, identifying strengths and weaknesses.
Round 3: The panel synthesizes the best elements into a final solution.

Final Answer:
```

### When Multi-Perspective Works Best

- Strategic decisions with multiple valid approaches
- Ethical dilemmas requiring balanced consideration
- Creative problem-solving where different angles matter
- Analysis tasks where confirmation bias is a risk

---

## ToT vs CoT: The Game of 24 Benchmark

The most striking demonstration of ToT's advantage comes from the Game of 24 benchmark.

### The Task

Use four numbers and basic arithmetic operations (+, -, ×, ÷) to reach exactly 24.

### Benchmark Results (Yao et al., 2023)

| Method | Game of 24 Success Rate |
|--------|------------------------|
| Standard prompting (no reasoning) | 0% |
| Chain-of-Thought (single path) | 4% |
| CoT + Self-Consistency (k=10) | ~12% |
| Tree-of-Thought (BFS, b=5) | 74% |

### Why Such a Dramatic Difference?

| Factor | CoT (4%) | ToT (74%) |
|--------|----------|-----------|
| Exploration | One path, no alternatives | Multiple branches |
| Error recovery | Wrong step = wrong answer | Backtrack from dead ends |
| Evaluation | None during process | Every step evaluated |
| Search | None (linear generation) | Systematic tree search |
| Pruning | None | Cut bad branches early |

### Other Benchmarks

| Task | CoT | ToT | Gain |
|------|-----|-----|------|
| Game of 24 | 4% | 74% | +70 pp |
| Mini Crosswords (5×5) | ~10% | ~50% | +40 pp |
| Creative writing (planning) | Moderate | Higher quality | Qualitative |

---

## Implementation Patterns

### Pattern 1: Sequential Simulation (Single Prompt)

Best for: Simple ToT with low branching factor, limited budget.

```
You are solving a problem using tree search.

Current state: [description of current state]
Generate 3 possible next steps. For each, rate:
- Likely to lead to solution (1-5)
- Why this step makes sense

Step options:
1. [option A] — Rating: [x] — Reasoning: [...]
2. [option B] — Rating: [x] — Reasoning: [...]
3. [option C] — Rating: [x] — Reasoning: [...]

Select the highest-rated option and proceed.
Then repeat: generate, evaluate, select.
```

### Pattern 2: Multi-Turn Implementation (Programmatic)

Best for: Full ToT with proper search control.

```python
def tree_of_thought(problem, max_depth=5, beam_width=3, branches=3):
    """Beam-search ToT implementation."""
    states = [(problem, 0)]  # (state, depth)

    for depth in range(max_depth):
        candidates = []
        for state, _ in states:
            prompt = f"""Current progress: {state}
Problem: {problem}
Generate {branches} distinct next steps.
For each step, provide the reasoning and resulting state.

Step 1:
Reasoning: ...
Resulting state: ...

Step 2:
...
"""
            response = llm(prompt, temperature=0.7)
            next_states = parse_states(response)
            candidates.extend(next_states)

        # Evaluate candidates
        scores = []
        for candidate in candidates:
            score_prompt = f"""Rate this state as promising (likely to lead to solution),
unpromising (unlikely), or intermediate (need more info).

Problem: {problem}
State: {candidate}

Rating:"""
            score = llm(score_prompt)
            scores.append(parse_score(score))

        # Keep top-K
        ranked = sorted(zip(candidates, scores),
                       key=lambda x: x[1], reverse=True)
        states = ranked[:beam_width]

        # Check for solution
        for state, _ in states:
            if is_solution(state, problem):
                return state

    return max(states, key=lambda x: x[1])[0]
```

### Pattern 3: Self-Evaluation ToT

```
For each possible next step, evaluate:

Step: [proposed next step]
Evaluation:
- Is this step valid? [Yes/No]
- Does it move toward the goal? [Yes/Partially/No]
- Potential issues: [list]
- Overall rating (1-10): [rating]

Only continue with steps rated 7+.
If no step rates 7+, backtrack to a previous state.
```

---

## Graph-of-Thought (GoT)

An extension beyond trees to arbitrary graph structures. Introduced as a generalization where:

- **CoT** = single path
- **ToT** = tree (one parent, multiple children)
- **GoT** = graph (multiple parents, multiple children, merging paths)

GoT enables:
- **Aggregation**: Combine insights from multiple branches
- **Cyclic reasoning**: Revisit and revise earlier ideas
- **Multi-source synthesis**: Merge parallel reasoning tracks

### GoT vs ToT vs CoT

| Aspect | CoT | ToT | GoT |
|--------|-----|-----|-----|
| Structure | Linear chain | Tree (divergent) | Graph (convergent + divergent) |
| Backtracking | No | Yes | Yes |
| Branch merging | No | No | Yes |
| Complexity | O(n) | O(b^d) | O(v+e) |
| Best for | Simple reasoning | Search problems | Synthesis, iterative refinement |

---

## When to Use ToT

### ToT Is Worth the Overhead When:

| Criteria | Example |
|----------|---------|
| Multiple valid paths exist | Strategic planning, creative design |
| Error recovery is critical | Code generation, mathematical proof |
| Strategic planning required | Chess, resource allocation |
| Constraint satisfaction | Scheduling, puzzles |
| Evaluation is cheap | Well-defined goal state |

### ToT Is NOT Worth It When:

| Criteria | Example |
|----------|---------|
| Single correct path | Simple arithmetic |
| Pure recall needed | Factual QA |
| Token budget is tight | High-volume production |
| Task is easy | Basic classification |

### Decision Guide

```
Is the task multi-step reasoning?
├── No → Standard prompting
└── Yes → Is there one obvious correct path?
    ├── Yes → Chain-of-Thought
    └── No → Can you evaluate partial solutions?
        ├── No → Multi-Perspective Prompting (lightweight ToT)
        └── Yes → Are branches independent?
            ├── Yes → Parallel ToT (BFS)
            └── No → Sequential ToT (DFS)
```

---

## Cost and Trade-offs

### Token Cost Comparison

| Method | Cost per Query (relative) | Quality |
|--------|--------------------------|---------|
| Standard | 1× | Baseline |
| CoT | 2-5× | +15-40% |
| CoT + Self-Consistency (k=5) | 10-25× | +25-50% |
| ToT (beam=3, depth=3) | 15-50× | +30-70% |
| Full BFS ToT | 50-200× | Highest |

### Optimization Tips

- **Reduce branching factor**: 2-3 branches instead of 5
- **Shallow search**: Depth 2-3 often captures most gains
- **Early termination**: Stop as soon as a clear solution emerges
- **Cache evaluations**: Reuse state evaluations for identical states
- **Progressive deepening**: Start with shallow search, deepen as needed

---

## References

- Yao et al.: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" (NeurIPS 2023) — arXiv:2305.10601
- Wei et al.: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (NeurIPS 2022) — arXiv:2201.11903
- Besta et al.: "Graph of Thoughts: Solving Elaborate Problems with Large Language Models" (2023) — arXiv:2308.09687
- Wang et al.: "Self-Consistency Improves Chain of Thought Reasoning" (ICLR 2023) — arXiv:2203.11171
