# CRISPE Framework

> **Capacity/Role, Insight, Statement, Personality, Experiment**
>
> *Best for analysis, research, and exploratory tasks with built-in iteration and comparison*

---

## Overview

CRISPE is a five-component framework designed for tasks that require deep analysis, research synthesis, and exploratory thinking. Its defining feature is the **Experiment** component, which explicitly asks the model to generate multiple variants or compare different approaches — making it ideal for strategic analysis, competitive research, and decision support.

The framework was developed for use cases where a single answer is insufficient and you need to explore the solution space.

---

## Component Breakdown

### C — Capacity / Role

| Aspect | Description |
|--------|-------------|
| **What it is** | The expertise level, credentials, and domain authority the model should assume |
| **Why it matters** | Activates the relevant knowledge subspace in the model — a strategy analyst produces different output than a product manager |
| **What to include** | Years of experience, specific domain, notable achievements, methodological approach |

**Tips:**
- Go beyond simple role naming: "Senior strategy analyst with 15 years in B2B SaaS" not just "Strategy analyst"
- Include methodological preferences: "You approach problems by first identifying key assumptions, then stress-testing them with data"
- The more specific the capacity, the more differentiated the output

**Bad:** "You are an analyst."
**Good:** "You are a competitive strategy analyst with 15 years of experience in B2B SaaS markets. You specialize in market entry strategy, competitive positioning, and risk assessment. You approach analysis by identifying key assumptions first, then stress-testing them with data and counterarguments."

### R — Insight

| Aspect | Description |
|--------|-------------|
| **What it is** | The core insight, observation, or premise that the analysis will explore |
| **Why it matters** | Provides the seed idea — without an insight, the analysis has no starting point |
| **What to include** | The central observation, the data point that triggered the analysis, the hypothesis to test |

**Tips:**
- Phrase as a claim or hypothesis: "Our data suggests X"
- Include supporting evidence the model should consider
- The insight sets direction — make it specific enough to guide the analysis

**Bad:** "Look at the market."
**Good:** "Our company (Acme Analytics) is considering entering the embedded analytics market currently dominated by Tableau, Looker, and Power BI. Our initial research suggests that the mid-market segment ($50-200M companies) is underserved — existing solutions are either too expensive (Tableau) or require too much engineering effort (Looker)."

### I — Statement

| Aspect | Description |
|--------|-------------|
| **What it is** | The precise task statement — what the model should produce |
| **Why it matters** | Frames the core output request and sets the scope of the analysis |
| **What to include** | The action verb, the scope of analysis, the deliverable |

**Tips:**
- Use strong action verbs: "Analyze," "Recommend," "Evaluate," "Compare," "Synthesize"
- Be explicit about scope: what to include, what to leave out
- Link back to the insight — the statement should flow naturally from the insight

**Bad:** "Tell me what to do."
**Good:** "Analyze the competitive landscape and recommend 3 strategic entry approaches with risk assessment for each. Your analysis should cover: (1) market sizing and growth rates by segment, (2) competitive positioning map of current players, (3) barriers to entry, (4) acquisition targets vs. build-from-scratch analysis."

### P — Personality

| Aspect | Description |
|--------|-------------|
| **What it is** | The behavioral style, cognitive approach, and interaction pattern for the output |
| **Why it matters** | Controls how the analysis is framed — a skeptical analyst challenges assumptions, an optimistic one highlights opportunities |
| **What to include** | Intellectual style (skeptical, visionary, pragmatic), communication preference (direct, diplomatic, narrative) |

**Personality archetypes for analysis tasks:**

| Personality | Style | Best For |
|-------------|-------|----------|
| **The Skeptic** | Challenges assumptions, demands evidence, stress-tests claims | Risk assessment, due diligence |
| **The Visionary** | Sees patterns, connects dots, paints future scenarios | Strategy, innovation |
| **The Pragmatist** | Focuses on what's actionable, considers constraints | Implementation planning |
| **The Devil's Advocate** | Deliberately argues against the consensus | Decision validation |
| **The Educator** | Explains clearly, uses analogies, builds understanding | Executive briefing |

**Bad:** "Be professional."
**Good:** "Personality: Direct, data-driven, slightly skeptical. Challenge assumptions. Do not take claims at face value — verify with market data. Use the phrase 'the data suggests' rather than 'I think.' Be willing to say 'we don't have enough evidence to conclude that.'"

### E — Experiment

