# Cost Optimization

> A practical guide to reducing LLM costs without sacrificing quality — covering prompt compression, model routing, caching strategies, output limits, and a comprehensive cost reduction tactics table.

---

## Table of Contents

1. [The Cost Landscape](#the-cost-landscape)
2. [Prompt Compression](#prompt-compression)
3. [Model Routing](#model-routing)
4. [Caching Strategies](#caching-strategies)
5. [Output Length Limits](#output-length-limits)
6. [Few-Shot Example Pruning](#few-shot-example-pruning)
7. [Cost Reduction Tactics Table](#cost-reduction-tactics-table)
8. [Building a Cost Optimization Pipeline](#building-a-cost-optimization-pipeline)
9. [Monitoring Cost Per Completion](#monitoring-cost-per-completion)

---

## The Cost Landscape

### LLM Pricing Structure (2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Typical Use Case |
|-------|----------------------|-----------------------|------------------|
| GPT-4o mini | $0.15 | $0.60 | Simple classification, extraction |
| GPT-4o | $2.50 | $10.00 | General purpose, structured output |
| GPT-5 | $10.00 | $30.00 | Complex reasoning, high-stakes tasks |
| Claude 4 Haiku | $0.25 | $1.25 | Fast, simple tasks |
| Claude 4 Sonnet | $3.00 | $15.00 | Balanced quality/speed |
| Claude Opus 4 | $15.00 | $75.00 | Maximum quality, analysis |
| Gemini 2.5 Flash | $0.10 | $0.40 | High-volume, low-complexity |
| Gemini 2.5 Pro | $2.00 | $8.00 | Reasoning, multimodal |
| DeepSeek-V3 | $0.50 | $2.00 | Open-source alternative |
| Llama 4 (self-hosted) | ~$0.05 (compute) | ~$0.15 (compute) | Highest volume, privacy-sensitive |

### Where Costs Accumulate

| Component | % of Total Cost | Optimization Opportunity |
|-----------|-----------------|------------------------|
| Input tokens (system prompt + context) | 50-70% | Prompt compression, shorter context |
| Output tokens (generated response) | 20-40% | Output length limits, concise responses |
| API overhead (retries, fallbacks) | 5-10% | Better error handling, fewer retries |
| Evaluation / testing | 5-20% (variable) | Sample strategically, reduce eval frequency |

---

## Prompt Compression

### What Is Prompt Compression?

Reducing the token count of your prompts without changing the instructions' meaning or effectiveness.

### Compression Techniques

| Technique | Typical Savings | Effort | Risk |
|-----------|----------------|--------|------|
| Remove redundant instructions | 5-15% | Low | Low |
| Merge overlapping rules | 5-10% | Medium | Low |
| Shorten few-shot examples | 10-25% | Medium | Medium (may lose specificity) |
| Use shorter variable names | 1-3% | Low | Low |
| Remove boilerplate language | 3-8% | Low | Low |
| Use compact XML tags | 2-5% | Low | Low |
| Externalize reference material | 20-50% | High | Medium (needs retrieval) |
| Use token-efficient phrasing | 10-20% | Medium | Low |

### Token-Efficient Phrasing

```markdown
# Wordy (40 tokens)
"You are a helpful assistant. Your job is to answer questions
accurately and concisely. Please provide clear, well-structured
responses that directly address the user's query."

# Compact (22 tokens — 45% reduction)
"Role: Helpful assistant.
Answer questions accurately and concisely.
Be direct and well-structured."
```

### Compression Analysis Script

```python
import tiktoken

def analyze_prompt_compression(prompt: str, model: str = "gpt-4o"):
    """Analyze a prompt and suggest compression opportunities."""
    encoder = tiktoken.encoding_for_model(model)
    tokens = encoder.encode(prompt)

    suggestions = []

    # Check token count
    if len(tokens) > 2000:
        suggestions.append("Large prompt: consider externalizing reference material")

    # Check for redundant phrases
    redundancies = [
        ("I'd be happy to", ""),
        ("please", ""),
        ("in order to", "to"),
        ("due to the fact that", "because"),
        ("at this point in time", "now"),
        ("in the event that", "if"),
    ]

    for verbose, concise in redundancies:
        if verbose in prompt:
            suggestions.append(
                f"Replace '{verbose}' with '{concise}' "
                f"(saves ~{len(encoder.encode(verbose)) - len(encoder.encode(concise))} tokens)"
            )

    # Check instruction density
    words_per_instruction = len(prompt.split()) / prompt.count("\n")
    if words_per_instruction > 20:
        suggestions.append("Instructions average >20 words per line — consider shorter statements")

    return {
        "original_tokens": len(tokens),
        "suggestions": suggestions,
    }

# Example
analysis = analyze_prompt_compression(my_prompt)
print(f"Token count: {analysis['original_tokens']}")
for s in analysis['suggestions']:
    print(f"  → {s}")
```

### Automated Compression

```python
def compress_prompt(prompt: str, target_ratio: float = 0.7) -> str:
    """Use an LLM to compress a prompt while preserving meaning."""
    compressor_prompt = f"""
    Compress the following prompt to approximately {target_ratio*100:.0f}%
    of its original token count. Preserve ALL instructions, rules, and
    constraints. Remove redundancy. Use concise language.

    Original prompt:
    ---
    {prompt}
    ---

    Compressed version:
    """
    compressed = call_llm(compressor_prompt, model="gpt-4o-mini")
    return compressed
```

---

## Model Routing

### What Is Model Routing?

Sending each request to the most cost-effective model that can handle it adequately, rather than using one expensive model for everything.

### Routing Strategy

```python
def estimate_complexity(prompt: str) -> int:
    """Estimate task complexity based on prompt characteristics."""
    token_count = len(prompt.split())
    task_type = classify_task(prompt)

    complexity_scores = {
        "simple_q": 50,       # "What's the weather?"
        "extraction": 150,    # "Extract the date from this email"
        "classification": 200, # "Is this positive or negative?"
        "generation": 400,    # "Write a product description"
        "reasoning": 600,     # "Analyze this dataset"
        "coding": 500,        # "Write a Python function"
        "creative": 400,      # "Write a poem"
        "analysis": 700,      # "Compare these two approaches"
    }

    return complexity_scores.get(task_type, 300)

def route_model(prompt: str, user_tier: str = "standard") -> str:
    """Route to the most cost-effective model."""
    complexity = estimate_complexity(prompt)

    # Simple rules
    if complexity < 200:
        return "gpt-4o-mini"       # $0.15/M input tokens
    elif complexity < 2000:
        return "gpt-4o"             # $2.50/M input tokens
    else:
        return "claude-opus-4"      # $15.00/M input tokens

# Cost comparison for 1M requests (avg 500 input, 100 output tokens)
# Using one model: gpt-4o → $1,500
# Using routing: 70% mini + 25% 4o + 5% opus → ~$450
# Savings: ~70%
```

### Routing Rules Examples

```yaml
routing_rules:
  # Simple: route by task type
  task_based:
    - task: classification
      model: gpt-4o-mini
      max_tokens: 50
    - task: extraction
      model: gpt-4o-mini
      max_tokens: 200
    - task: generation
      model: gpt-4o
      max_tokens: 1000
    - task: reasoning
      model: claude-sonnet-4
      max_tokens: 2000
    - task: analysis
      model: claude-opus-4
      max_tokens: 4000

  # Advanced: route by confidence
  confidence_based:
    - try_first: gpt-4o-mini
      condition: "if confidence >= 0.9"  # Accept output
      fallback: gpt-4o
      condition: "if confidence >= 0.7"
      fallback: claude-opus-4
      condition: "always"

  # Hybrid: budget-based routing
  budget_based:
    user_tier:
      free:
        model: gpt-4o-mini
        max_tokens: 500
        rate_limit: 10/hour
      pro:
        model: gpt-4o
        max_tokens: 2000
        rate_limit: 100/hour
      enterprise:
        model: claude-opus-4
        max_tokens: 8000
        rate_limit: unlimited
```

### Fallback Chain

```python
def call_with_fallback(
    prompt: str,
    model_chain: list[str],
    max_tokens: int = 1024
) -> tuple[str, str]:
    """Try models in order, falling back on failure."""
    for model in model_chain:
        try:
            response = call_llm(prompt, model=model, max_tokens=max_tokens)
            return response, model
        except Exception as e:
            print(f"Model {model} failed: {e}")
            continue
    raise Exception("All models in chain failed")

# Usage: try cheap model first, fall back to expensive
response, used_model = call_with_fallback(
    prompt,
    model_chain=["gpt-4o-mini", "gpt-4o", "claude-opus-4"]
)
print(f"Handled by: {used_model}")
```

---

## Caching Strategies

### What to Cache

| Cacheable | Not Cacheable |
|-----------|--------------|
| System prompts (identical structure) | User messages (unique per session) |
| Few-shot examples | Dynamic context (time, weather, user data) |
| Common user intents ("reset password") | Multi-turn conversation state |
| Evaluation queries | Anything with PII |
| Static RAG document chunks | Real-time data |

### Cache Types

#### 1. Exact Match Cache (SHA-256)

Cache the response for identical inputs. Most effective for system prompts and common queries.

```python
import hashlib
import json
from functools import lru_cache
import diskcache

cache = diskcache.Cache("llm_cache")

def cached_llm_call(
    prompt: str,
    model: str,
    temperature: float = 0.0,
    ttl: int = 3600  # 1 hour
) -> str:
    """LLM call with exact-match caching."""
    cache_key = hashlib.sha256(
        f"{prompt}|{model}|{temperature}".encode()
    ).hexdigest()

    # Check cache
    if cache_key in cache:
        return cache[cache_key]

    # Call LLM
    response = call_llm(prompt, model=model, temperature=temperature)

    # Cache response
    cache.set(cache_key, response, expire=ttl)

    return response
```

#### 2. Semantic Cache (Embedding Similarity)

Cache responses for semantically similar queries. More complex but catches more reuse.

```python
import numpy as np
from sentence_transformers import SentenceTransformer

class SemanticCache:
    def __init__(self, similarity_threshold: float = 0.95):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.cache = {}  # embedding -> (response, timestamp)
        self.threshold = similarity_threshold

    def get(self, query: str) -> str | None:
        query_emb = self.model.encode(query)

        for cached_emb, (response, _) in self.cache.items():
            similarity = np.dot(query_emb, cached_emb) / (
                np.linalg.norm(query_emb) * np.linalg.norm(cached_emb)
            )
            if similarity >= self.threshold:
                return response
        return None

    def set(self, query: str, response: str):
        emb = self.model.encode(query)
        self.cache[emb.tobytes()] = (response, time.time())
```

### Cache Hit Rate Optimization

| Strategy | Expected Hit Rate Increase | Implementation Complexity |
|----------|---------------------------|--------------------------|
| Normalize input casing | 5-10% | Low |
| Strip whitespace/punctuation | 3-5% | Low |
| Parameterize variable parts (dates, names) | 15-25% | Medium |
| Use semantic similarity | 20-40% | High |
| Cache at conversation level | 10-20% | Medium |

### Cache Invalidation Rules

```python
def invalidate_cache(trigger: str):
    """Invalidate cache entries based on trigger."""
    if trigger == "prompt_update":
        cache.clear()  # Full invalidation on prompt change
    elif trigger == "model_update":
        cache.clear()
    elif trigger == "data_freshness":
        # Remove entries older than freshness window
        for key in cache:
            if cache.get_expire(key) < time.time():
                del cache[key]
    elif trigger == "manual":
        selective_invalidate(["customer-support-v1.2.0"])
```

---

## Output Length Limits

### Why Limit Output Length

- Tokens cost money (especially output tokens at higher rates)
- Longer outputs increase latency
- Users often don't read excessively long responses
- Model quality can degrade in very long generations

### Hard Caps vs Soft Guidelines

```python
def generate_with_budget(
    prompt: str,
    max_tokens: int = 500,
    model: str = "gpt-4o-mini"
) -> str:
    """
    Generate response with hard token cap.
    Also includes instruction for model to be concise.
    """
    budget_prompt = f"""
    {prompt}

    IMPORTANT:
    - Respond in {max_tokens} tokens or fewer
    - Be direct and concise
    - Do not include preamble or closing remarks
    """
    response = call_llm(
        budget_prompt,
        model=model,
        max_tokens=max_tokens,
        temperature=0.3,  # Lower temp for more predictable length
    )
    return response
```

### Output Budget by Task

| Task | Recommended Max Tokens | Typical Token Usage |
|------|----------------------|-------------------|
| Classification | 10-50 | 5-15 |
| Extraction | 50-200 | 20-100 |
| Short answer Q&A | 100-300 | 50-200 |
| Summarization | 200-500 | 150-400 |
| Code generation | 500-2000 | 300-1500 |
| Content generation | 500-2000 | 400-1500 |
| Analysis | 1000-4000 | 800-3000 |
| Report generation | 2000-8000 | 1500-6000 |

### Cost Impact of Output Length

```python
def estimate_output_cost(
    avg_tokens_per_response: int,
    requests_per_day: int,
    model: str = "gpt-4o"
) -> dict:
    """Estimate daily output costs."""
    output_rates = {
        "gpt-4o-mini": 0.60,   # per 1M tokens
        "gpt-4o": 10.00,
        "claude-opus-4": 75.00,
    }

    rate = output_rates.get(model, 10.00)
    daily_tokens = avg_tokens_per_response * requests_per_day
    daily_cost = (daily_tokens / 1_000_000) * rate
    monthly_cost = daily_cost * 30
    annual_cost = monthly_cost * 12

    return {
        "daily": round(daily_cost, 2),
        "monthly": round(monthly_cost, 2),
        "annual": round(annual_cost, 2),
    }

# Example: 100k requests/day, 500 tokens each, gpt-4o
cost = estimate_output_cost(500, 100_000, "gpt-4o")
print(f"Monthly output cost: ${cost['monthly']}")

# Cut to 200 tokens: $3,000 monthly (60% savings)
```

---

## Few-Shot Example Pruning

### The Cost of Examples

Each example adds input tokens. For frequent queries, this compounds.

| Number of Examples | Extra Input Tokens | Annual Cost (1M queries, gpt-4o) |
|--------------------|-------------------|----------------------------------|
| 0 | 0 | $0 |
| 2 | ~100 | $3,000 |
| 5 | ~250 | $7,500 |
| 10 | ~500 | $15,000 |

### Pruning Strategy

```python
def prune_examples(
    examples: list[dict],
    max_examples: int = 3,
    max_tokens: int = 500
) -> list[dict]:
    """
    Prune few-shot examples to maximize quality per token.
    Keeps the most information-dense examples.
    """
    if len(examples) <= max_examples:
        return examples

    # Score each example by information density
    def density(example: dict) -> float:
        input_tokens = len(example["input"].split())
        output_tokens = len(example["output"].split())
        # Higher weight for distinct patterns
        distinct_terms = len(set(example["input"].split()))
        return distinct_terms / (input_tokens + output_tokens)

    scored = [(density(ex), ex) for ex in examples]
    scored.sort(reverse=True)

    # Keep top examples within token budget
    pruned = []
    total_tokens = 0
    for _, ex in scored:
        ex_tokens = len(ex["input"].split()) + len(ex["output"].split())
        if total_tokens + ex_tokens <= max_tokens:
            pruned.append(ex)
            total_tokens += ex_tokens
        if len(pruned) >= max_examples:
            break

    return pruned
```

---

## Cost Reduction Tactics Table

| Strategy | Impact Range | Effort | Implementation Time | Risk | Best For |
|----------|:-----------:|:------:|:-------------------:|:----:|----------|
| Prompt compression | 10-40% reduction | Low-Medium | 1-3 days | Low | All prompts |
| Model routing | 50-80% reduction | Medium | 1-2 weeks | Medium | High-volume systems |
| Exact-match caching | 20-60% reduction | Low | 1-2 days | Low | Stable prompts |
| Semantic caching | 30-70% reduction | High | 2-4 weeks | Medium | Variable user input |
| Output length limits | 5-30% reduction | Low | <1 day | Low | All use cases |
| Few-shot example pruning | 5-15% reduction | Medium | 1-3 days | Low-Medium | Few-shot prompts |
| Batch processing | 10-30% reduction | Medium | 1-2 weeks | Low | Non-real-time tasks |
| Self-hosting (open models) | 60-90% reduction | Very High | 4-8 weeks | High | Very high volume |
| Temperature increase | 5-10% reduction (via shorter output) | Low | <1 day | Medium | Non-deterministic tasks |
| Context window limiting | 5-20% reduction | Low | <1 day | Medium | RAG systems |
| Conversation summary injection | 40-70% reduction (long sessions) | High | 2-4 weeks | Medium | Multi-turn conversations |
| Quantize embeddings (for RAG) | 30-50% reduction (storage + retrieval) | Medium | 1-2 weeks | Low | RAG pipelines |

### Combined Impact Estimate

```python
def estimate_total_savings(
    monthly_spend: float,
    compress: bool = False,
    route: bool = False,
    cache: bool = False,
    limit_output: bool = False,
) -> dict:
    """Estimate combined savings from multiple strategies."""
    remaining = monthly_spend
    savings = {}

    # Apply multiplicative (each strategy reduces remaining)
    if compress:
        saved = remaining * 0.25  # 25% savings
        savings["compression"] = saved
        remaining -= saved
    if route:
        saved = remaining * 0.60  # 60% savings on remaining
        savings["model_routing"] = saved
        remaining -= saved
    if cache:
        saved = remaining * 0.40  # 40% savings on remaining
        savings["caching"] = saved
        remaining -= saved
    if limit_output:
        saved = remaining * 0.15  # 15% savings on remaining
        savings["output_limits"] = saved
        remaining -= saved

    total_saved = monthly_spend - remaining
    return {
        "monthly_spend": monthly_spend,
        "projected_spend": remaining,
        "total_savings": total_saved,
        "savings_percent": (total_saved / monthly_spend) * 100,
        "breakdown": savings,
    }

# Example: $10,000/month spending
estimate = estimate_total_savings(
    monthly_spend=10000,
    compress=True,
    route=True,
    cache=True,
    limit_output=True,
)
print(f"Projected: ${estimate['projected_spend']:.0f}/month")
print(f"Savings: {estimate['savings_percent']:.0f}% (${estimate['total_savings']:.0f})")
```

---

## Building a Cost Optimization Pipeline

### Architecture

```
Request → [Cache Check] → [Model Router] → [LLM Call] → [Length Limit] → [Response]
              ↑                |
              |          [Cheap Model]
          Cache Hit         or
              |          [Expensive Model]
          Return              |
          Cached         [Fallback Chain]
          Response            |
                         [Log Cost]
                              ↓
                     [Cost Analytics Dashboard]
```

### Implementation Steps

1. **Measure baseline** — current cost per request, per user, per feature
2. **Identify biggest opportunities** — focus on highest-volume use cases first
3. **Implement caching** — start with exact match, evaluate semantic cache for ROI
4. **Add model routing** — classify tasks, route to appropriate models
5. **Compress prompts** — optimize system prompts and trim examples
6. **Set output limits** — hard caps per task type
7. **Monitor and iterate** — track cost per completion, adjust routing thresholds

### Cost Monitoring

```python
class CostTracker:
    def __init__(self):
        self.usage_log = []

    def log_call(self, model: str, input_tokens: int, output_tokens: int):
        rates = {
            "gpt-4o-mini": (0.15, 0.60),
            "gpt-4o": (2.50, 10.00),
            "claude-sonnet-4": (3.00, 15.00),
            "claude-opus-4": (15.00, 75.00),
        }
        input_rate, output_rate = rates.get(model, (2.50, 10.00))
        cost = (input_tokens / 1_000_000 * input_rate +
                output_tokens / 1_000_000 * output_rate)

        self.usage_log.append({
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost": cost,
            "timestamp": datetime.now(),
        })

    def daily_report(self) -> dict:
        today = [l for l in self.usage_log
                 if l["timestamp"].date() == date.today()]
        total_cost = sum(l["cost"] for l in today)
        by_model = {}
        for l in today:
            by_model[l["model"]] = by_model.get(l["model"], 0) + l["cost"]

        return {
            "total_cost": total_cost,
            "total_calls": len(today),
            "avg_cost_per_call": total_cost / len(today) if today else 0,
            "by_model": by_model,
        }
```

---

## Monitoring Cost Per Completion

### Key Metrics

| Metric | What It Tells You | Action If Increasing |
|--------|------------------|---------------------|
| Cost per completion | Overall efficiency | Review routing rules, check for prompt bloat |
| Average input tokens | Prompt size creep | Compress prompts, trim examples |
| Average output tokens | Response verbosity | Tighten max_tokens, add conciseness instructions |
| Cache hit rate | Caching effectiveness | Adjust similarity threshold, expand cacheable patterns |
| Model distribution | Routing effectiveness | Shift more traffic to cheaper models |
| Cost by feature | Which features are expensive | Optimize high-cost features or adjust pricing |

### Dashboard Configuration

```yaml
cost_monitoring:
  metrics:
    - name: cost_per_completion
      unit: USD
      alert_threshold: 0.05  # Alert if > $0.05 per completion
      window: 1h

    - name: cache_hit_rate
      unit: percent
      alert_threshold: 0.20  # Alert if cache hit rate < 20%
      window: 1h

    - name: avg_input_tokens
      unit: tokens
      alert_threshold: 2000  # Alert if > 2000 average
      window: 24h

  alerts:
    - metric: cost_per_completion
      condition: "> 0.10 for 5 minutes"
      action: "Page on-call engineer, review routing"
    - metric: model_mix
      condition: "gpt-4o-mini < 50% of calls"
      action: "Review routing rules, check for routing failures"
```

### Cost Budget Alerts

```python
def check_budget_alert(
    current_monthly_cost: float,
    monthly_budget: float,
    alert_thresholds: list[float] = [0.5, 0.75, 0.9, 1.0]
) -> list[str]:
    """Generate alerts when cost crosses thresholds."""
    usage_ratio = current_monthly_cost / monthly_budget
    alerts = []

    for threshold in alert_thresholds:
        if usage_ratio >= threshold:
            alerts.append(
                f"Alert: {usage_ratio:.0%} of monthly budget used "
                f"(${current_monthly_cost:.0f} / ${monthly_budget:.0f})"
            )

    return alerts
```

---

> **Key takeaway:** The biggest cost savings come from model routing (50-80%) and caching (20-60%). Start with exact-match caching and task-based routing, then add prompt compression and output limits. Monitor cost per completion and set alerts for budget thresholds. The goal is not minimizing cost — it's maximizing value per dollar spent.
