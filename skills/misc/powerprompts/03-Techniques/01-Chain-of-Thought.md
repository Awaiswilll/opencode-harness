# Chain-of-Thought Prompting

> *"Think step by step" — the simplest, most impactful prompting technique ever discovered.*

## Table of Contents

1. [What Is Chain-of-Thought?](#what-is-chain-of-thought)
2. [Zero-Shot Chain-of-Thought](#zero-shot-chain-of-thought)
3. [Few-Shot Chain-of-Thought](#few-shot-chain-of-thought)
4. [Self-Consistency](#self-consistency)
5. [Structured CoT Patterns](#structured-cot-patterns)
6. [Advanced CoT Variants](#advanced-cot-variants)
7. [When CoT Works Best (and Why)](#when-cot-works-best-and-why)
8. [CoT for Reasoning Models](#cot-for-reasoning-models)
9. [Common Pitfalls](#common-pitfalls)
10. [References](#references)

---

## What Is Chain-of-Thought?

**Chain-of-Thought (CoT)** prompting instructs the model to produce intermediate reasoning steps before arriving at a final answer. Introduced by Wei et al. at Google Research (NeurIPS 2022), it transformed LLM reasoning capability overnight.

**The Core Insight:** LLMs are much better at reasoning when they externalize their thought process. Instead of jumping directly to an answer, they work through sub-problems, and each intermediate step provides scaffolding for the next.

| Metric | Without CoT | With CoT | Improvement |
|--------|------------|----------|-------------|
| PaLM 540B on GSM8K | 17.7% | 78.7% | +61.0 pp |
| GPT-3 (175B) on GSM8K | ~15% | ~60% | +45 pp |
| Accuracy on math/logic tasks | Baseline | +15-40% | Typical range |

---

## Zero-Shot Chain-of-Thought

The simplest form: just append a reasoning trigger phrase to any problem.

### The Classic Trigger

```
Let's think step by step.
```

Kojima et al. (2022) showed this single phrase improves reasoning accuracy dramatically across arithmetic, symbolic, and commonsense tasks.

### How Simple It Is

```
Q: A bat and a ball cost $1.10. The bat costs $1.00 more than the ball.
How much does the ball cost?
Let's think step by step.
```

Without CoT, most models answer "10 cents" (the intuitive but wrong answer). With CoT, they reason correctly.

### Alternative Trigger Phrases

```
- Let's work through this carefully.
- Let's approach this methodically.
- I'll solve this step by step.
- First, let's break this down.
- Let's think about this logically.
```

### When Zero-Shot CoT Works

| Task Type | Effectiveness |
|-----------|--------------|
| Arithmetic word problems | High |
| Symbolic reasoning | High |
| Commonsense reasoning | Moderate |
| Factual recall | Low (CoT doesn't help memory) |
| Creative writing | Negative (can over-structure) |

### Why It Works

Zero-shot CoT triggers the model's pretrained reasoning capabilities. During training, the model has seen countless examples of step-by-step reasoning. The trigger phrase activates this latent ability without needing in-context examples.

---

## Few-Shot Chain-of-Thought

Provide 2-5 examples showing explicit reasoning chains, then ask the model to follow the pattern.

### Basic Few-Shot CoT

```
Solve each problem step by step.

Problem: John has 24 apples. He gives half to Mary, then eats 3.
How many remain?

Step 1: Start with 24 apples.
Step 2: Half to Mary → 24 / 2 = 12 apples given away.
Step 3: Remaining after giving: 24 - 12 = 12 apples.
Step 4: Eats 3 → 12 - 3 = 9 apples.
Answer: 9

Problem: Sarah has 45 stickers. She gives 1/3 to her friend,
then buys 10 more. How many stickers does she have now?
```

### Structured Few-Shot Template

```
Task: Solve math word problems step by step.

Format:
Step 1: [first logical step]
Step 2: [next step building on step 1]
...
Answer: [final answer]

Example 1:
Input: [problem]
Output:
Step 1: ...
Step 2: ...
Answer: ...

Example 2:
Input: [problem]
Output:
Step 1: ...
Step 2: ...
Answer: ...

Now solve:
Input: [target problem]
Output:
```

### Example Selection Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| Random sampling | Pick random examples | Baseline, general tasks |
| Semantic similarity | Pick examples closest to query | Classification, reasoning |
| Diversity sampling | Cover different problem types | Broad-coverage systems |
| Hard examples | Pick the most difficult cases | Pushing model capability |
| Edge cases | Include boundary conditions | Production robustness |

**Research finding:** Example ordering matters. Place your strongest/most representative example last (recency bias).

---

## Self-Consistency

Sample *multiple* reasoning paths, then take the majority vote (Wang et al., ICLR 2023).

### Why Self-Consistency Works

Single CoT paths can make arithmetic errors, skip steps, or drift off course. By sampling many paths (with temperature > 0), the model explores different reasoning strategies. The most common answer across paths is significantly more reliable.

| Method | GSM8K Accuracy | Improvement vs Base CoT |
|--------|---------------|------------------------|
| CoT (single path) | ~60% | — |
| Self-Consistency (k=5) | ~72% | +12 pp |
| Self-Consistency (k=10) | ~78% | +18 pp |
| Self-Consistency (k=40) | ~82% | +22 pp |

### Implementation Patterns

**Pattern 1: Sequential Sampling (single call)**

```
Generate 5 different reasoning paths for this problem.
For each path, show step-by-step reasoning and a final answer.
Then, select the most common answer across all paths as the final answer.

Problem: [problem]
```

**Pattern 2: Parallel Sampling (multi-call, recommended)**

Make N independent API calls with `temperature=0.7`, each with:

```
Solve step by step:
[problem]
```

Then aggregate answers programmatically:

```python
from collections import Counter

def self_consistency(problem, n=5):
    responses = []
    for _ in range(n):
        response = llm.generate(f"Solve step by step:\n{problem}",
                                temperature=0.7)
        answer = extract_answer(response)
        responses.append(answer)
    return Counter(responses).most_common(1)[0][0]
```

### Optimal Parameters

| Parameter | Setting |
|-----------|---------|
| Number of paths (k) | 5-10 (diminishing returns beyond) |
| Temperature | 0.5-0.8 (lower for math, higher for creative) |
| Top-p | 0.9-1.0 |
| Aggregation method | Majority vote (best), marginal vote, or weighted vote |

### Variant: Weighted Self-Consistency

Weight each path by a confidence score (e.g., inverse of perplexity, or self-reported confidence):

```
For each path, rate your confidence (1-10) after providing the answer.
Then select the answer with the highest total confidence.
```

---

## Structured CoT Patterns

Beyond "step by step" — specific structures for different reasoning needs.

### 1. Deliberate Over-Instruction Pattern

```
Before answering, I want you to:
1. Restate the problem in your own words
2. Identify what information is given and what is being asked
3. Consider potential pitfalls or edge cases
4. Solve step by step
5. Verify your solution against the original problem
6. Provide your final answer
```

### 2. Verification-Integrated CoT

```
Solve, then verify each step:

Step 1: [assumption or given fact]
Step 2: [deduction from step 1] ✓ Verify: Is this logically sound?
Step 3: [deduction from step 2] ✓ Verify: Is this consistent with the goal?
...
Final Answer: [answer]
```

### 3. Multi-Perspective CoT

```
Consider this problem from three perspectives:

PERSPECTIVE A: [mathematical/analytical approach]
PERSPECTIVE B: [intuitive/heuristic approach]
PERSPECTIVE C: [analogical/pattern-matching approach]

After all three, synthesize: Which perspective gives the most reliable answer?
```

### 4. Nested CoT (Sub-problem Decomposition)

```
Let's decompose this into sub-problems:

Main problem: [complex problem]

Sub-problem 1: [smaller chunk]
  Reasoning: ...
  Answer 1: ...

Sub-problem 2: [builds on answer 1]
  Reasoning: ...
  Answer 2: ...

Sub-problem 3: [builds on answer 2]
  Reasoning: ...
  Answer 3: ...

Synthesis: Combine answers 1-3 to solve the main problem.
Final Answer:
```

### 5. Chain-of-Verification (CoVe)

Generate an answer, then verify each factual claim independently (Dhuliawala et al., 2023):

```
Step 1 — Generate answer: [initial answer]
Step 2 — Extract claims: List every factual statement in the answer.
Step 3 — Verify each claim:
  Claim 1: [fact] → Verified? [yes/no/uncertain]
  Claim 2: [fact] → Verified? [yes/no/uncertain]
  ...
Step 4 — Revise: Produce a corrected answer addressing any unverified claims.
```

---

## Advanced CoT Variants

### Chain-of-Symbol (CoS)

Replace natural language descriptions with symbolic representations to reduce token usage and improve precision:

```
Instead of: "There are 5 blocks. Block A is to the left of Block B..."
Use: A → B → C ← D → E
```

Best for: Spatial reasoning, puzzle solving, state-transition problems.

### Chain-of-Thought with Self-Correction

```
Solve the problem step by step.
After each step, ask yourself: "Does this follow logically from the previous step?"
If not, correct course before proceeding.
```

### Contrastive Chain-of-Thought

Show both correct AND incorrect reasoning chains (empirically among the most effective techniques for software engineering tasks):

```
✅ CORRECT APPROACH:
Input: [example]
Reasoning: [correct step-by-step]
Output: [correct answer]

❌ INCORRECT APPROACH:
Input: [example]
Reasoning: [flawed reasoning with explanation of why it's wrong]
Output: [wrong answer]

Now follow the correct approach:
Input: [target]
```

### Skeleton-of-Thought

Generate an outline first, then flesh out each section (ICLR 2024):

```
Step 1: Create a brief outline of the key points needed to answer.
Step 2: Expand each outline point into a complete reasoning step.
Step 3: Synthesize the full answer.
```

---

## When CoT Works Best (and Why)

### Sweet Spots

| Task Category | CoT Effectiveness | Why |
|--------------|-------------------|-----|
| Arithmetic/math word problems | ★★★★★ | Multi-step computation benefits from intermediate values |
| Logical reasoning | ★★★★★ | Each step builds a verifiable chain |
| Multi-hop QA | ★★★★☆ | Tracing entity relationships step by step |
| Code debugging | ★★★★☆ | Following execution path step by step |
| Strategic planning | ★★★★☆ | Exploring decision consequences |
| Factual QA | ★★☆☆☆ | CoT doesn't help recall facts not in training data |
| Creative writing | ★☆☆☆☆ | Over-structuring harms fluency |
| Classification | ★★☆☆☆ | Usually doesn't need reasoning |

### Why CoT Works

**1. Decomposes complexity.** Breaking a hard problem into easier sub-problems makes each step manageable.

**2. Provides working memory.** Intermediate steps act as a scratchpad — the model doesn't need to hold everything in its hidden state.

**3. Enables error detection.** When the model writes "24 / 2 = 12", both the model and the user can verify each operation.

**4. Activates reasoning circuits.** The sequential token generation process of LLMs is naturally suited to step-by-step reasoning. CoT aligns the output format with the model's strengths.

**5. Reduces shortcut bias.** Without CoT, models often pattern-match to superficial features. CoT forces deliberate processing.

### Limitations

- **Cost:** CoT uses 2-10x more tokens (and thus more compute)
- **Latency:** Sequential reasoning takes longer
- **Overthinking:** Simple tasks don't need step-by-step — CoT can introduce errors
- **Information retrieval:** CoT cannot bootstrap knowledge the model doesn't have
- **Reasoning models:** CoT is less impactful on models with built-in reasoning (o1, R1, Claude Opus 4)

---

## CoT for Reasoning Models

Modern reasoning models (OpenAI o1/o3, DeepSeek R1, Claude Opus 4) have internal chain-of-thought. Explicit CoT in the prompt can conflict with their built-in reasoning.

### Best Practices for Reasoning Models

```
Instead of: "Let's think step by step"
Use: Set `reasoning_effort` or `thinking.budget_tokens` parameter

Instead of: Explicit CoT instructions
Use: Clear problem statement + output format requirements
```

| Model | CoT Parameter | Notes |
|-------|--------------|-------|
| OpenAI o1/o3 | `reasoning_effort: low/medium/high` | Higher = more internal CoT |
| DeepSeek R1 | `thinking.budget_tokens` | Controls internal thinking budget |
| Claude Opus 4 | Extended thinking mode | Enable via API, skip explicit CoT |

When using reasoning models, provide:
1. The problem
2. Constraints
3. Output format
4. Leave the "how" to the model's internal reasoning

---

## Common Pitfalls

| Pitfall | Problem | Fix |
|---------|---------|-----|
| Over-prompting | Too many constraints in CoT confuse the model | Simplify: "Solve step by step" is usually enough |
| Wrong temperature | Temperature=0 for CoT (no diversity) | Use 0.3-0.7 for sampling variance |
| Missing verification | Model propagates early errors | Add verification steps or use Self-Consistency |
| CoT on simple tasks | 2+2 = let's think step by step... | Only use CoT when decomposition helps |
| Fixed examples | Same few-shot examples for all queries | Use dynamic example selection |
| Ignoring format | Answer buried in reasoning | Clearly separate reasoning from final answer |

---

## References

- Wei et al.: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (NeurIPS 2022) — arXiv:2201.11903
- Kojima et al.: "Large Language Models are Zero-Shot Reasoners" (2022) — arXiv:2205.11916
- Wang et al.: "Self-Consistency Improves Chain of Thought Reasoning in Language Models" (ICLR 2023) — arXiv:2203.11171
- Dhuliawala et al.: "Chain-of-Verification Reduces Hallucination in Large Language Models" (2023) — arXiv:2309.11495
- Zhou et al.: "Least-to-Most Prompting Enables Complex Reasoning in Large Language Models" (ICLR 2023)
- arXiv 2025: Empirical study of contrastive CoT for software engineering tasks