| Aspect | Description |
|--------|-------------|
| **What it is** | Explicit space for iteration, comparison, and alternative generation |
| **Why it matters** | This is the defining feature of CRISPE — it forces exploration of multiple solutions rather than settling on one |
| **What to include** | Number of variants to generate, dimensions along which to vary, comparison criteria |

**Types of experiments:**

| Type | Description | Example |
|------|-------------|---------|
| **Scenario variants** | Same analysis across different scenarios | Optimistic / pessimistic / baseline |
| **Approach variants** | Different strategic approaches | Aggressive / conservative / balanced |
| **Comparison tables** | Side-by-side evaluation | Weighted decision matrix |
| **Sensitivity analysis** | Vary one parameter at a time | What changes if budget changes? |
| **Counterfactuals** | What if a key assumption is wrong? | "Assume the competitor launches 6 months earlier" |

**Bad:** (no experiment component — single response only)
**Good:** "EXPERIMENT: Generate 3 variants of the recommendation — aggressive (high investment/high reward), conservative (low risk/low reward), and balanced (moderate risk/reward). For each variant, provide: (1) the strategic approach, (2) investment required ($), (3) expected timeline to market, (4) risk factors, (5) key success metrics. Then provide a comparison table ranking the three variants on: speed-to-market, cost-efficiency, defensibility, and execution risk."

---

## Complete Prompt Template

```
CAPACITY: [Expert role, credentials, domain experience, methodological approach]
INSIGHT: [Core observation, hypothesis, or premise to explore]
STATEMENT: [Precise task definition — action verb + scope + deliverable]
PERSONALITY: [Intellectual style, communication preference, behavioral guidelines]
EXPERIMENT: [Variants to generate, dimensions to vary, comparison criteria]
```

---

## Examples

### Example 1: Market Entry Strategy

```
CAPACITY: You are a competitive strategy analyst with 15 years of experience in B2B SaaS markets. You specialize in market entry strategy, competitive positioning, and risk assessment for mid-market tech companies. You approach analysis by first identifying key assumptions, then stress-testing them with data and counterarguments.

INSIGHT: Our company (Acme Analytics, $50M ARR) is considering entering the embedded analytics market. The market is dominated by Tableau (enterprise, expensive), Looker (requires engineering support), and Power BI (Microsoft ecosystem lock-in). Our early research suggests mid-market companies ($50-200M) are underserved — existing solutions are either too expensive or require too much technical investment.

STATEMENT: Analyze the embedded analytics competitive landscape and recommend 3 strategic entry approaches. Cover: (1) market sizing and growth rates by segment, (2) competitive positioning map, (3) barriers to entry, (4) build vs. buy vs. partner analysis, (5) revenue projection by year 3 for each approach.

PERSONALITY: Direct, data-driven, slightly skeptical. Challenge every assumption. Use market data to support all claims. Flag any recommendation where the evidence is weak. Prioritize defensibility over speed. Do not sugarcoat risks.

EXPERIMENT: Generate 3 strategic variants:
  - Variant A (Aggressive): Build a full embedded analytics platform. High investment ($15-20M), highest potential reward, highest risk.
  - Variant B (Conservative): White-label an existing platform (e.g., Metabase, Superset). Low investment ($2-5M), moderate reward, lowest risk.
  - Variant C (Balanced): Build a focused solution for 2-3 verticals (fintech, e-commerce, healthcare). Moderate investment ($8-12M), balanced risk/reward.

For each variant, provide:
  1. Strategic approach description
  2. Investment required and runway
  3. Timeline to MVP and to scale
  4. Top 3 risk factors with mitigation strategies
  5. Year-3 revenue projection (optimistic/baseline/pessimistic)
  6. Key hires or partnerships needed

Final deliverable: A comparison table ranking variants on speed-to-market, cost-efficiency, competitive defensibility, and execution risk. Conclude with the recommended variant and a 12-month execution timeline.
```

### Example 2: Research Paper Critique

