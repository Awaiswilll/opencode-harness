# CLEAR Framework

> **Concise, Logical, Explicit, Adaptive, Reflective**
>
> *An evaluation framework for assessing and improving prompt quality*
>
> *Source: Dr Leo S Lo, Texas A&M University-Corpus Christi*

---

## Overview

CLEAR is **not** a prompt formula or template — it is an **evaluation framework** for diagnosing and improving prompts. While other frameworks (COSTAR, RISEN, CRISPE) help you *write* prompts, CLEAR helps you *critique* them.

Use CLEAR after drafting a prompt, before shipping it to production. Ask the five questions. If any answer is "no" or "not sure," revise the prompt.

---

## The Five Axes

### C — Concise

| Question | Is the prompt brief and clear? Can I remove words? |
|----------|----------------------------------------------------|
| **Goal** | Eliminate redundancy, fluff, and unnecessary qualification |
| **Signal** | Every word earns its place — if removing a word does not change meaning, remove it |
| **Anti-pattern** | "I was wondering if you could perhaps help me with..." → "Complete this task:" |

**Concise checklist:**

- [ ] Can I delete any sentence without losing meaning?
- [ ] Are there hedges or qualifiers ("perhaps," "maybe," "I think")?
- [ ] Are there redundant instructions (same directive said two ways)?
- [ ] Is there introductory small talk or preamble?
- [ ] Can I replace a phrase with a shorter one? ("in order to" → "to"; "due to the fact that" → "because")
- [ ] Is the prompt shorter than 80% of its current length while preserving all requirements?

**Before (wordy):**
```
I was wondering if you could perhaps take a look at the following piece of code that I wrote and see if there might be any issues with it that I should be aware of. It would be really helpful if you could check for bugs or any potential problems. Thanks so much!
```

**After (concise):**
```
Review this code for bugs and potential issues. Report each finding with severity and location.
```

### L — Logical

| Question | Is the prompt structured and coherent? Does it flow? |
|----------|------------------------------------------------------|
| **Goal** | Information is ordered so the model processes it in a sensible sequence |
| **Signal** | The prompt has a beginning (context/role), middle (task), and end (format/constraints) |
| **Anti-pattern** | Random ordering of instructions, format spec before context, constraints scattered |

**Logical structure checklist:**

- [ ] Does the prompt follow a clear sequence (Role → Context → Task → Format → Constraints)?
- [ ] Are related instructions grouped together?
- [ ] Is there a single, unambiguous interpretation?
- [ ] Does each sentence naturally follow from the previous one?
- [ ] If the prompt is long, does it use visual structure (headings, separators, numbered lists)?
- [ ] Would two different people interpret the prompt the same way?

**Logical ordering principle:**

```
1. WHO (role / identity)
2. WHAT (context / background)
3. TASK (core instruction)
4. HOW (format / style / constraints)
5. WHAT NOT (exclusions / negative constraints)
```

**Before (disorganized):**
```
Format the output as JSON. You are a data analyst. Do not include explanations. Analyze the attached sales data. Use ISO date format. The data covers Q1 2026.
```

**After (logical):**
```
You are a data analyst.

The attached sales data covers Q1 2026.

Analyze the sales data and identify: top 3 products by revenue, month-over-month growth rate, and regional trends.

Output format: JSON with fields: product_name, revenue, growth_rate, region.
Constraints: Use ISO 8601 date format. Do NOT include explanations or commentary outside the JSON.
```

### E — Explicit

| Question | Are output specifications clear? Format, length, constraints? |
|----------|--------------------------------------------------------------|
| **Goal** | Leave nothing to interpretation — specify exactly what you want |
| **Signal** | The model could produce the correct output without guessing any parameter |
| **Anti-pattern** | "Be concise" (vague) vs. "Maximum 100 words, 3 bullet points, no introductory phrases" (explicit) |

**Explicit checklist:**

