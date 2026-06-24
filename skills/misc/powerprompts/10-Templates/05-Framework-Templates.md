# Framework Templates

Collection of structured prompting frameworks. Each provides a fill-in-the-blanks template.

---

## 1. COSTAR Framework

Best for: **Persuasive content, marketing, proposals, and structured reasoning.**

| Letter | Meaning | Purpose |
|--------|---------|---------|
| **C** | **C**ontext | Background information |
| **O** | **O**bjective | Goal to achieve |
| **S** | **S**tyle | Writing style / tone |
| **T** | **T**one | Emotional register |
| **A** | **A**udience | Target reader |
| **R** | **R**esponse | Expected output format |

### Template

```
## Context
[Provide background information about the situation, domain, or problem.
Include relevant facts, constraints, and history.]

## Objective
[State the specific goal. What should the output achieve?
Use measurable criteria when possible.]

## Style
[Define the writing style. Examples: academic, conversational, technical,
persuasive, instructional, minimalist, elaborate.]

## Tone
[Set the emotional register. Examples: professional, empathetic, urgent,
authoritative, friendly, neutral, enthusiastic.]

## Audience
[Describe the target reader. Include:
- Who they are
- Their knowledge level
- Their needs and motivations
- Potential objections]

## Response
[Specify the output format. Examples:
- Format: markdown report, JSON, email, bullet points
- Length: [X] words/paragraphs
- Structure: [specific sections or layout]]
```

### Example

```
## Context
We are launching a new project management tool called "FlowSync"
targeted at remote teams. The market is crowded with tools like
Asana, Monday.com, and Notion.

## Objective
Write a landing page headline and subheading that differentiates
FlowSync as the tool that "feels like it was built for your team."

## Style
Persuasive, benefit-driven, concise. Apple-like minimalism.

## Tone
Confident, warm, innovative. Not pushy or desperate.

## Audience
Remote team leads and CTOs at 20-200 person companies.
They are tired of bloated tools. They value speed and simplicity.

## Response
Format: Headline (max 10 words) + Subheading (max 25 words)
Tone should convey: "Finally, a tool that just works."
```

---

## 2. CRISPE Framework

Best for: **Creative briefs, strategic planning, and complex task specification.**

| Letter | Meaning | Purpose |
|--------|---------|---------|
| **C** | **C**apacity | The AI's role |
| **I** | **I**nsight | Underlying context |
| **S** | **S**tatement | Core task |
| **P** | **P**ersonality | Tone / character |
| **E** | **E**xperiment | Ask for multiple options |

### Template

```
## Capacity
Act as [ROLE] with expertise in [DOMAIN].
You have [SPECIFIC KNOWLEDGE / EXPERIENCE].

## Insight
The background context is:
- Situation: [WHAT IS HAPPENING]
- Problem: [WHAT IS WRONG]
- Stakeholders: [WHO IS INVOLVED]
- Constraints: [BOUNDARIES]

## Statement
Your task: [CORE INSTRUCTION].
Success criteria:
1. [CRITERION 1]
2. [CRITERION 2]
3. [CRITERION 3]

## Personality
Adopt the following persona in your response:
- Tone: [TONE]
- Character: [CHARACTER TRAITS]
- Communication: [DIRECT / STORYTELLING / ANALYTICAL / ETC.]

## Experiment
Provide [NUMBER] different approaches or variations.
For each, highlight:
- The approach
- Why it works
- Trade-offs or risks
```

### Example

```
## Capacity
Act as a product strategist with expertise in B2B SaaS growth.

## Insight
Our product has strong engagement but poor conversion from free to paid.
Users love the product but don't see enough value to upgrade.

## Statement
Design 3 pricing strategies that increase conversion by 20%.
Consider: usage-based, feature-gated, and time-limited approaches.

## Personality
Strategic, data-driven, creative. Think like a McKinsey consultant.

## Experiment
Provide 3 strategies. For each: the approach, expected impact, risks.
```

---

## 3. RISEN Framework

Best for: **Verification tasks, fact-checking, quality assurance, and analysis.**

| Letter | Meaning | Purpose |
|--------|---------|---------|
| **R** | **R**ole | AI's perspective |
| **I** | **I**nstructions | What to do |
| **S** | **S**teps | Process to follow |
| **E** | **E**nd goal | Success definition |
| **N** | **N**uancing | Edge cases / exceptions |

### Template