```
CAPACITY: You are a senior peer reviewer for top-tier ML conferences (NeurIPS, ICML, ICLR) with expertise in LLM evaluation methods, benchmarking, and statistical rigor. You have reviewed 200+ papers and specialize in identifying methodological flaws and statistical errors.

INSIGHT: The paper claims that a new prompting technique (Chain-of-Symbols) achieves 15% improvement over Chain-of-Thought on mathematical reasoning tasks. However, the evaluation only uses 3 datasets (all math), with sample sizes under 200, and does not report confidence intervals or effect sizes.

STATEMENT: Review the paper's experimental methodology and evaluate the validity of its claims. Identify specific methodological concerns and assess whether the 15% improvement claim is credible.

PERSONALITY: Rigorous, precise, constructive. Praise genuine strengths but do not hesitate to flag fatal flaws. Use the language of statistical rigor. Be specific with your concerns — vague criticism is not helpful. Frame feedback as actionable suggestions for improvement.

EXPERIMENT: Evaluate the paper under 3 different rigor standards:
  - Standard A (Conference acceptance): Would this paper be accepted at a top-tier venue?
  - Standard B (Workshop): Would this paper be accepted at a workshop?
  - Standard C (Industry blog): Is the claim strong enough for a technical blog post?

For each standard, provide:
  1. Overall verdict with confidence level
  2. Top 3 methodological concerns
  3. What additional evidence would change the verdict
  4. A rewritten claims section that honestly reflects the evidence

Include a statistical power analysis: given the reported effect size and sample sizes, what is the minimum detectable effect?
```

### Example 3: Product Strategy Decision

```
CAPACITY: You are a product advisor with experience scaling B2B products from $1M to $100M ARR. You have deep expertise in PLG (product-led growth), pricing strategy, and user research. You prioritize decisions that maximize learning per unit of effort.

INSIGHT: Our product analytics dashboard has a 40% activation rate (users who complete key actions in week 1). We believe adding an interactive onboarding wizard will increase this to 60%+. Engineering estimates 6 weeks to build. Marketing would prefer we invest in a gated whitepaper campaign instead.

STATEMENT: Compare the two approaches (onboarding wizard vs. whitepaper campaign) on their expected impact on activation rate, time-to-value, engineering cost, and revenue. Recommend which to pursue and why.

PERSONALITY: Pragmatic, data-informed, user-centric. Push back on assumptions that lack evidence. Look for the fastest path to learning, not just the fastest path to shipping. Consider opportunity cost.

EXPERIMENT: Run the analysis under 3 scenarios:
  - Scenario 1: Optimistic — whitepaper campaign costs $5K and generates 200 leads, onboarding wizard costs 6 engineering-weeks and improves activation to 65%
  - Scenario 2: Baseline — whitepaper costs $10K and generates 80 leads, onboarding wizard costs 8 engineering-weeks and improves activation to 55%
  - Scenario 3: Pessimistic — whitepaper costs $15K and generates 30 leads, onboarding wizard costs 12 engineering-weeks and improves activation to 48%

For each scenario, provide:
  1. Net expected impact on weekly activated users
  2. Cost per activated user
  3. Time to impact
  4. Secondary effects (SEO, brand, user research insights)
  5. Recommendation with confidence level

Then provide a recommendation matrix that shows which approach wins under each scenario and why.
```

---

## When to Use CRISPE

| Use Case | Why CRISPE Works |
|----------|------------------|
| **Strategic analysis** | Experiment component forces exploration of multiple paths |
| **Competitive research** | Insight + Statement frame the research question precisely |
| **Decision support** | Multiple variants give stakeholders options, not one answer |
| **Paper / proposal review** | Capacity + Personality calibrate rigor level |
| **Product strategy** | Experiment enables scenario planning and sensitivity analysis |
| **Investment analysis** | Variants map to optimistic/baseline/pessimistic cases |

### When NOT to Use CRISPE

| Situation | Better Alternative |
|-----------|-------------------|
| Simple factual queries | RTF or APE |
| Task execution with steps | RISEN |
| Branded content creation | COSTAR |
| Code generation | RTCROS or TIDD-EC |
| Quick rewrite | BAB |

---

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|-------------|-----|
| Weak Capacity | Generic role = generic output | Add years, domain, methodology |
| Insight too vague | Analysis has no direction | Frame as a testable hypothesis |
| Experiment too narrow | Not enough exploration | Vary at least 2-3 dimensions |
| Personality omitted | Output lacks distinctive voice | Choose an archetype (Skeptic, Visionary, etc.) |
| Statement too broad | Analysis tries to cover everything | Limit to 3-5 specific questions |
| Variants not comparable | Hard to decide between them | Use same evaluation criteria across variants |

---

## References

- CRISPE framework: original design by Matt Nigh (personal blog, 2023)
- Adapted for strategic analysis, research, and decision support workflows
- The Experiment component is unique among prompt frameworks — no other standard framework includes explicit iteration/exploration
