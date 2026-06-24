# Perfect Prompt Template

## The Universal Formula

```
ROLE + CONTEXT + TASK + FORMAT + CONSTRAINTS + EXAMPLES
```

| Component | Purpose | Required |
|-----------|---------|----------|
| **ROLE** | Defines who the AI should be | Yes |
| **CONTEXT** | Provides background information | Yes |
| **TASK** | Clearly states what to do | Yes |
| **FORMAT** | Specifies output structure | Recommended |
| **CONSTRAINTS** | Sets boundaries and rules | Recommended |
| **EXAMPLES** | Demonstrates desired output | Optional |

---

## Fill-in-the-Blanks Template

### ROLE

```
You are an expert [ROLE] with deep knowledge of [DOMAIN].
You specialize in [SPECIALTY] and have [YEARS] years of experience
working with [CONTEXT/AUDIENCE].
```

**Examples:**
- `You are an expert technical writer with deep knowledge of API documentation.`
- `You are a senior software architect specializing in distributed systems.`
- `You are a world-class copywriter focused on B2B SaaS marketing.`

---

### CONTEXT

```
We are working on [PROJECT/DOMAIN].

Background:
- [KEY FACT 1]
- [KEY FACT 2]
- [KEY FACT 3]

The target audience is [AUDIENCE].
The current situation is [SITUATION].
The desired outcome is [OUTCOME].
```

---

### TASK

```
Your task is to [ACTION] [OBJECT].

Specifically:
1. [STEP 1]
2. [STEP 2]
3. [STEP 3]

Do not [WHAT TO AVOID].
```

**Do vs. Don't:**

| Do ✅ | Don't ❌ |
|------|---------|
| Be specific | Use vague verbs ("handle", "deal with") |
| Break into steps | Write one giant paragraph |
| State what to avoid | Assume the AI knows implicit rules |

---

### FORMAT

```
Output format:

[FORMAT TYPE]: [DETAILS]

Structure:
---
[HEADER]: [CONTENT]
[BULLET]: [CONTENT]
[CODE BLOCK]: [CONTENT]
---

Length: [WORD COUNT / PARAGRAPHS / TOKENS]
Language: [TONE / STYLE / VOICE]
```

**Format examples:**
- `Return a JSON object with the following schema: {...}`
- `Output as a markdown table with columns: Name, Description, Priority`
- `Write exactly 3 paragraphs, each no more than 100 words`
- `Return code blocks with the solution in Python`

---

### CONSTRAINTS

```
Rules:
1. [RULE 1]
2. [RULE 2]
3. [RULE 3]

Boundaries:
- Do NOT: [RESTRICTION]
- Stay within: [SCOPE]
- Must include: [REQUIREMENT]
- Must avoid: [AVOIDANCE]
```

**Common constraints:**
- Token limits (`Keep responses under 500 tokens`)
- Content restrictions (`No markdown formatting`)
- Accuracy requirements (`Cite sources for all claims`)
- Safety rules (`Refuse harmful or unethical requests`)
- Format strictness (`Return ONLY valid JSON — no explanation`)

---

### EXAMPLES

```text
Example 1:
Input:   [SAMPLE INPUT]
Output:  [SAMPLE OUTPUT]

Example 2:
Input:   [SAMPLE INPUT]
Output:  [SAMPLE OUTPUT]

Example 3 (edge case):
Input:   [EDGE CASE INPUT]
Output:  [EXPECTED HANDLING]
```

**Why examples work:**
- Few-shot learning improves accuracy 20-40%
- Clarifies ambiguous instructions
- Shows formatting expectations
- Demonstrates edge case handling
- Aligns model to your specific domain

---

## Complete Template (Copy-Paste Ready)

```
You are an expert [ROLE] with deep knowledge of [DOMAIN].
You specialize in [SPECIALTY].

[CONTEXT]
We are working on [PROJECT].
Background:
- [FACT 1]
- [FACT 2]
Audience: [AUDIENCE]
Goal: [GOAL]

[TASK]
Your task: [ACTION] [OBJECT].
Steps:
1. [STEP 1]
2. [STEP 2]
3. [STEP 3]

[FORMAT]
Output: [FORMAT TYPE]
Structure: [STRUCTURE DESCRIPTION]
Length: [LENGTH LIMIT]

[CONSTRAINTS]
- Do NOT: [RESTRICTION]
- Must: [REQUIREMENT]
- Avoid: [AVOIDANCE]

[EXAMPLES]
Example:
Input: [INPUT]
Output: [OUTPUT]
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│              ROLE                       │
│  "You are an expert [X]..."             │
├─────────────────────────────────────────┤
│              CONTEXT                    │
│  "We are building [Y] for [Z]..."       │
├─────────────────────────────────────────┤
│              TASK                       │
│  "Your task is to [VERB] [OBJECT]..."   │
├─────────────────────────────────────────┤
│              FORMAT                     │
│  "Output as [JSON/MD/Table]..."         │
├─────────────────────────────────────────┤
│              CONSTRAINTS                │
│  "Do NOT [X]. Must include [Y]..."      │
├─────────────────────────────────────────┤
│              EXAMPLES                   │
│  "Input → Output demonstration..."      │
└─────────────────────────────────────────┘
```

## Checklist

- [ ] Role is specific and domain-defined
- [ ] Context includes background, audience, and goal
- [ ] Task is broken into clear steps
- [ ] Format specifies structure, length, and style
- [ ] Constraints cover don'ts, requirements, and scope
- [ ] Examples demonstrate at least one normal and one edge case
- [ ] No ambiguous verbs
- [ ] Token/word count fits model context window
