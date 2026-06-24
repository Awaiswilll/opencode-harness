# How Large Language Models Work

> A foundational understanding of LLM mechanics — tokenization, context windows, attention, sampling parameters, model differences, and the journey from prompt to prediction.

---

## Table of Contents

1. [The Architecture at a Glance](#the-architecture-at-a-glance)
2. [Tokenization and Vocabulary](#tokenization-and-vocabulary)
3. [Context Windows and Attention](#context-windows-and-attention)
4. [Temperature, Top-P, and Sampling Parameters](#temperature-top-p-and-sampling-parameters)
5. [Model Differences: GPT vs Claude vs Gemini vs Llama](#model-differences-gpt-vs-claude-vs-gemini-vs-llama)
6. [How Prompts Become Predictions](#how-prompts-become-predictions)
7. [Practical Implications for Prompt Engineering](#practical-implications-for-prompt-engineering)

---

## The Architecture at a Glance

Large Language Models (LLMs) are neural networks trained on massive text corpora to predict the next token in a sequence. The core architecture — the **Transformer** — was introduced by Vaswani et al. (Google, 2017) and remains the foundation of every major LLM today.

**The high-level flow:**

```
Input Text → Tokenization → Embedding → Transformer Layers → Output Logits → Sampling → Generated Text
```

A model does not "understand" text in the human sense. It computes probabilities over token sequences based on patterns learned during training. Every prompt engineering technique is ultimately about steering those probability distributions.

### Decoder-Only Architecture

Most modern LLMs (GPT, Claude, Gemini, Llama) use a **decoder-only** architecture:

- **Encoder-decoder** (T5, BART): Separate encoder reads input, decoder generates output
- **Decoder-only** (GPT, Claude, Llama): A single stack processes input and generates output autoregressively

Decoder-only models have become dominant because they scale more efficiently and handle few-shot learning better. The model attends to all previous tokens (both prompt and generated) at each step.

### Key Numbers

| Property | Scale |
|----------|-------|
| Parameters | 7B — 1.8T (depending on model) |
| Vocabulary size | 32K — 256K tokens |
| Context window | 4K — 2M tokens |
| Training data | 1T — 30T+ tokens |
| Hidden dimension | 4K — 51K |
| Number of layers | 32 — 240 |

---

## Tokenization and Vocabulary

### What Is a Token?

A **token** is the atomic unit of text that an LLM processes. Tokens are not characters and not necessarily whole words — they are subword units determined by the model's tokenizer.

```
"Hello, world!" → ["Hello", ",", " world", "!"]
"unhappiness" → ["un", "happiness"]
"I'm running" → ["I", "'m", " running"]
```

**Why subword tokenization?**
- A fixed vocabulary must handle any text
- Common words stay as single tokens (efficient)
- Rare words decompose into known subword pieces (no unknown tokens)
- Balances vocabulary size with encoding length

### Tokenization Algorithms

#### BPE (Byte-Pair Encoding)
Used by: GPT models, Llama

BPE starts with individual characters and iteratively merges the most frequent adjacent pairs.

```
Step 1: "l o w e r" (characters)
Step 2: "low" appears often → merge "l"+"ow" → "low" + "e" + "r"
Step 3: Continue merging until vocabulary reaches target size
```

The final vocabulary contains common substrings. Encoding unseen text applies the learned merges greedily.

#### SentencePiece / Unigram
Used by: Gemma, T5, some Llama variants

SentencePiece treats the entire input as a raw byte stream (no whitespace preprocessing). It uses a unigram language model to find the most likely token segmentation.

**Key difference:** SentencePiece can directly model whitespace and doesn't require pre-tokenization. BPE traditionally splits on whitespace first.

### Vocabulary Sizes by Model

| Model | Vocabulary Size | Tokenizer |
|-------|----------------|-----------|
| GPT-4 / GPT-5 | ~100K | BPE (cl100k_base) |
| Claude 3 / 4 | ~100K | BPE (SentencePiece-based) |
| Gemini 1.5 / 2.0 | ~256K | SentencePiece |
| Llama 3 / 4 | 128K | BPE (tiktoken-based) |
| DeepSeek V3 | 128K | BPE |

### Token Economics

Token count directly determines:
- **Cost**: Most providers bill per token (input + output)
- **Latency**: More tokens = slower generation
- **Context limits**: Maximum tokens per prompt

**Practical token estimates:**

| Text | Approx Tokens |
|------|---------------|
| "Hello, world!" | ~4 |
| One English word | ~1.3 |
| One page of text | ~300-500 |
| This entire section | ~250 |
| 100K token context | ~200 pages |

**Language efficiency varies:**
- English: ~1.3 tokens/word
- Chinese: ~1.5-2 tokens/character
- Code: ~1 token per 2-4 characters

### Tokenization Pitfalls for Prompt Engineers

```
1. Unnecessary whitespace inflates token counts
   "Hello, world"  → 3 tokens
   "Hello,  world" → 4 tokens (double space)

2. Special characters may split unexpectedly
   "email@domain.com" → 5-8 tokens (not 1)

3. Numbers can be inefficient
   1234567890 → could be 10 tokens (one per digit) or 1-3

4. CamelCase vs snake_case
   "getUserName" → ["get", "User", "Name"] (3 tokens)
   "get_user_name" → ["get", "_", "user", "_", "name"] (5 tokens)
```

**Rule of thumb:** Prefer natural English phrasing. Unusual formatting, excessive punctuation, and arbitrary line breaks increase token counts without helping the model.

---

## Context Windows and Attention

### What Is a Context Window?

The **context window** is the maximum number of tokens the model can process in a single forward pass, including both the input prompt and the generated output.

| Model | Context Window |
|-------|---------------|
| GPT-4 | 8K — 128K |
| GPT-4o | 128K |
| GPT-5.x | 128K — 1M |
| Claude 3.5 Sonnet | 200K |
| Claude 4 Opus | 200K |
| Gemini 1.5 Pro | 2M |
| Gemini 2.5 Pro | 1M |
| Llama 3.1 / 4 | 128K |
| DeepSeek V3 | 128K |
| Mistral Large | 128K |

### How Attention Works

Attention is the mechanism that lets each token "look at" every other token in the context. The **self-attention** operation computes relevance scores between all pairs of positions.

**Simplified attention equation:**

```
Attention(Q, K, V) = softmax(Q × K^T / √d) × V
```

Where:
- **Q** (Query): What this token is looking for
- **K** (Key): What this token contains
- **V** (Value): What this token contributes
- **d**: Scaling factor to prevent large values

**What this means practically:**
- Every token can directly reference any other token
- The strength of the connection depends on learned relevance patterns
- Earlier tokens dominate attention distributions (primacy bias)
- Very recent tokens also get strong attention (recency bias)

### The Lost-in-the-Middle Problem

Research (Liu et al., 2024) shows that models are significantly worse at retrieving information from the **middle** of long contexts:

```
Position in context:  [BEST ← ← ← WORST → → → BEST]
Accuracy trend:       High → declining → lowest → rising → High
```

**Implications for prompt design:**

```
System Prompt     → Best position (primacy)
─────────────────────────────────────
RAG Documents     → Worst position (middle)
─────────────────────────────────────
User Query        → Best position (recency)
```

**Strategies to mitigate:**
1. Put critical instructions at the start or end
2. Repeat important information in both positions
3. Move retrieved context after the instruction but before the query
4. Use clear delimiters (XML tags, markdown headers) to segment context
5. For RAG: place most relevant document last (closest to query)

### Attention Is Quadratic

Full self-attention scales as **O(n²)** where n is context length. Doubling the context quadruples the compute needed for each forward pass.

```
Context:  1K tokens → ~1M attention pairs
Context:  8K tokens → ~64M attention pairs
Context: 128K tokens → ~16B attention pairs
```

**Optimizations used by modern models:**

| Technique | How It Works | Used By |
|-----------|-------------|---------|
| Sliding window attention | Each token only attends to nearby tokens | Mistral, Gemma |
| Flash Attention | Hardware-optimized attention kernel | Almost all 2024+ models |
| Sparse attention | Attend to a subset of positions | Gemini (partially) |
| KV-cache | Cache previous key-value pairs during generation | All transformer decoders |
| MQA / GQA | Multi-Query / Grouped-Query Attention | Llama 2/3, Gemini, Mistral |
| ALiBi / RoPE | Position encoding that helps generalization | Llama, Mistral, GPT |

---

## Temperature, Top-P, and Sampling Parameters

### The Core Problem: Greedy vs Creative

The model outputs **logits** (raw scores) for every token in the vocabulary. Converting these logits into an actual token requires a **sampling strategy**. The choice of strategy determines whether the output is deterministic, creative, or somewhere in between.

### Temperature

**Temperature** controls the "sharpness" of the probability distribution.

```
temperature = 0.0:  Always pick the most likely token (greedy/deterministic)
temperature = 0.7:  Balanced — standard for most creative tasks
temperature = 1.0:  Sampling directly from the learned distribution
temperature = 2.0:  Near-random token selection
```

**How it works mathematically:**

```
logits = [1.0, 2.0, 3.0, 0.5]  (model outputs)

Temperature = 0.5:
  scaled = [2.0, 4.0, 6.0, 1.0]   ← differences amplified
  probs  = [0.12, 0.44, 0.42, 0.02]  ← peaky, deterministic

Temperature = 1.0:
  scaled = [1.0, 2.0, 3.0, 0.5]   ← raw logits
  probs  = [0.12, 0.31, 0.52, 0.05]  ← original distribution

Temperature = 2.0:
  scaled = [0.5, 1.0, 1.5, 0.25]  ← differences compressed
  probs  = [0.18, 0.29, 0.38, 0.15]  ← flatter, more random
```

**Practical guidance:**

| Task | Temperature | Reasoning |
|------|-------------|-----------|
| Math / Code / Facts | 0.0 - 0.2 | Deterministic accuracy required |
| Classification | 0.0 - 0.3 | Label consistency |
| General writing | 0.5 - 0.8 | Balance of quality and variety |
| Creative writing | 0.8 - 1.2 | Diversity preferred |
| Brainstorming | 1.0 - 1.5 | Maximum variety |
| Chart / Diagram generation | 0.0 - 0.2 | Structural precision |

### Top-P (Nucleus Sampling)

**Top-P** selects the smallest set of tokens whose cumulative probability exceeds P, then samples only from that set.

```
Logits:     [cat: 0.40, dog: 0.25, bird: 0.15, fish: 0.10, frog: 0.05, rat: 0.03, elk: 0.02]
Cumulative: [0.40, 0.65, 0.80, 0.90, 0.95, 0.98, 1.00]

Top-P = 0.9: Keep [cat, dog, bird, fish] → sample from these 4
Top-P = 0.95: Keep [cat, dog, bird, fish, frog] → sample from these 5
Top-P = 1.0: Keep all tokens → no filtering
```

**Key insight:** Top-P dynamically adjusts the number of candidate tokens. When the model is confident (one token dominates), few tokens pass the threshold. When uncertain, more tokens are available.

### Top-K

**Top-K** limits sampling to the K most likely tokens before applying temperature.

```
Top-K = 1:   Always pick the single most likely token (= greedy)
Top-K = 50:  Sample from the top 50 tokens
Top-K = 0:   No top-K filtering
```

**Limitation:** Top-K is static — when the model is uncertain, it still only considers K tokens; when very confident, it still wastes compute on unnecessary candidates.

### Combined Strategy

Most production systems use **temperature + top-P** together:

```
Temperature = 0.7, Top-P = 0.9
1. Apply temperature to logits
2. Sort by probability descending
3. Keep tokens until cumulative probability > 0.9
4. Sample from the filtered set
```

### Other Sampling Parameters

#### Frequency Penalty

Reduces the probability of tokens that have already appeared in the output.

```
frequency_penalty = -2.0 to 2.0
  Positive values → discourage repetition (more diverse)
  Negative values → encourage repetition (more focused)
```

#### Presence Penalty

Reduces the probability of tokens that have appeared at least once (regardless of frequency).

```
presence_penalty = -2.0 to 2.0
  Positive values → encourage new topics/terms
  Negative values → encourage sticking with introduced topics
```

**Difference:** Frequency penalty scales with count; presence penalty is binary (appeared or not).

#### Top-K reasoning models (o3, o4-mini, R1)

Reasoning models have an additional parameter:

```
reasoning_effort: low | medium | high
  Controls how much "thinking" the model does before answering
  Higher effort → more tokens spent on reasoning → better for hard problems
```

#### Seed (Reproducibility)

Some APIs support a `seed` parameter for deterministic sampling:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    seed=42,  # Same seed + same prompt = same output
    temperature=0.7,
)
```

**Caveat:** Seeds do NOT guarantee identical outputs across model versions or providers. They only provide reproducibility within the same model version.

### Recommended Default Settings

| Scenario | Temp | Top-P | Top-K | Freq Pen | Pres Pen |
|----------|------|-------|-------|----------|----------|
| Code generation | 0.0 | 1.0 | — | 0.0 | 0.0 |
| Classification | 0.0 | 1.0 | — | 0.0 | 0.0 |
| Summarization | 0.3 | 0.9 | — | 0.0 | 0.0 |
| General Q&A | 0.5 | 0.9 | — | 0.0 | 0.0 |
| Creative writing | 0.8 | 0.95 | — | 0.1 | 0.1 |
| Brainstorming | 1.0 | 1.0 | — | 0.2 | 0.2 |
| Chat application | 0.7 | 0.9 | — | 0.0 | 0.0 |

---

## Model Differences: GPT vs Claude vs Gemini vs Llama

### Architecture Differences

| Aspect | GPT-4 / GPT-5 | Claude 3 / 4 | Gemini 1.5 / 2.0 | Llama 3 / 4 |
|--------|--------------|--------------|-------------------|--------------|
| Architecture | Decoder-only | Decoder-only | Decoder-only | Decoder-only |
| Attention | Full + MQA | Full + Flash | Full + Sparse | GQA |
| Parameters | Estimated 1.7T | Estimated 1-2T | Not disclosed | 8B — 405B |
| Training data | 13T+ tokens | Not disclosed | Not disclosed | 15T+ tokens |
| Context window | 128K (up to 1M) | 200K | 1M — 2M | 128K |
| Knowledge cutoff | Regular updates | Regular updates | Regular updates | ~1 year old |

### Prompting Strengths and Weaknesses

#### GPT-4o / GPT-5.x

**Strengths:**
- Strong instruction following and hierarchy
- Best-in-class structured output (JSON schema enforcement < 0.1% failure)
- Excellent at role-playing and persona adherence
- Strong multilingual performance
- Code generation is consistently high quality

**Weaknesses:**
- Can be overly verbose by default
- Tendency to over-explain simple concepts
- Sometimes overly cautious (refuses legitimate requests)
- Context window "lost in middle" is more pronounced than Claude

**Prompting preferences:**
- Responds well to explicit role definitions
- Benefits from strict formatting instructions
- `system` / `developer` / `user` role separation is effective
- Prefers clear, direct instructions over conversational framing

#### Claude 3.x / 4.x

**Strengths:**
- Superior at long-context tasks (200K native window)
- Excellent writing quality and nuance
- Strong at analysis, comparison, and critique tasks
- Lower "lost in the middle" degradation than GPT
- Good at following XML-structured prompts

**Weaknesses:**
- Verbosity can be harder to control than GPT
- Less reliable structured output than GPT (needs tool-use for best results)
- Can be overly diplomatic / hedging
- Code generation slightly behind GPT on complex multi-file tasks

**Prompting preferences:**
- **XML tags work very well:** `<instructions>`, `<context>`, `<example>`
- Prefers structured, hierarchical prompts
- Benefits from explicit "do not" instructions
- Anticipates user intent — can be leveraged for proactive behavior

#### Gemini 1.5 Pro / 2.5 Pro

**Strengths:**
- Massive context window (1M-2M tokens) — process entire codebases
- Strong multimodal understanding (native, not afterthought)
- Excellent reasoning with step-by-step prompting
- Competitive on code and math benchmarks

**Weaknesses:**
- Less consistent at instruction following than GPT/Claude
- Structured output enforcement is weaker (more prompt-dependent)
- Smaller ecosystem and community resources
- Can be less creative than Claude in writing tasks

**Prompting preferences:**
- Benefits from explicit reasoning instructions ("think step by step")
- Long context should be structured with clear delimiters (markdown headers work well)
- Prefers detailed constraints over vague guidelines
- Responds well to system instruction repetition for emphasis

#### Llama 3 / 4 (and Open-Source)

**Strengths:**
- Self-hosted — no API costs, no data sent externally
- Fine-tunable for specific domains
- Competitive performance for size (8B punches above its weight)
- Growing ecosystem (Ollama, vLLM, TGI)

**Weaknesses:**
- Smaller context windows (128K max)
- More sensitive to prompting format — needs careful structure
- Weaker at nuanced instruction following
- Smaller models (8B, 70B) degrade faster on complex tasks

**Prompting preferences:**
- **Format consistency is critical:** If using `<|begin_of_text|>`, use the exact expected template
- Benefits significantly from few-shot examples (more than proprietary models)
- Works better with shorter, focused prompts
- Temperature adjustment has bigger impact than on larger models

### Selection Guide

| If you need... | Best Model | Runner-up |
|----------------|-----------|-----------|
| Best structured output | GPT-5.x | Claude 4 |
| Long context analysis | Gemini 2.5 Pro | Claude 4 |
| Creative writing | Claude 4 | GPT-5.x |
| Code generation | GPT-5.x | Claude 4 |
| Classification | GPT-5.x | DeepSeek V3 |
| Self-hosted deployment | Llama 4 | Mistral Large |
| Cost-effective | GPT-4o-mini / Llama 3.1 8B | Claude 3.5 Haiku |
| Reasoning (hard problems) | o3 / o4-mini | Gemini 2.5 Pro |
| Multimodal (images/video) | Gemini 2.5 Pro | GPT-5.x |

---

## How Prompts Become Predictions

### Step-by-Step Journey

#### Step 1: Tokenization

The raw prompt text is split into tokens using the model's tokenizer.

```
Input: "Translate to French: Hello"
Tokens: ["Translate", " to", " French", ":", " Hello"]
Token IDs: [562, 311, 1492, 25, 1904]
```

#### Step 2: Embedding

Each token ID is mapped to a dense vector (embedding) that captures semantic meaning.

```
Token "Translate" → [0.23, -0.45, 0.12, ..., 0.67]  (vector size = d_model)
Token "to"       → [0.56, 0.12, -0.34, ..., -0.21]
...
```

These embeddings are learned during training and encode the model's knowledge about each token's usage patterns.

#### Step 3: Position Encoding

Since transformer layers process all tokens simultaneously (not sequentially), **position encoding** is added to tell the model where each token is in the sequence.

Modern models use **RoPE** (Rotary Position Embedding):
- Encodes relative position between tokens
- Better generalization to longer sequences than absolute encodings
- Enables interpolation to longer contexts

#### Step 4: Transformer Layer Processing

The embedded + positioned tokens pass through N transformer layers (typically 32-240), each containing:

```
Layer for each token:
  1. Self-Attention: Look at all other tokens, gather relevant info
     - Compute Q, K, V
     - Attend to relevant context
     - Weighted sum of values
     
  2. Residual Connection: Add original input to attention output
  3. Layer Normalization: Stabilize activations
  4. Feed-Forward Network (MLP): Transform each token individually
     - Expand dimension → ReLU/SwiGLU → Project back
     - This is where "knowledge" is stored (in weight matrices)
  5. Residual Connection + LayerNorm again
```

At each layer, the model refines its representation of each token, incorporating more context from other tokens.

#### Step 5: Final Logits

After all layers, the final hidden state is projected to vocabulary size through an **unembedding** matrix.

```
Hidden state (d_model=8192) → Linear projection (vocab=100K) → Logits (100K values)
```

Each logit score represents how "likely" the model thinks that token is as the next token.

#### Step 6: Sampling

The logits are converted to a probability distribution using the configured sampling strategy:

```
Logits → Softmax (with temperature) → Apply top-P/top-K → Sample → Select token ID
```

For a single forward pass with a 100K vocabulary, the winning token's ID is selected.

#### Step 7: Append and Repeat

The selected token is appended to the input sequence, and the model runs again to predict the next token.

```
Pass 1: ["Translate", " to", " French", ":", " Hello"] → predicts "Bonjour"
Pass 2: ["Translate", " to", " French", ":", " Hello", "Bonjour"] → predicts "!"
Pass 3: ["Translate", " to", " French", ":", " Hello", "Bonjour", "!"] → predicts "<EOS>"
```

Generation stops when:
- The model produces an end-of-sequence token (`<EOS>`)
- The maximum token limit is reached
- A stop sequence is detected (e.g., `\n\n`, `---`)

### Why This Matters for Prompting

**1. Token-level decisions compound**
Every token choice affects all subsequent tokens. A slightly off token in the middle can cascade. This is why:
- Temperature matters: randomness compounds
- Prompt structure matters: it constrains the token path
- Few-shot examples work: they create a strong "path" to follow

**2. The model sees patterns, not meaning**
The model has no internal representation of "truth" — it has learned statistical patterns in token sequences. This is why:
- Careful phrasing is essential (different wording → different patterns → different probabilities)
- Hallucinations happen (the most statistically plausible continuation may be false)
- Consistency checks improve reliability (constraining the model to self-verify)

**3. Context matters everywhere**
Due to attention, any token can influence any other token. This is why:
- Example ordering matters (attention weights are influenced by position)
- Irrelevant context degrades performance (attention budget wasted on noise)
- Clear structure improves performance (helps attention focus on relevant tokens)

**4. Generation is a stochastic process**
The same prompt can produce different outputs because:
- Sampling introduces randomness (temperature > 0)
- GPU floating-point nondeterminism
- Multi-step generation accumulates small differences

This is fixed by: seed parameter, temperature = 0, and structured output constraints.

---

## Practical Implications for Prompt Engineering

### Token Budget Planning

Always allocate your context window proactively:

```
Total context: 128K tokens
  System prompt:    6K   (5%)
  User input:       2K   (1.5%)
  RAG context:     100K  (78%)
  Conversation:     10K  (8%)
  Output reserve:   10K  (8%)
```

### Sampling Strategy Decision Matrix

| Goal | Temperature | Top-P | Reasoning |
|------|-------------|-------|-----------|
| Repeatable results | 0.0 | 1.0 | No randomness |
| Factual Q&A | 0.1 | 0.9 | Slight flexibility for phrasing |
| Classification | 0.0 | 1.0 | Must be consistent |
| Content generation | 0.7 | 0.9 | Standard creative balance |
| Brainstorming | 1.0 | 0.95 | Wide exploration |
| Code | 0.0 | 1.0 | Deterministic preferred |
| Translation | 0.3 | 0.9 | Some flexibility for naturalness |

### Model-Specific Prompt Adjustments

```
When using GPT-5.x:
  → Use system/user/tool role separation
  → Provide explicit JSON schemas for structured output
  → Set temperature low (0.0-0.2) for factual tasks

When using Claude 4.x:
  → Use XML tags: <task>, <context>, <example>
  → Leverage long context for comprehensive reference material
  → Use tool_use for structured extraction

When using Gemini 2.5 Pro:
  → Exploit the 1M+ context window generously
  → Structure long documents with clear markdown headers
  → Explicitly request step-by-step reasoning

When using Llama 4 / open-source:
  → Use exact chat template format required by the model
  → Provide more few-shot examples (3-5 instead of 1-2)
  → Keep prompts shorter and more focused
```

### Common Pitfalls Related to LLM Mechanics

| Pitfall | Cause | Fix |
|---------|-------|-----|
| Output is repetitive | Temperature too low | Increase to 0.7-0.9 |
| Output is incoherent | Temperature too high | Decrease to 0.5-0.8 |
| Model ignores instructions | Instructions in lost-in-middle zone | Move to start or end of prompt |
| Token limits hit unexpectedly | No output headroom reserved | Reserve 10-20% for output |
| Results vary between runs | Temperature > 0, no seed | Set seed + temp=0 for reproducibility |
| Poor performance on long docs | Lack of structure for attention | Add headers, XML tags, clear delimiters |
| Model repeats user input | Strong recency bias | Add "Do not repeat" instruction |

---

## Summary

- **Tokens** are subword units — understanding tokenization helps optimize cost and avoid edge cases
- **Attention** is O(n²) and subject to lost-in-the-middle — put critical information at the start and end
- **Temperature** controls randomness (0 = deterministic, 1+ = creative); always match to task
- **Top-P** dynamically limits candidate tokens based on cumulative probability
- **Models differ** in architecture, strengths, and prompting preferences — adapt your approach
- **Generation is autoregressive** — each token choice compounds, making prompt structure critical

> Next: [02-Anatomy-of-a-Prompt.md](./02-Anatomy-of-a-Prompt.md)