- [ ] Is the output format specified? (JSON, markdown, bullet list, prose, table)
- [ ] Is the exact length specified? (word count, sentence count, bullet count, token limit)
- [ ] Are tone and style directives explicit? (not "professional" but "formal, third-person, passive voice")
- [ ] Are all constraints stated as dos AND don'ts?
- [ ] Are there examples showing the desired output?
- [ ] Would the model know when to stop generating?
- [ ] Are edge cases addressed? (what if no results found? what if input is invalid?)

**Vague vs. Explicit comparison:**

| Vague | Explicit |
|-------|----------|
| "Be concise" | "Maximum 100 words. No introductory phrases. Start with the answer." |
| "Use the right tone" | "Tone: Empathetic, warm, patient. Use phrases like 'I understand.' Validate before solving." |
| "Format nicely" | "Format: Markdown with headings (H2 for sections, H3 for subsections), bullet lists, bold for key terms." |
| "Analyze the data" | "Analyze the data and produce: (1) 3-sentence executive summary, (2) key findings as numbered list, (3) 1 table comparing Q1 vs Q4 metrics." |

### A — Adaptive

| Question | Can I customize this for different scenarios? |
|----------|----------------------------------------------|
| **Goal** | The prompt is modular — components can be swapped without breaking the structure |
| **Signal** | The prompt has clear "slots" or sections that can be filled in per use case |
| **Anti-pattern** | A monolithic prompt that requires full rewrite for each new use case |

**Adaptive checklist:**

- [ ] Can I change the role/task/format without rewriting the entire prompt?
- [ ] Are variable sections clearly marked? ([CONTEXT], [TASK], [FORMAT])
- [ ] Is the prompt structured as a template with replaceable blocks?
- [ ] Does the prompt work for multiple similar use cases?
- [ ] Could another team member use this prompt with minimal modification?
- [ ] Is there a version history or documented intent?

**Template pattern for adaptability:**

```
# [PROMPT_NAME]
# Variables: [ROLE], [TASK], [OUTPUT_FORMAT], [CONSTRAINTS]

You are [ROLE].
[CONTEXT – optional background paragraph]

Your task: [TASK]

Output format: [OUTPUT_FORMAT]

Constraints: [CONSTRAINTS]
```

**Non-adaptive prompt:**
```
You are a marketing writer. Write a launch email for our new AI feature. The audience is engineering managers. Tone should be confident. Format: email with subject line and body.
```

**Adaptive template:**
```
You are a [ROLE].

We are [COMPANY], a [DESCRIPTION]. We are launching [PRODUCT/FEATURE] that [KEY BENEFIT].

Create a [CONTENT_TYPE] targeting [AUDIENCE] that achieves [OBJECTIVE].

TONE: [TONE_DIRECTIVE]
STYLE: [STYLE_DIRECTIVE]
FORMAT: [FORMAT_SPECIFICATION]

Constraints:
- [CONSTRAINT_1]
- [CONSTRAINT_2]

---
CURRENT USE:
ROLE: marketing writer
COMPANY: Sprintly, a project management SaaS
PRODUCT: AI-powered sprint planning feature
AUDIENCE: Engineering managers at 50-500 person companies
OBJECTIVE: Drive beta waitlist sign-ups
TONE: Confident but credible
FORMAT: Email with subject line (6 options), opening paragraph, 3 bullet benefits, CTA
```

### R — Reflective

| Question | Did the output meet expectations? How can I improve? |
|----------|------------------------------------------------------|
| **Goal** | Build a feedback loop for continuous prompt improvement |
| **Signal** | You can point to specific output issues and trace them to specific prompt components |
| **Anti-pattern** | "The output was bad" without knowing why, or tweaking randomly without hypothesis |

**Reflective checklist:**

- [ ] Did the output match the format specification? If not, which part of the format was ambiguous?
- [ ] Did the output match the tone/style? If not, was the tone directive specific enough?
- [ ] Did the model follow the constraints? If not, were constraints explicit enough?
- [ ] Did the model add anything not requested? → Add Narrowing (RISEN) or constraints
- [ ] Was the output too long/short? → Adjust length specification
- [ ] Did the model miss any requirements? → Check the Instructions component
- [ ] Did the output feel generic? → Strengthen Role/Capacity with more specifics
- [ ] Can I identify which prompt change would fix the issue?

