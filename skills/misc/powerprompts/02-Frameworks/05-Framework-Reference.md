# Framework Reference

> **Complete reference for all prompt engineering frameworks, combination patterns, and selection guide**

---

## Table of Contents

1. [APE Framework](#ape-framework)
2. [RTF Framework](#rtf-framework)
3. [BAB Framework](#bab-framework)
4. [RACE Framework](#race-framework)
5. [CARE Framework](#care-framework)
6. [TAG Framework](#tag-framework)
7. [COAST Framework](#coast-framework)
8. [IDEA Framework](#idea-framework)
9. [TRACE Framework](#trace-framework)
10. [GUIDE Framework](#guide-framework)
11. [FOCUS Framework](#focus-framework)
12. [ORCA Framework](#orca-framework)
13. [RASCE Framework](#rasce-framework)
14. [ROLES Framework](#roles-framework)
15. [PECRA Framework](#pecra-framework)
16. [TIDD-EC Framework](#tidd-ec-framework)
17. [CRAFT Framework](#craft-framework)
18. [RTCROS Framework](#rtcros-framework)
19. [Framework Combination Patterns](#framework-combination-patterns)
20. [Selection Guide](#selection-guide)
21. [Quick Comparison Matrix](#quick-comparison-matrix)

---

## APE Framework

| Acronym | Action, Purpose, Expectation |
|---------|------------------------------|
| **Best For** | Ultra-minimal one-off prompts — quick tasks with no complexity |
| **Components** | 3 |
| **Typical Length** | 1-3 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **A** | **Action** | The specific action the model should take |
| **P** | **Purpose** | Why this action is needed — the desired outcome |
| **E** | **Expectation** | What the output should look like |

### Template

```
ACTION: [Verb-led instruction]
PURPOSE: [Goal or reason for the task]
EXPECTATION: [Format, length, or quality bar]
```

### Example

```
ACTION: Summarize the attached quarterly report
PURPOSE: I need a 2-minute briefing for an executive team meeting
EXPECTATION: 5 bullet points, each under 20 words, ordered by business impact
```

### Strengths & Limitations

| Strengths | Limitations |
|-----------|-------------|
| Fast to write and deploy | Lacks role/capacity definition |
| Minimal token usage | No scope narrowing or exclusions |
| Easy to remember | No style or tone control |
| Works for simple factual tasks | Poor for complex, creative, or multi-step tasks |

---

## RTF Framework

| Acronym | Role, Task, Format |
|---------|---------------------|
| **Best For** | Simple, focused tasks where role + format is the main requirement |
| **Components** | 3 |
| **Typical Length** | 2-4 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **R** | **Role** | The persona the model should adopt |
| **T** | **Task** | What to do — precise imperative |
| **F** | **Format** | Output structure and delivery specification |

### Template

```
ROLE: [Expert persona]
TASK: [Instruction — what to do]
FORMAT: [Output structure]
```

### Example

```
ROLE: Senior copywriter specializing in B2B SaaS
TASK: Write a LinkedIn post about the attached case study
FORMAT: 150 words max, 3-5 line breaks for readability, 5 hashtags at end, no emoji
```

### Strengths & Limitations

| Strengths | Limitations |
|-----------|-------------|
| Simple 3-part structure | No context or background |
| Quick to adapt | No tone or audience specification |
| Good for repeatable short-form tasks | No narrowing or constraints |
| Covers the essentials | Poor for complex analysis or multi-step work |

---

## BAB Framework

| Acronym | Before, After, Bridge |
|---------|------------------------|
| **Best For** | Rewriting, refactoring, transforming content |
| **Components** | 3 |
| **Typical Length** | 3-6 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **B** | **Before** | The current state of the content |
| **A** | **After** | The desired state of the content |
| **B** | **Bridge** | The transformation to apply |

### Template

```
BEFORE: [Current content — what exists now]
AFTER: [Desired outcome — what it should become]
BRIDGE: [Specific changes or instructions for the transformation]
```

### Example

```
BEFORE: Our current error message says "An error occurred. Please try again later." Users find this unhelpful because it gives no indication of what went wrong or how to fix it.

AFTER: An error message that tells the user exactly what went wrong, why it happened, and what they can do about it. Tone: helpful, not technical. Max 2 sentences.

BRIDGE: Rewrite the message to include: (1) what happened in plain language, (2) the most likely cause, (3) the specific next step the user should take. Use the pattern: "We couldn't [ACTION] because [REASON]. To fix this, [SOLUTION]."
```

### Strengths & Limitations

| Strengths | Limitations |
|-----------|-------------|
| Perfect for edits and rewrites | Not for original content generation |
| Clear delta specification | Requires existing content to transform |
| Forces explicit change description | No role or audience control |
| Good for maintaining consistency | Limited for complex transformations |

### Use Cases

- Refactoring error messages
- Rephrasing documentation
- Converting tutorial formats (video → text, code → explanation)
- Simplifying technical language
- Translating between tone registers

---

## RACE Framework

| Acronym | Role, Action, Context, Expectation |
|---------|-------------------------------------|
| **Best For** | Expert tasks with clear role + outcome clarity |
| **Components** | 4 |
| **Typical Length** | 4-6 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **R** | **Role** | Expert persona |
| **A** | **Action** | Specific verb-led instruction |
| **C** | **Context** | Background and situation |
| **E** | **Expectation** | Quality bar and output specification |

### Template

```
ROLE: [Expert persona]
ACTION: [Instruction]
CONTEXT: [Background information]
EXPECTATION: [Output format, quality, constraints]
```

### Example

```
ROLE: You are a UX researcher with 8 years of experience in SaaS product design
ACTION: Analyze the attached user interview transcripts and identify recurring pain points
CONTEXT: We interviewed 12 users of our project management tool. Users range from individual contributors to engineering managers. The goal is to inform our Q3 product roadmap.
EXPECTATION: A report with: top 5 pain points ranked by frequency, 1-2 representative quotes per pain point, severity rating (High/Medium/Low), and a suggested design direction for each
```

### Strengths & Limitations

| Strengths | Limitations |
|-----------|-------------|
| Adds Context missing from RTF | No narrowing/exclusions |
| Covers role + outcome clearly | No personality or tone control |
| Good for research and analysis | Experiment/iteration not built in |

---

## CARE Framework

| Acronym | Context, Action, Result, Example |
|---------|-----------------------------------|
| **Best For** | Constraint-driven tasks with rules and examples |
| **Components** | 4 |
| **Typical Length** | 4-8 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **C** | **Context** | Background and relevant constraints |
| **A** | **Action** | What the model should do |
| **R** | **Result** | What success looks like |
| **E** | **Example** | 1-3 examples of desired output |

### Template

```
CONTEXT: [Background + constraints]
ACTION: [Instruction]
RESULT: [Definition of success]
EXAMPLE: [Example input → output pair]
```

### Example

```
CONTEXT: We are writing documentation for a developer API. Our users are experienced Python developers who need minimal hand-holding. The documentation must follow Google style guide conventions.

ACTION: Write the docstring for the following function, including: description, Args, Returns, Raises, and a usage example.

RESULT: Each docstring section must be complete but concise. Args should include type and description. Raises should list each exception and when it occurs.

EXAMPLE:
def process_payment(user_id: int, amount: Decimal, currency: str = "USD") -> str:
    """Process a payment for a user.

    Charges the user's default payment method and creates a transaction record.

    Args:
        user_id: Internal user identifier.
        amount: Payment amount in the smallest currency unit (cents).
        currency: ISO 4217 currency code. Defaults to "USD".

    Returns:
        Transaction ID string.

    Raises:
        ValueError: If amount is negative or user_id is invalid.
        PaymentFailedError: If the payment provider declines the charge.
    """
```

### Strengths & Limitations

| Strengths | Limitations |
|-----------|-------------|
| Examples constrain output strongly | Less flexible for creative tasks |
| Good for code/code-adjacent work | Examples can bias output |
| Result defines success clearly | No role definition |

---

## TAG Framework

| Acronym | Task, Action, Goal |
|---------|---------------------|
| **Best For** | Simple task definitions — the minimal viable prompt |
| **Components** | 3 |
| **Typical Length** | 1-3 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **T** | **Task** | The overall task description |
| **A** | **Action** | The specific instruction |
| **G** | **Goal** | The intended outcome |

### Template

```
TASK: [Overall task area]
ACTION: [Specific instruction]
GOAL: [Intended outcome]
```

### Example

```
TASK: Review our customer feedback survey results
ACTION: Categorize all open-ended responses into themes
GOAL: Understand the top 3 reasons for churn this quarter
```

---

## COAST Framework

| Acronym | Context, Objective, Actions, Scenario, Task |
|---------|----------------------------------------------|
| **Best For** | Feature ideas → user stories; product requirement documents |
| **Components** | 5 |
| **Typical Length** | 6-10 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **C** | **Context** | Background — what exists, what has been tried |
| **O** | **Objective** | What success looks like |
| **A** | **Actions** | What to do or what the user will do |
| **S** | **Scenario** | When and where this applies |
| **T** | **Task** | The specific deliverable |

### Template

```
CONTEXT: [Background and current state]
OBJECTIVE: [Success criteria]
ACTIONS: [What to do or user actions to support]
SCENARIO: [Timing and conditions]
TASK: [Specific deliverable]
```

### Example

```
CONTEXT: Our project management app has a sprint planning feature, but users find it time-consuming to estimate tasks. We have data showing teams spend 2+ hours per sprint in planning meetings.

OBJECTIVE: Reduce sprint planning time by 50% while maintaining estimation accuracy.

ACTIONS:
  - Allow users to input historical sprint data
  - Auto-generate estimates based on similar past tasks
  - Let users adjust AI estimates with one click

SCENARIO: During sprint planning, after tasks have been added to the backlog but before sprint commitment.

TASK: Write 3 user stories following the format: "As a [role], I want [capability] so that [benefit]."
```

---

## IDEA Framework

| Acronym | Intent, Details, Examples, Adjustments |
|---------|-----------------------------------------|
| **Best For** | Creative brainstorming, ideation, iterative content design |
| **Components** | 4 |
| **Typical Length** | 4-8 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **I** | **Intent** | The overall goal or creative direction |
| **D** | **Details** | Specific requirements or constraints |
| **E** | **Examples** | Reference examples for style/format |
| **A** | **Adjustments** | Parameters the model can vary |

### Template

```
INTENT: [Creative direction / goal]
DETAILS: [Specific requirements and constraints]
EXAMPLES: [Reference examples]
ADJUSTMENTS: [Parameters to vary or explore]
```

### Example

```
INTENT: Generate tagline options for our new AI-powered meeting assistant product. The tagline should convey: saves time, reduces friction, works with existing tools.

DETAILS: B2B SaaS product called "MeetWise." Target audience is busy executives and team leads. Max 8 words per tagline. No jargon or technical terms.

EXAMPLES:
  - Slack: "Where work happens"
  - Zoom: "Bringing the world together, one meeting at a time"
  - Calendly: "Schedule without the back-and-forth"

ADJUSTMENTS: Generate 3 variants — (1) short and punchy (3-4 words), (2) benefit-focused (6-8 words), (3) clever/wordplay. 5 options per variant.
```

---

## TRACE Framework

| Acronym | Task, Request, Action, Context, Example |
|---------|------------------------------------------|
| **Best For** | Multi-step instructions with examples |
| **Components** | 5 |
| **Typical Length** | 6-12 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **T** | **Task** | The overall task |
| **R** | **Request** | The specific ask |
| **A** | **Action** | What to do, step by step |
| **C** | **Context** | Background information |
| **E** | **Example** | Demonstrations of desired output |

### Template

```
TASK: [Overall purpose]
REQUEST: [Specific ask]
ACTION: [Steps to execute]
CONTEXT: [Background]
EXAMPLE: [Input → output demonstration]
```

### Example

```
TASK: Generate customer-facing documentation for a new API endpoint.

REQUEST: Write the documentation section for the /v2/invoices endpoint following our existing API docs pattern.

ACTION:
  1. Parse the provided OpenAPI spec for the endpoint
  2. Write an overview paragraph (what this endpoint does, when to use it)
  3. Document authentication requirements
  4. List and describe all parameters with types and constraints
  5. Show request and response examples (JSON)
  6. Document error codes and their meanings

CONTEXT: Our existing API docs use the following structure: Overview > Authentication > Parameters > Request Example > Response Example > Errors. The audience is developers building integrations with our platform.

EXAMPLE:
  [Reference link to existing endpoint documentation]
```

---

## GUIDE Framework

| Acronym | Goal, Understanding, Information, Direction, Evaluation |
|---------|----------------------------------------------------------|
| **Best For** | Pedagogical prompts — teaching, explaining, tutoring |
| **Components** | 5 |
| **Typical Length** | 6-10 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **G** | **Goal** | Learning objective |
| **U** | **Understanding** | Current knowledge level of the learner |
| **I** | **Information** | Content to teach or reference |
| **D** | **Direction** | Teaching approach and methodology |
| **E** | **Evaluation** | How to check understanding |

### Template

```
GOAL: [Learning objective]
UNDERSTANDING: [Learner's current knowledge level]
INFORMATION: [Content to teach]
DIRECTION: [Teaching approach]
EVALUATION: [How to verify understanding]
```

### Example

```
GOAL: Teach a junior developer how to debug Python memory leaks using the tracemalloc module.

UNDERSTANDING: The developer knows Python syntax and basic debugging (print statements, logging) but has never used memory profiling tools. They understand concepts like garbage collection at a surface level.

INFORMATION: Cover these topics in order:
  1. What memory leaks look like in Python (symptoms, detection)
  2. Using tracemalloc to trace memory allocations
  3. Common causes: circular references, global caches, closures, unclosed file handles
  4. Using gc module to find uncollectable objects
  5. Best practices for prevention

DIRECTION: 
  - Start with a concrete example of a memory leak, not theory
  - Show the debugging process step-by-step with real code
  - Explain WHY each step works, not just WHAT to do
  - Use analogies where helpful
  - Pause after each major concept and offer to dive deeper

EVALUATION: After teaching, provide 2 practice debugging scenarios:
  1. A small code snippet with a memory leak — ask them to identify and fix it
  2. A description of a production incident with memory growth — ask them to describe their debugging approach
```

---

## FOCUS Framework

| Acronym | Function, Outcome, Criteria, Underlying Assumptions, Strategy |
|---------|---------------------------------------------------------------|
| **Best For** | Strategic analysis, decision-making, planning |
| **Components** | 5 |
| **Typical Length** | 8-12 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **F** | **Function** | The role or system being analyzed |
| **O** | **Outcome** | Desired result |
| **C** | **Criteria** | Success metrics and evaluation dimensions |
| **U** | **Underlying Assumptions** | Beliefs being taken as true |
| **S** | **Strategy** | Approach to achieve the outcome |

### Template

```
FUNCTION: [System, role, or entity being analyzed]
OUTCOME: [Desired result]
CRITERIA: [Success metrics and evaluation dimensions]
UNDERLYING ASSUMPTIONS: [Beliefs being taken as true]
STRATEGY: [Approach to achieve outcome]
```

### Example

```
FUNCTION: Our customer onboarding flow for the project management SaaS

OUTCOME: Increase 7-day activation rate from 40% to 65%

CRITERIA:
  - Percentage of new users who complete the "core action" (create a project, invite a teammate, assign a task) within 7 days
  - Time-to-value (hours from signup to first core action)
  - Drop-off rate at each onboarding step

UNDERLYING ASSUMPTIONS:
  - Users who complete the core action within 7 days have 3x higher 90-day retention
  - The current 40% activation rate is caused by friction in the setup flow, not lack of interest
  - Our target users (engineering managers) have 5-10 minutes for initial setup

STRATEGY: Propose 3 onboarding redesign approaches:
  1. Progressive onboarding — show features one at a time with interactive tooltips
  2. Template-first — let users start with a pre-built project template
  3. Concierge — pair each new user with a human onboarding specialist for the first week

  For each approach, estimate: implementation effort, expected activation rate improvement, and risk of abandonment.
```

---

## ORCA Framework

| Acronym | Objective, Role, Context, Action |
|---------|----------------------------------|
| **Best For** | Agentic task definition — telling an AI agent what to do |
| **Components** | 4 |
| **Typical Length** | 4-8 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **O** | **Objective** | The overall mission |
| **R** | **Role** | The agent's identity and capabilities |
| **C** | **Context** | Environment and constraints |
| **A** | **Action** | Specific tasks or tool calls |

### Template

```
OBJECTIVE: [Agent's mission]
ROLE: [Agent identity and capabilities]
CONTEXT: [Environment and constraints]
ACTION: [Specific tasks or tool call instructions]
```

### Example

```
OBJECTIVE: Monitor our production error tracking system and triage new issues within 5 minutes of detection.

ROLE: You are a SRE bot with read access to Sentry and PagerDuty, and write access to Jira. You can: query Sentry for new errors, check PagerDuty for on-call schedules, create Jira tickets, and post Slack notifications.

CONTEXT: Working hours are 9 AM - 5 PM PT, Mon-Fri. After hours, only escalate Critical issues. Use the on-call schedule in PagerDuty to determine who to notify.

ACTION:
  - Every 2 minutes, query Sentry for new error groups created in the last 5 minutes
  - For each new error group, classify severity (Critical = production outage or data loss; High = degraded experience for >1% of users; Medium = single-user or edge case; Low = cosmetic)
  - For Critical/High: create Jira ticket with error details, stack trace, affected users count, and first-seen timestamp
  - For Critical: also post to #incidents Slack channel with issue summary and the on-call engineer's handle
  - For all severities: update the error tracker with the Jira link (or note "No ticket created" for Low)
```

---

## RASCE Framework

| Acronym | Role, Audience, Style, Constraints, Examples |
|---------|-----------------------------------------------|
| **Best For** | Brand-aligned content with audience targeting |
| **Components** | 5 |
| **Typical Length** | 5-10 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **R** | **Role** | Expert persona |
| **A** | **Audience** | Target reader |
| **S** | **Style** | Writing style |
| **C** | **Constraints** | Rules and limitations |
| **E** | **Examples** | Reference examples |

### Template

```
ROLE: [Expert persona]
AUDIENCE: [Target reader]
STYLE: [Writing style]
CONSTRAINTS: [Rules and limitations]
EXAMPLES: [Reference examples]
```

### Example

```
ROLE: You are a senior content marketer specializing in B2B fintech content

AUDIENCE: CFOs and finance directors at mid-market companies ($50-500M revenue). They are skeptical of vendor content. They value data, peer examples, and clear ROI analysis.

STYLE: Journalistic — lead with a data point or peer story. Use short paragraphs. No fluff. Cite specific numbers and sources.

CONSTRAINTS:
  - Maximum 800 words
  - No superlatives ("best," "leading," "revolutionary")
  - Every claim must be backed by a data point or customer quote
  - Include at least 2 external citations
  - No generic stock imagery descriptions

EXAMPLES:
  [Link to a previously published article that performed well with this audience]
```

---

## ROLES Framework

| Acronym | Role, Objective, Limitations, Examples, Style |
|---------|------------------------------------------------|
| **Best For** | Constrained tasks with strict guidelines and style requirements |
| **Components** | 5 |
| **Typical Length** | 6-10 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **R** | **Role** | Expert persona |
| **O** | **Objective** | What to achieve |
| **L** | **Limitations** | Hard constraints and boundaries |
| **E** | **Examples** | Demonstrations |
| **S** | **Style** | Tone and format |

### Template

```
ROLE: [Expert persona]
OBJECTIVE: [What to achieve]
LIMITATIONS: [Hard constraints and boundaries]
EXAMPLES: [Demonstrations]
STYLE: [Tone and format]
```

### Example

```
ROLE: You are a compliance officer at a healthcare SaaS company (HIPAA-compliant)

OBJECTIVE: Review the following marketing email draft for regulatory compliance and suggest changes

LIMITATIONS:
  - Do NOT mention specific patient health outcomes
  - Do NOT claim FDA approval or endorsement
  - Do NOT use "cure," "treatment," or "diagnosis" — our product is a productivity tool for admin tasks
  - All claims about efficiency gains must include a qualifier: "Results may vary by organization"
  - No testimonials without written authorization on file

EXAMPLES:
  - Non-compliant: "Our software helps doctors diagnose faster" → Implies medical device
  - Compliant: "Our software reduces documentation time by automating note-taking"

STYLE: Direct, factual, risk-aware. Frame each concern as a compliance issue with a specific regulation reference where applicable.
```

---

## PECRA Framework

| Acronym | Purpose, Expectation, Context, Request, Audience |
|---------|---------------------------------------------------|
| **Best For** | Marketing copy, persuasive content, calls to action |
| **Components** | 5 |
| **Typical Length** | 5-8 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **P** | **Purpose** | Why this content exists |
| **E** | **Expectation** | What success looks like |
| **C** | **Context** | Background information |
| **R** | **Request** | The specific ask or task |
| **A** | **Audience** | Who will read it |

### Template

```
PURPOSE: [Why this content exists]
EXPECTATION: [What success looks like]
CONTEXT: [Background information]
REQUEST: [Specific ask or task]
AUDIENCE: [Target reader]
```

### Example

```
PURPOSE: Drive sign-ups for our upcoming webinar on "Building Resilient Data Pipelines"

EXPECTATION: 500+ registrations from target accounts within 2 weeks of campaign launch

CONTEXT: This is a joint webinar with AWS. Our CTO and an AWS Solutions Architect will present. The webinar is free and includes a live demo + Q&A. Previous webinars averaged 300 registrations.

REQUEST: Write a 400-word landing page with: (1) compelling headline, (2) 3 learning outcomes as bullet points, (3) speaker bios (50 words each), (4) registration form CTA, (5) social proof section with quotes from past attendees

AUDIENCE: Data engineers and data architects at mid-to-large enterprises. They are technical and skeptical of sales content. They attend webinars to learn specific skills, not to be sold to.
```

---

## TIDD-EC Framework

| Acronym | Task, Instructions, Do, Don't, Examples, Context |
|---------|----------------------------------------------------|
| **Best For** | High-precision tasks with explicit dos and don'ts |
| **Components** | 6 |
| **Typical Length** | 8-15 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **T** | **Task** | The overall task |
| **I** | **Instructions** | Step-by-step guidance |
| **D** | **Do** | Explicit positive instructions |
| **D** | **Don't** | Explicit prohibitions |
| **E** | **Examples** | Demonstrations |
| **C** | **Context** | Background information |

### Template

```
TASK: [Overall task]
INSTRUCTIONS: [Step-by-step guidance]
DO: [Positive instructions — what to do]
DON'T: [Prohibitions — what not to do]
EXAMPLES: [Demonstrations]
CONTEXT: [Background]
```

### Example

```
TASK: Generate a REST API endpoint for creating a user in our Django application.

INSTRUCTIONS:
  1. Use Django REST Framework
  2. Create a UserSerializer with appropriate validation
  3. Create a UserViewSet with create, list, retrieve, update, and delete actions
  4. Set proper permission classes
  5. Include error handling

DO:
  - Validate email format
  - Hash passwords using Django's built-in make_password
  - Return 201 status with user data (excluding password) on success
  - Return 400 with field-level error messages on validation failure
  - Include rate limiting (100 requests/hour per IP)

DON'T:
  - Do NOT return the password hash in any response
  - Do NOT allow duplicate emails
  - Do NOT expose internal IDs — use UUIDs
  - Do NOT allow username-based authentication
  - Do NOT use generic 500 errors — catch exceptions and return appropriate HTTP status codes

EXAMPLES:
  POST /api/users/
  Body: {"email": "user@example.com", "password": "securepass123", "name": "John Doe"}
  Response 201: {"id": "uuid-here", "email": "user@example.com", "name": "John Doe", "created_at": "2026-06-03T12:00:00Z"}
  Response 400: {"email": ["This field is required."], "password": ["This field is required."]}

CONTEXT: We are building a B2B SaaS platform. Users authenticate via email + password. We support social login as a secondary method. The API will be consumed by our React frontend and third-party integrations.
```

---

## CRAFT Framework

| Acronym | Context, Role, Action, Format, Target |
|---------|----------------------------------------|
| **Best For** | Lean framework for short-form, repeatable content |
| **Components** | 5 |
| **Typical Length** | 4-7 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **C** | **Context** | Background and situation |
| **R** | **Role** | Expert identity |
| **A** | **Action** | Specific verb-led task |
| **F** | **Format** | Structure and length |
| **T** | **Target** | Audience definition |

### Template

```
CONTEXT: [Background and situation]
ROLE: [Expert identity]
ACTION: [Specific task]
FORMAT: [Structure and length]
TARGET: [Audience definition]
```

### Example

```
CONTEXT: We are launching a new integration between our CRM and Slack. Users can now get real-time deal updates in their team Slack channels.

ROLE: Product marketing manager specializing in B2B SaaS product launches

ACTION: Write a 3-part launch announcement sequence: (1) in-app notification, (2) email to all active users, (3) blog post.

FORMAT:
  - In-app notification: 2 sentences + CTA button
  - Email: Subject line, opening hook, 2 key benefits, CTA, PS with social proof
  - Blog post: 500 words, 3 sections (problem → solution → how to get started), screenshots placeholder

TARGET: CRM power users (spend 2+ hours/day in the platform). They use Slack extensively and value workflow automation. They are technical enough to configure integrations but want a simple setup process.
```

---

## RTCROS Framework

| Acronym | Role, Task, Context, Requirements, Output Format, Stop Conditions |
|---------|-------------------------------------------------------------------|
| **Best For** | Code generation and structured, verifiable outputs |
| **Components** | 6 |
| **Typical Length** | 8-14 sentences |

### Components

| Letter | Component | Description |
|--------|-----------|-------------|
| **R** | **Role** | Expert persona |
| **T** | **Task** | Core instruction |
| **C** | **Context** | Background and environment |
| **R** | **Requirements** | Functional and non-functional requirements |
| **O** | **Output Format** | Exact schema and structure |
| **S** | **Stop Conditions** | When to stop generating |

### Template

```
ROLE: [Expert persona]
TASK: [Core instruction]
CONTEXT: [Background and environment]
REQUIREMENTS: [Functional and non-functional requirements — numbered]
OUTPUT FORMAT: [Exact schema, structure, language]
STOP CONDITIONS: [When to stop — length limits, exclusions, termination criteria]
```

### Example

```
ROLE: Senior Python developer with expertise in FastAPI, PostgreSQL, and async programming

TASK: Create a REST API endpoint that accepts a list of product IDs, queries the database, and returns product availability information

CONTEXT: We use FastAPI, SQLAlchemy 2.0 with async sessions, PostgreSQL 16, and Pydantic v2 for validation. The database has a `products` table with columns: id (UUID), name (varchar), stock_level (int), is_active (boolean), updated_at (timestamp). The API is consumed by a warehouse management system.

REQUIREMENTS:
  1. Accept POST to /api/v1/products/availability
  2. Request body: { "product_ids": ["uuid1", "uuid2", ...] }
  3. Maximum 100 product IDs per request
  4. Return only active products (is_active = true)
  5. Return stock_level with a "status" derived field: "in_stock" (stock > 10), "low_stock" (1-10), "out_of_stock" (0)
  6. Include a "checked_at" timestamp field
  7. Response time must be under 500ms (use async database query)
  8. Handle empty product_ids list gracefully (return empty list)
  9. Return 422 if product_ids contains invalid UUIDs
  10. Log all requests for audit trail

OUTPUT FORMAT:
  - Language: Python 3.12+
  - Include: route definition, Pydantic models (request + response), service layer function, unit test
  - Follow FastAPI best practices: dependency injection, type hints, docstrings
  - Database query must use SQLAlchemy 2.0 select() style (not legacy Query style)

STOP CONDITIONS:
  - Generate ONLY the files specified in Output Format
  - Do NOT generate: Dockerfile, requirements.txt, database migration scripts, configuration files
  - Do NOT include setup instructions, deployment notes, or usage examples beyond docstrings
  - Max 200 lines total across all files
```

### Strengths & Limitations

| Strengths | Limitations |
|-----------|-------------|
| Most comprehensive for code tasks | Verbose for simple code gen |
| Stop Conditions prevent over-generation | Overkill for non-code tasks |
| Requirements are explicitly enumerated | Requires technical precision |

---

## Framework Combination Patterns

Expert practitioners chain multiple frameworks together to handle complex use cases. The output of one framework becomes the input or context for the next.

### Pattern Types

| Pattern | Description |
|---------|-------------|
| **Sequential chaining** | Output of Framework A → Context for Framework B |
| **Nested chaining** | Framework B is embedded inside Framework A's components |
| **Parallel chaining** | Apply multiple frameworks to the same input, compare results |
| **Evaluation chaining** | Use CLEAR or PEEM to evaluate another framework's output |

### Common Chains

| Use Case | Framework Chain | Why This Works |
|----------|-----------------|----------------|
| **Long-form content** | Role Prompting → COSTAR → Self-Consistency | Role sets persona, COSTAR structures content, Self-Consistency validates quality |
| **Technical documentation** | Role Prompting → IEEI → Few-Shot | Role provides authority, IEEI structures explanation, Few-Shot grounds in examples |
| **Brand voice at scale** | PIVO → DEEP → Few-Shot | PIVO defines voice dimensions, DEEP elaborates, Few-Shot ensures consistency |
| **Code architecture** | CoT → RISEN → Reflexion | CoT reasons through design, RISEN structures execution, Reflexion validates correctness |
| **Bug fixing** | CoT → ToT → Reflexion | CoT traces the bug, ToT explores fixes, Reflexion verifies the solution |
| **Test suites** | CRISPE → Self-Consistency → Few-Shot | CRISPE explores test scenarios, Self-Consistency validates, Few-Shot provides examples |
| **API design** | CRISP → Multi-Agent Debate → Prompt Chaining | CRISP structures the spec, debate stress-tests it, chaining handles multi-step generation |
| **User stories** | Role Prompting → COAST → CLEAR | Role sets perspective, COAST structures the story, CLEAR evaluates quality |
| **Marketing copy** | PAS → AIDA → PECRA | PAS hooks attention, AIDA guides persuasion, PECRA structures the request |
| **Strategic analysis** | CRISPE → FOCUS → CLEAR | CRISPE explores options, FOCUS evaluates strategy, CLEAR audits the final prompt |

### Detailed Chain Examples

#### Chain: Role Prompting → RISEN → CLEAR (Code Security Audit)

```
Step 1 — Role Prompting:
  "You are a senior security engineer with 10 years of experience in web application security..."

Step 2 — RISEN (uses the role from Step 1):
  ROLE: [inherited from step 1]
  INSTRUCTIONS: Review this Django application code...
  STEPS: 1. Map entry points 2. Check OWASP Top 10 3. Verify auth logic...
  END GOAL: Prioritized finding list with severity, location, fix
  NARROWING: Do NOT report on code style, performance, or architecture

Step 3 — CLEAR (evaluate the RISEN prompt before running):
  Concise? ✓ — No redundant words
  Logical? ✓ — Steps flow sequentially
  Explicit? ✓ — Format and constraints specified
  Adaptive? — Could template for different codebases
  Reflective? — Will compare output against requirements
```

#### Chain: CRISPE → FOCUS → CLEAR (Strategic Product Decision)

```
Step 1 — CRISPE (explore strategic options):
  CAPACITY: Product strategy analyst...
  INSIGHT: Activation rate is 40%, need to reach 65%...
  STATEMENT: Analyze 3 onboarding approaches...
  PERSONALITY: Pragmatic, data-driven
  EXPERIMENT: Generate aggressive/conservative/balanced variants

Step 2 — FOCUS (deep-dive on selected approach):
  FUNCTION: Progressive onboarding flow design
  OUTCOME: Increase activation from 40% to 65%
  CRITERIA: Completion rate, time-to-value, drop-off per step
  ASSUMPTIONS: Low activation = friction, not disinterest
  STRATEGY: [from CRISPE output — selected approach]

Step 3 — CLEAR (evaluate both prompts):
  Audit CRISPE prompt: Is the Experiment broad enough?
  Audit FOCUS prompt: Are Criteria measurable?
  Combine learnings into final prompt
```

---

## Selection Guide

| If you need... | Use... | Why |
|----------------|--------|-----|
| Brand-aligned content, tone control | **COSTAR** | Most comprehensive — covers all output dimensions |
| Multi-step processes, procedures | **RISEN** | Steps + Narrowing enforce structure |
| Creative campaigns, flexibility | **CRAFT / IDEA** | Lean structure leaves room for creativity |
| Analysis, exploration, iteration | **CRISPE** | Experiment component enables variant comparison |
| Code generation, validation | **RTCROS / TIDD-EC** | Output Format + Stop Conditions ensure structured code |
| Quick, repeatable short-form | **RTF / APE** | Minimal components, fast to write |
| Rewriting/refactoring content | **BAB** | Before/After/Bridge is purpose-built for transforms |
| Educational explanations | **CARE / GUIDE** | Examples + Evaluation support learning |
| Strict constraints & guidelines | **ROLES** | Limitations + Style provide guardrails |
| High-precision dos/don'ts | **TIDD-EC** | Separate Do/Don't sections prevent ambiguity |
| Evaluating prompt quality | **CLEAR** | Only framework designed for evaluation, not construction |
| Feature ideas → user stories | **COAST** | Scenario component connects use case to deliverable |
| Strategic analysis | **FOCUS** | Assumptions + Criteria support decision-making |
| Agentic task definition | **ORCA** | Designed for agent instructions with action boundaries |
| Marketing copy | **PECRA** | Purpose + Expectation align with persuasion goals |

---

## Quick Comparison Matrix

| Framework | Components | Best For | Strengths | Weaknesses |
|-----------|-----------|----------|-----------|------------|
| **COSTAR** | 6 | Content creation, marketing | Most comprehensive, tone + audience control | Verbose for simple tasks |
| **RISEN** | 5 | Task execution, procedures | Steps enforce order, Narrowing prevents scope creep | Less creative flexibility |
| **CRISPE** | 5 | Analysis, research, strategy | Experiment enables iteration and comparison | Over-engineered for simple queries |
| **CLEAR** | 5 | Prompt evaluation | Only evaluation framework; improvement checklist | Not a construction framework |
| **CRAFT** | 5 | Short-form, repeatable | Lean, fast to write | Less depth than COSTAR |
| **RTCROS** | 6 | Code generation | Stop Conditions prevent over-generation | Verbose; code-only use case |
| **TIDD-EC** | 6 | High-precision tasks | Explicit Do/Don't sections | Many components |
| **BAB** | 3 | Rewriting, refactoring | Perfect for transformations | Requires existing content |
| **RTF** | 3 | Simple focused tasks | Minimal, easy to remember | No context or constraints |
| **APE** | 3 | Ultra-minimal prompts | Fastest to write | Least control over output |
| **RACE** | 4 | Expert tasks | Adds context to RTF | No narrowing/exclusions |
| **CARE** | 4 | Constraint-driven tasks | Examples constrain output strongly | Less flexible |
| **TAG** | 3 | Simple definitions | Minimal viable prompt | Very limited |
| **COAST** | 5 | Feature ideas → stories | Scenario connects context to deliverable | Niche use case |
| **IDEA** | 4 | Creative brainstorming | Adjustments enable variation | Less structured output control |
| **TRACE** | 5 | Multi-step instructions | Good for instruction-heavy tasks | Many overlapping components |
| **GUIDE** | 5 | Teaching, tutoring | Built-in evaluation step | Niche (educational) |
| **FOCUS** | 5 | Strategic analysis | Assumptions + Criteria rigorous | Heavy for non-strategic tasks |
| **ORCA** | 4 | Agentic tasks | Designed for agents | Agent-specific |
| **RASCE** | 5 | Brand-aligned content | Audience + Style specific | No Response format |
| **ROLES** | 5 | Constrained tasks | Hard constraints explicit | Less flexible |
| **PECRA** | 5 | Marketing copy | Purpose alignment | Marketing-specific |

---

## Framework Selection Flowchart

```
What kind of task is this?
│
├─ Content creation / marketing / brand communication
│   └─ COSTAR (or CRAFT for short-form, or PECRA for copy)
│
├─ Task execution / procedure / process
│   └─ RISEN (or RTCROS for code, or TIDD-EC for high-precision)
│
├─ Analysis / research / exploration
│   └─ CRISPE (or FOCUS for strategic analysis)
│
├─ Quick / one-off / simple
│   └─ RTF or APE
│
├─ Rewriting / transformation
│   └─ BAB
│
├─ Teaching / explanation
│   └─ CARE or GUIDE
│
├─ Creative / brainstorming
│   └─ IDEA
│
├─ Feature / user story definition
│   └─ COAST
│
├─ Agent / tool task definition
│   └─ ORCA
│
└─ Evaluating prompt quality
    └─ CLEAR
```

---

## References

- Full framework definitions compiled from prompt engineering literature and community practice (2025–2026)
- Individual frameworks originated from: academic publications, industry blogs, prompt engineering courses, and community contributions
- Combination patterns based on expert practitioner workflows documented in production prompt engineering teams
- Selection guide informed by empirical comparisons across 14+ prompt frameworks
