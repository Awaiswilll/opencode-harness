# Shot-Learning Paradigms

> A comprehensive guide to zero-shot, few-shot, and many-shot prompting — when to use each, how to select and order examples, and dynamic selection strategies.

---

## Table of Contents

1. [Overview of Shot-Learning Paradigms](#overview-of-shot-learning-paradigms)
2. [Zero-Shot Prompting](#zero-shot-prompting)
3. [Few-Shot Prompting](#few-shot-prompting)
4. [Many-Shot Prompting](#many-shot-prompting)
5. [Dynamic Few-Shot Selection](#dynamic-few-shot-selection)
6. [Comparison and Selection Guide](#comparison-and-selection-guide)

---

## Overview of Shot-Learning Paradigms

**Shot learning** refers to how many examples are provided in the prompt to guide the model's output. The term comes from "one-shot learning" in machine learning — learning from a single example.

```
Zero-shot:  0 examples — model uses pre-trained knowledge alone
One-shot:   1 example — establishes the pattern
Few-shot:   2-10 examples — robust pattern establishment
Many-shot:  10-100+ examples — comprehensive pattern coverage
```

### The Core Trade-off

```
                    Zero-Shot       Few-Shot        Many-Shot
                    ◄───────────────┬───────────────►
Cost (tokens)         Lowest           Medium           Highest
Latency               Fastest          Moderate         Slowest
Accuracy (simple)     Good             Better           Best
Accuracy (complex)    Poor             Good             Excellent
Format reliability    Low              High             Very High
Setup effort          None             Moderate         High
```

### When Each Paradigm Was Introduced

| Paradigm | Introduced | Key Paper |
|----------|-----------|-----------|
| Zero-shot | GPT-2 (2019) | Radford et al. |
| Few-shot | GPT-3 (2020) | Brown et al., "Language Models are Few-Shot Learners" |
| Many-shot | GPT-4 Turbo (2023) | Extended context windows made it practical |
| Dynamic selection | 2023+ | Various RAG-based approaches |

---

## Zero-Shot Prompting

### What It Is

Zero-shot prompting provides **no examples**. The model relies entirely on its pre-trained knowledge and the instructions in the prompt to produce the correct output.

```
Task: Classify the sentiment of this product review as
Positive, Negative, or Neutral.

Review: {review_text}
Sentiment:
```

### When Zero-Shot Works Best

| Task Type | Example | Expected Accuracy |
|-----------|---------|-------------------|
| Simple classification | Spam detection | 90-95% |
| Well-known formats | Translation | 85-95% |
| Common knowledge Q&A | Capital cities | 90-98% |
| Simple extraction | Email addresses | 85-95% |
| Rephrasing | Simplify text | 80-90% |

### When Zero-Shot Fails

| Task Type | Example | Failure Mode |
|-----------|---------|-------------|
| Novel format | Proprietary data schema | Wrong structure |
| Nuanced domain | Legal contract analysis | Misses subtleties |
| Edge cases | Rare classification categories | Inconsistent |
| Precise formatting | API response templates | Format drift |
| Ambiguous tasks | "Write a good email" | Unpredictable output |

### Zero-Shot Template Patterns

#### Pattern 1: Direct Instruction

```
Task: [clear verb-led instruction]
Input: {input}
Output:
```

#### Pattern 2: Role + Task

```
You are a [role]. Your job is to [task].
[input]
```

#### Pattern 3: Question-Answer

```
Q: {question}
A:
```

#### Pattern 4: Chain-of-Thought (Zero-Shot CoT)

```
[problem]
Let's think step by step.
```

Adding "Let's think step by step" improves zero-shot reasoning by 15-40% on math/logic tasks (Kojima et al., 2022).

### Zero-Shot Prompt Design Principles

1. **Be explicit about the task** — don't assume the model infers it
2. **Define the output format** — specify structure even for "obvious" outputs
3. **Use the right level of specificity** — "Classify as Positive/Negative/Neutral" is better than "Tell me the sentiment"
4. **Add constraints proactively** — zero-shot has no examples to correct mistakes
5. **Test with temperature = 0 first** — establishes a baseline before adding creativity

### Zero-Shot Checklist

- [ ] Task is clearly stated with an imperative verb
- [ ] Output format is specified (not assumed)
- [ ] Constraints are explicit, not vague
- [ ] The model has all necessary context
- [ ] Task complexity is appropriate for no examples
- [ ] Edge cases are addressed in advance

---

## Few-Shot Prompting

### What It Is

Few-shot prompting provides **2-10 examples** of the desired input-output pattern. Examples serve as implicit instructions — the model infers the task and format from the pattern.

```
Classify the topic of each message.

Message: "The server is down again. Can someone fix it?"
Topic: Technical Support

Message: "I'd like to upgrade my plan to the enterprise tier."
Topic: Account Management

Message: "When will the new features be available?"
Topic: Product Inquiry

Message: "Your billing system charged me twice!"
Topic:
```

### How Examples Work

Examples serve three functions:

1. **Format demonstration** — shows the exact output structure
2. **Pattern inference** — establishes the transformation rule
3. **Edge case coverage** — hints at boundary handling

### Example Selection Strategies

#### Strategy 1: Representative Sampling

Pick examples that cover the most common cases.

```
Task: Classify customer inquiries

Selected examples:
- "Where is my order?" → Order Status (most common)
- "I want a refund" → Refund (second most common)
- "My account is locked" → Account Issue (third most common)
```

**Best for:** Uniform distributions, well-understood categories

#### Strategy 2: Diverse Coverage

Pick examples that span the full range of possible inputs.

```
Task: Extract product attributes from text

Selected examples:
- "The iPhone 15 costs $799" → brand, product, price
- "This dress is available in red, blue, green" → product, colors
- "The 2026 Toyota Camry gets 35 MPG" → brand, model, year, spec
- "Out of stock - will ship in 2 weeks" → availability, shipping
```

**Best for:** Broad domain coverage, heterogeneous inputs

#### Strategy 3: Edge Case Emphasis

Include examples that test boundary conditions.

```
Task: Moderate user comments

Selected examples:
- "Great article!" → Approve (typical)
- "This is terrible" → Approve (negative but acceptable)
- "I hate this @#$% website" → Flag (profanity)
- "Visit http://spam.com for cheap meds" → Flag (spam)
- "The CEO is a criminal who..." → Flag (defamation)
```

**Best for:** Safety, moderation, quality control

#### Strategy 4: Contrastive Examples

Show both good and bad examples to teach what NOT to do.

```
✅ Good example:
Input: "What's the refund policy?"
Output: "Refunds are available within 30 days of purchase.
Contact support@example.com with your order number."
  ← Direct, no preamble, immediately useful

❌ Bad example:
Input: "What's the refund policy?"
Output: "Sure! I'd be happy to help you with that! Let me
look into our refund policy for you. So, generally speaking..."
  ← Avoid this — too much preamble, no direct answer
```

**Best for:** Teaching style/tone constraints, avoiding bad patterns

#### Strategy 5: Similarity-Based Selection (Dynamic)

Embed the query and find the most similar examples from a pool (see [Dynamic Few-Shot Selection](#dynamic-few-shot-selection) below).

**Best for:** Non-uniform distributions, large example pools

### Example Ordering

**Position matters significantly.** The last example has the strongest influence due to recency bias.

```
Position:  [Example 1] [Example 2] [Example 3] [Example 4]
Influence:  20%          25%          25%          30%
```

**Ordering guidelines:**

| Goal | Strategy |
|------|----------|
| Format consistency | Place most common example last |
| Edge case handling | Place edge case example last |
| Diverse output | Place most important variant last |
| General purpose | Randomize or use round-robin |

**The "Best Last" rule:**

```
Place the example that most closely matches what you want
the model to do in the LAST position.

Example set for a coding task:
1. Simple function (establishes basic pattern)
2. Function with error handling (adds complexity)
3. Function with error handling + input validation (MOST IMPORTANT — last)
```

### Few-Shot Format Patterns

#### Pattern 1: Simple Paired

```
Input: {input_1}
Output: {output_1}

Input: {input_2}
Output: {output_2}

Input: {target_input}
Output:
```

#### Pattern 2: Labeled Paired

```
Example 1:
  Input: {input_1}
  Output: {output_1}

Example 2:
  Input: {input_2}
  Output: {output_2}

Now complete:
  Input: {target_input}
  Output:
```

#### Pattern 3: Conversational (for chat models)

```
User: {input_1}
Assistant: {output_1}

User: {input_2}
Assistant: {output_2}

User: {target_input}
Assistant:
```

#### Pattern 4: With Task Description

```
Task: Summarize each document in exactly 2 sentences.

Document: {document_1}
Summary: {summary_1}

Document: {document_2}
Summary: {summary_2}

Document: {target_document}
Summary:
```

### How Many Examples?

| Number | Best For | Token Cost |
|--------|----------|------------|
| 1-2 | Simple, clear format | Low |
| 3-5 | Most tasks (sweet spot) | Moderate |
| 5-10 | Complex, nuanced tasks | High |
| 10+ | See Many-Shot below | Very High |

**The diminishing returns curve:**

```
Accuracy gain per additional example:

Examples 1-2:  +15-25%   (biggest gain — establishes pattern)
Examples 3-5:  +5-10%    (moderate gain — refines pattern)
Examples 6-10: +2-5%     (small gain — covers edge cases)
Examples 10+:  +1-2%     (minimal gain — many-shot territory)
```

### Few-Shot Quality Checklist

- [ ] Examples are verified correct (no subtle errors)
- [ ] Examples cover the actual distribution (not cherry-picked)
- [ ] Last example is the most representative
- [ ] Format is consistent across all examples
- [ ] Examples don't leak information or PII
- [ ] Token budget is acceptable for the use case
- [ ] Contrastive examples are used when tone/style matters

---

## Many-Shot Prompting

### What It Is

Many-shot prompting provides **10-100+ examples** in the prompt. This became practical when models started supporting 100K-200K token context windows (GPT-4 Turbo, Claude 3, Gemini 1.5).

### Research Findings

- **Performance continues improving** with more examples, especially for complex tasks
- At 50+ examples, many-shot can match or exceed fine-tuned models on some tasks
- The improvement curve is log-linear: doubling examples gives diminishing but measurable gains
- **Critical finding:** Many-shot is most effective for tasks involving subtle distinctions, proprietary categories, or unusual formats

### When to Use Many-Shot

| Scenario | Example | Examples Needed |
|----------|---------|----------------|
| 50+ class classification | Product categorization | 50-100 |
| Subtle distinctions | Legal document classification | 30-80 |
| Proprietary formats | Internal ticket categories | 20-60 |
| High-stakes accuracy | Medical code assignment | 50-100 |
| Pattern-rich tasks | Log analysis patterns | 30-100 |

### Many-Shot Template

```
System: You are an intent classifier. Below are 50 verified examples
of user intents and their correct classifications.

{50 examples in structured format}

Now classify this new input, paying attention to patterns
from the examples:

Input: "I need to cancel my subscription but keep my data"
Intent:
```

### Many-Shot Best Practices

1. **Example quality is paramount** — one mislabeled example in 50 can skew the model
2. **Diverse coverage** — ensure all categories have representation proportional to frequency
3. **Label noise acknowledgment** — research shows adding "Beware that some labels may be noisy" helps when example quality is uncertain
4. **Structure examples** — use tables or consistent formatting, not prose paragraphs
5. **Place recent examples near the query** — due to recency bias, the last 5-10 examples have outsized influence
6. **Monitor for over-pattern-matching** — with many examples, the model may memorize instead of generalize

### Pro Tip: Few-Shot Can Underperform

Research (arXiv 2509.13196, "The Few-shot Dilemma") found that in some cases, adding examples causes **over-prompting** — the model over-fits to patterns in the examples and ignores its pre-trained knowledge. This is more common when:

- Examples are too similar (lack diversity)
- Examples contain subtle noise (inconsistencies)
- The task is simple enough for zero-shot

**Rule of thumb:** If zero-shot performs at 85%+, few-shot may not help much. If zero-shot performs below 70%, few-shot will likely show strong gains.

---

## Dynamic Few-Shot Selection

### What It Is

Instead of hardcoding the same examples for every query, **dynamically select** the most relevant examples from a pool based on the specific input.

```
Dynamic Selection ──────────────────────────┐
                                             │
  Example Pool ───→ Retriever ───→ Top K    │
  (100+ labeled       (embedding     examples)│
   examples)           similarity)           │
                                             ▼
                                    Prompt: Task + Selected Examples + Query
```

### Why Dynamic Selection Outperforms Static

| Aspect | Static Few-Shot | Dynamic Few-Shot |
|--------|----------------|-------------------|
| Relevance | Same examples for all inputs | Tailored to each query |
| Coverage | Fixed set may miss edge cases | Can retrieve from large pool |
| Token efficiency | Wastes tokens on irrelevant examples | Only includes useful examples |
| Scalability | Limited to ~10 examples | Pool of 100-1000+ examples |
| Accuracy | Good for uniform distributions | Better for diverse inputs |

### Implementation Approaches

#### Approach 1: Embedding Similarity (Recommended)

```python
import openai
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Create embeddings for example pool
example_pool = [
    {"input": "Where is my order?", "label": "order_status"},
    {"input": "I want a refund", "label": "refund"},
    # ... 100+ more examples
]

def get_embedding(text):
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# Pre-compute example embeddings
example_embeddings = [get_embedding(ex["input"]) for ex in example_pool]

def select_examples(query, k=5):
    query_embedding = get_embedding(query)
    similarities = cosine_similarity(
        [query_embedding], example_embeddings
    )[0]
    top_indices = np.argsort(similarities)[-k:][::-1]
    return [example_pool[i] for i in top_indices]
```

#### Approach 2: LLM-as-Selector

Use a separate LLM call to select the best examples:

```
System: You are a few-shot example selector. Given a user query
and a pool of exemplars, select the 3-5 most relevant examples
to include in the prompt.

Selection criteria:
- Semantic similarity to the query
- Diversity of coverage (different edge cases)
- Correctly labeled (verified examples)

Query: {query}
Exemplar pool: {pool}

Selected examples:
```

#### Approach 3: Rule-Based Selection

For well-understood domains with clear categories:

```python
def select_examples(query, example_pool):
    # Check for keywords to determine category
    if "refund" in query.lower():
        category = "billing"
    elif "password" in query.lower():
        category = "account"
    else:
        category = "general"

    # Return examples from matching category
    return [ex for ex in example_pool if ex["category"] == category][:5]
```

### Pool Management

| Aspect | Recommendation |
|--------|---------------|
| Pool size | 50-500 examples |
| Label verification | Every example must be human-verified |
| Refresh frequency | Review/update pool quarterly |
| Class balance | Proportional to expected distribution |
| Edge cases | Include rare but important cases |

### Retrieval Strategies

| Strategy | How It Works | Best For |
|----------|-------------|----------|
| Top-K similarity | Nearest neighbors by embedding | General purpose |
| Maximal marginal relevance (MMR) | Diversity + similarity | Avoiding redundant examples |
| Clustered selection | Pick from each cluster centroid | Balanced category coverage |
| Hybrid (rule + embedding) | Filter by category, rank by similarity | Structured domains |

### Production Pipeline

```
1. Query comes in
2. Embedding model converts query to vector
3. Vector database (e.g., Pinecone, Milvus, FAISS) retrieves top-K
4. Optional: Re-rank with cross-encoder for precision
5. Selected examples injected into prompt
6. LLM generates response with examples in context

Latency budget:
  Embedding:          5-20ms
  Vector search:      5-50ms
  Re-ranking:         20-100ms
  Total overhead:     ~30-200ms (acceptable for most applications)
```

### Dynamic Selection vs Static Selection: Results

Based on production benchmarks:

| Task Type | Static (3 examples) | Dynamic (3 from pool of 100) | Improvement |
|-----------|-------------------|------------------------------|-------------|
| Intent classification | 84.2% | 91.7% | +7.5% |
| Entity extraction | 78.5% | 87.3% | +8.8% |
| Customer support routing | 81.0% | 89.5% | +8.5% |
| Content moderation | 86.1% | 92.8% | +6.7% |
| Product categorization | 72.3% | 85.1% | +12.8% |

---

## Comparison and Selection Guide

### Decision Tree

```
How complex is the task?
│
├─ Simple (spam detection, translation, capital cities)
│  └─ Use ZERO-SHOT
│
├─ Moderate (classification with 5-10 categories, structured output)
│  │
│  └─ Is the output format constrained?
│     ├─ Yes → ZERO-SHOT with strong format instructions
│     └─ No → FEW-SHOT (3-5 examples)
│
├─ Complex (nuanced domain, 50+ classes, proprietary format)
│  │
│  └─ How many examples do you have?
│     ├─ 0-10 → FEW-SHOT (use all available, carefully curated)
│     ├─ 10-50 → MANY-SHOT
│     └─ 50+ → MANY-SHOT or DYNAMIC FEW-SHOT
│
└─ High-stakes (medical, legal, financial)
   ├─ Use DYNAMIC FEW-SHOT with verified examples
   └─ Add self-consistency or CoT for reasoning tasks
```

### Quick Reference Table

| Paradigm | Examples | Token Cost | Setup Effort | Accuracy | Best For |
|----------|----------|------------|--------------|----------|----------|
| Zero-shot | 0 | Lowest | None | 70-90% | Simple, well-known tasks |
| One-shot | 1 | Low | Minimal | 75-92% | Quick format demonstration |
| Few-shot | 2-10 | Moderate | Medium | 85-96% | Most production tasks |
| Many-shot | 10-100+ | High | High | 90-98% | Complex, high-stakes tasks |
| Dynamic | 3-5 (from pool) | Moderate | High (setup) | 88-97% | Diverse, non-uniform inputs |

### Common Mistakes

| Mistake | Paradigm | Fix |
|---------|----------|-----|
| Using zero-shot for complex format output | Zero-shot | Add at least 1-2 examples |
| Examples too similar to each other | Few-shot | Add diverse coverage |
| Including noisy/mislabeled examples | Few-shot/Many-shot | Verify every example |
| Static examples for diverse inputs | Few-shot | Switch to dynamic selection |
| Too many examples for simple task | Few-shot/Many-shot | More tokens ≠ better |
| Ignoring position bias | Few-shot/Many-shot | Place best example last |
| No task description with examples | Few-shot | Always include a task statement |

### Cost-Benefit Analysis

| Budget | Recommendation |
|--------|---------------|
| Minimize token cost | Zero-shot or 1-shot |
| Balance cost and quality | 3-5 static few-shot examples |
| Maximum quality | Dynamic few-shot from pool of 50+ |
| Stretch budget | Many-shot (50+ examples) |
| Production + high-stakes | Dynamic few-shot + self-consistency |

---

## Summary

- **Zero-shot** is fast and cheap but unreliable for complex or nuanced tasks
- **Few-shot** (2-10 examples) is the sweet spot for most production use cases
- **Example quality > example quantity** — one bad example can derail performance
- **Place your best example last** due to recency bias
- **Many-shot** (10-100+ examples) works when large context windows are available and accuracy demands are high
- **Dynamic few-shot** adapts to each query by retrieving the most relevant examples from a pool — the most scalable approach for diverse inputs
- **Test zero-shot first** — if it meets your accuracy threshold, stop there

> Next: [04-Output-Formats.md](./04-Output-Formats.md)