```
## Role
You are an expert in [DOMAIN] acting as [SPECIFIC ROLE].
Your perspective is [POINT OF VIEW].

## Instructions
1. [INSTRUCTION 1]
2. [INSTRUCTION 2]
3. [INSTRUCTION 3]

## Steps
Follow this process:
Step 1: [ACTION]
Step 2: [ACTION]
Step 3: [ACTION]
Step 4: [ACTION]

## End Goal
A successful response must:
- [REQUIREMENT 1]
- [REQUIREMENT 2]
- [REQUIREMENT 3]

## Nuancing
Special considerations:
- If [CONDITION]: [ADJUSTMENT]
- If [CONDITION]: [ADJUSTMENT]
- If information is insufficient: [FALLBACK]
- If conflicting data: [RESOLUTION]
```

### Example

```
## Role
You are a senior code reviewer with expertise in Python security.

## Instructions
Review the provided code for security vulnerabilities.

## Steps
Step 1: Scan for injection vulnerabilities
Step 2: Check authentication and authorization logic
Step 3: Review data validation and sanitization
Step 4: Document findings with severity levels

## End Goal
A prioritized list of vulnerabilities with:
- Severity (Critical / High / Medium / Low)
- Line number
- Description
- Remediation suggestion

## Nuancing
- Ignore style issues (focus on security only)
- For false positives, mark as "Info" not "Medium+"
- If code is incomplete, note what's missing
```

---

## 4. RTCROS Framework

Best for: **System prompts, complex multi-step instructions, and production deployment.**

| Letter | Meaning | Purpose |
|--------|---------|---------|
| **R** | **R**ole | Identity |
| **T** | **T**ask | Primary action |
| **C** | **C**ontext | Background |
| **R** | **R**ules | Behavioral constraints |
| **O** | **O**utput | Expected result format |
| **S** | **S**afety | Guardrails |

### Template

```
## Role
You are [ROLE]. You have [QUALIFICATIONS].

## Task
Your primary task: [TASK DESCRIPTION]

Subtasks (in order):
1. [SUBTASK 1]
2. [SUBTASK 2]
3. [SUBTASK 3]

## Context
System: [SYSTEM / PLATFORM]
Domain: [DOMAIN]
Users: [USER DESCRIPTION]
Previous interactions: [HISTORY / STATE]

## Rules
1. [RULE 1]
2. [RULE 2]
3. [RULE 3]

Decision framework:
- If [CONDITION]: [OUTCOME]
- If [CONDITION]: [OUTCOME]
- Default: [DEFAULT]

## Output
Structure:
[SECTION 1]
[SECTION 2]
[SECTION 3]

Format: [JSON / Markdown / Plain text / etc.]
Length: [WORD / TOKEN LIMIT]
Style: [TONE / VOICE / TECHNICAL LEVEL]

## Safety
Hard blocks:
- Never: [PROHIBITION 1]
- Never: [PROHIBITION 2]
- Always: [REQUIREMENT 1]

Escalation:
- If [TRIGGER]: [ESCALATION PATH]
- If unsure: [DEFAULT SAFE RESPONSE]
```

### Example

```
## Role
You are a medical triage assistant trained on WHO guidelines.

## Task
Assess patient symptoms and recommend urgency level.

## Context
Platform: Telehealth chat
Users: Patients describing symptoms
Domain: Primary care triage

## Rules
1. Never diagnose specific conditions
2. Always ask about emergency symptoms first
3. Recommend ER if any red-flag symptom present

## Output
Urgency: [Emergent / Urgent / Non-urgent]
Reasoning: [1-2 sentence rationale]
Recommendation: [specific next step]

## Safety
- Never: prescribe medication
- Never: override doctor advice
- Always: include disclaimer about AI limitations
- Escalate: if patient mentions suicidal ideation
```

---

## Framework Selection Guide

| Framework | Best For | Output Type |
|-----------|----------|-------------|
| **COSTAR** | Persuasive content, marketing | Structured narrative |
| **CRISPE** | Creative strategy, complex tasks | Multiple options |
| **RISEN** | Verification, analysis, review | Evaluative report |
| **RTCROS** | System prompts, production | Executable instructions |

## Quick Reference Card

```
COSTAR: Context + Objective + Style + Tone + Audience + Response
CRISPE: Capacity + Insight + Statement + Personality + Experiment
RISEN:  Role + Instructions + Steps + End goal + Nuancing
RTCROS: Role + Task + Context + Rules + Output + Safety
```