**Reflective process:**

```
1. Run prompt → observe output
2. Identify specific gap(s) between expected and actual
3. Trace gap to specific prompt component(s)
4. Form hypothesis: "If I change [COMPONENT] to [NEW_VALUE], the output will improve by [CRITERIA]"
5. Apply change → re-run → compare
6. Document what changed and why
```

**Example reflective log:**

| Run | Issue | Cause | Fix | Result |
|-----|-------|-------|-----|--------|
| 1 | Output was 400 words, requested 200 | Length not specified explicitly | Added "Maximum 200 words" | Output: 210 words |
| 2 | Model suggested features not asked for | No narrowing component | Added "Do NOT suggest features not mentioned in the input" | Output stayed in scope |
| 3 | Tone too formal | "Professional" is ambiguous | Changed to "Conversational, use contractions, keep sentences under 15 words" | Output matched desired tone |
| 4 | JSON was valid but missing required fields | Format spec was incomplete | Provided exact JSON schema with required fields | Output matched schema exactly |

---

## Prompt Improvement Checklist

Use this checklist after drafting every prompt:

### Concise
- [ ] Remove all introductory phrases ("I'd be happy to...", "Sure! Here is...")
- [ ] Remove hedges and qualifiers
- [ ] Replace wordy phrases with short equivalents
- [ ] Confirm every sentence adds value

### Logical
- [ ] Order: Role → Context → Task → Format → Constraints
- [ ] Group related instructions
- [ ] Use numbered lists for sequential steps
- [ ] Use visual structure (headings, separators) for long prompts

### Explicit
- [ ] Specify exact output format
- [ ] Specify exact length (word count or range)
- [ ] Use dos AND don'ts
- [ ] Include at least 1 example if output format is complex
- [ ] Address edge cases (empty results, invalid input)

### Adaptive
- [ ] Template-ize variable sections (marked with [VARIABLE])
- [ ] Design for reuse across similar scenarios
- [ ] Add a variables legend at the bottom

### Reflective
- [ ] Run the prompt and evaluate output against each requirement
- [ ] Identify specific gaps → trace to specific prompt components
- [ ] Make one change at a time and re-test
- [ ] Version-control prompts with changelogs

---

## CLEAR Applied to Other Frameworks

| Framework | CLEAR Evaluation |
|-----------|-----------------|
| **COSTAR** | Check: Is Context concise? Is Audience explicit? Is Response format specific? |
| **RISEN** | Check: Are Steps logical? Is Narrowing explicit? Is End Goal measurable? |
| **CRISPE** | Check: Is Insight explicit? Is Statement concise? Is Personality adaptive? |
| **RTF** | Check: Is Role explicit? Is Task concise? Is Format adaptive? |
| **RTCROS** | Check: Are Requirements explicit? Are Stop Conditions concise? |

---

## When to Use CLEAR

| Use Case | How to Apply |
|----------|-------------|
| **After drafting a prompt** | Run the 5-axis checklist before first test |
| **Before shipping to production** | Audit with CLEAR as a quality gate |
| **Debugging poor outputs** | Use Reflective to trace issues to components |
| **Reviewing team prompts** | Apply CLEAR as a peer review rubric |
| **Building a prompt library** | Use Adaptive to ensure templates are modular |
| **Training new prompt engineers** | Teach CLEAR as the critique methodology |

---

## References

- Dr Leo S Lo, Texas A&M University-Corpus Christi — original CLEAR framework publication
- CLEAR is the only widely-adopted evaluation framework for prompt quality (as opposed to prompt construction)
- Complements the PEEM framework (Prompt Engineering Evaluation Metrics, arXiv 2026) which provides quantitative evaluation axes
