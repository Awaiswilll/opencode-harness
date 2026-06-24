# COSTAR Framework

> **Context, Objective, Style, Tone, Audience, Response**
>
> *Most comprehensive framework; best for content creation, marketing, customer service, and brand-aligned communication*

---

## Overview

COSTAR is a six-component framework developed for crafting detailed, high-quality prompts that control every dimension of LLM output. It is particularly effective when you need precise control over tone, audience targeting, and output format.

Developed by prompt engineering practitioners and widely adopted in marketing, content operations, and customer experience teams.

---

## Component Breakdown

### C — Context

| Aspect | Description |
|--------|-------------|
| **What it is** | Background information, situational setup, and relevant history |
| **Why it matters** | Grounds the model in the specific scenario so it generates relevant output |
| **What to include** | Product/service description, prior work done, market situation, relevant constraints |

**Tips:**
- Be specific: "We are a B2B SaaS company selling to mid-market" not "We are a company"
- Include context the model would not know by default
- If the task is a follow-up, summarize what has been discussed so far

**Bad:** "Write about our software."
**Good:** "We are Acme Analytics, a B2B SaaS company selling project management software to engineering teams at 50-500 person companies. We are launching an AI-powered sprint planning feature to help teams estimate more accurately and reduce planning overhead by 40%."

### O — Objective

| Aspect | Description |
|--------|-------------|
| **What it is** | The specific goal or desired outcome of the prompt |
| **Why it matters** | Gives the model a clear target to aim for — without an objective, output drifts |
| **What to include** | What success looks like, what the output should achieve, the primary action the reader should take |

**Tips:**
- Start with an action verb: "Create," "Analyze," "Persuade," "Explain," "Compare"
- State the objective as a single sentence if possible
- Avoid multiple conflicting objectives in one prompt

**Bad:** "Tell me about our product."
**Good:** "Create a compelling product launch email that drives sign-ups for our beta waitlist."

### S — Style

| Aspect | Description |
|--------|-------------|
| **What it is** | The writing style the model should adopt |
| **Why it matters** | Controls readability, structure, and genre conventions in the output |
| **What to include** | Genre (academic, journalistic, conversational, technical), reference authors or publications |

**Common style directives:**

| Style | When to Use | Example |
|-------|-------------|---------|
| **Journalistic** | Newsletters, press releases, blog posts | Inverted pyramid, objective, source-backed |
| **Academic** | White papers, research summaries, proposals | Passive voice, formal, citation-heavy |
| **Conversational** | Email, chat, social media | Short sentences, contractions, direct address |
| **Technical** | Documentation, specs, code comments | Precise terminology, step-by-step, minimal prose |
| **Storytelling** | Case studies, brand narratives, presentations | Narrative arc, sensory details, character-driven |

**Bad:** "Write in a professional style."
**Good:** "Write in a journalistic style: lead with the most important information (inverted pyramid), keep sentences under 20 words, use active voice, and include specific data points."

### T — Tone

| Aspect | Description |
|--------|-------------|
| **What it is** | The emotional register and attitude of the output |
| **Why it matters** | Sets the reader's emotional response and perceived credibility |
| **What to include** | How the model should "feel" to the reader — confident, empathetic, authoritative, playful, urgent |

**Tone spectrum guide:**

| Tone | Best For | Example Directive |
|------|----------|-------------------|
| **Authoritative** | Leadership comms, expert content | "Confident, data-backed, no hedging language" |
| **Empathetic** | Customer support, healthcare | "Warm, patient, acknowledge emotions first" |
| **Urgent** | Sales, time-sensitive announcements | "Create scarcity, use active imperative verbs" |
| **Playful** | Social media, B2C marketing | "Witty, use wordplay, keep it light" |
| **Diplomatic** | Cross-team communication, feedback | "Respectful, soften criticism with framing" |
| **Neutral** | Analysis, summaries, reports | "Objective, balanced, no editorializing" |

**Bad:** "Make it sound friendly."
**Good:** "Tone: excited but credible — highlight innovation without overselling. Avoid hyperbole. Let the facts speak for themselves."

### A — Audience

| Aspect | Description |
|--------|-------------|
| **What it is** | Who will read the output — their role, knowledge level, needs, and pain points |
| **Why it matters** | Tailors vocabulary, depth, examples, and framing to the reader |
| **What to include** | Job title, seniority, domain expertise, familiarity with the topic, what they care about |

**Tips:**
- Be precise: "Engineering managers at 50-500 person SaaS companies" not "Managers"
- Include pain points so the model can address them directly
- Specify knowledge level to avoid over-explaining or under-explaining

**Bad:** "Write for managers."
**Good:** "Audience: Engineering managers and team leads at 50-500 person companies who are familiar with agile methodologies. Their pain points: low developer velocity, poor sprint visibility, estimation inaccuracy. They care about: ROI, implementation time, team adoption, integration with existing tools."

### R — Response

| Aspect | Description |
|--------|-------------|
| **What it is** | The desired format, structure, length, and delivery specifications |
| **Why it matters** | Eliminates ambiguity about what "done" looks like — prevents format negotiation |
| **What to include** | Length (word count, pages, bullet count), structure (sections, order), format (JSON, markdown, FAQ, email) |

**Common response formats:**

| Format | Use Case |
|--------|----------|
| Bullet points | Summaries, key takeaways |
| JSON / structured data | API responses, data extraction |
| Email | Customer communications |
| Report | Analysis, research findings |
| FAQ | Documentation, support |
| Table | Comparisons, data presentation |
| Step-by-step | Instructions, tutorials |

**Bad:** "Return the results."
**Good:** "Response format: Subject line (6 options), opening paragraph (2-3 sentences), 3 key benefits as bullet points, CTA button text (3 options). Total length not to exceed 250 words."

---

## Complete Prompt Template

```
CONTEXT: [Background information, situation, what has been done]
OBJECTIVE: [Specific goal or desired outcome]
STYLE: [Writing style — journalistic, academic, conversational, etc.]
TONE: [Emotional register — confident, empathetic, authoritative, etc.]
AUDIENCE: [Who will read this? Role, knowledge level, pain points, what they care about]
RESPONSE: [Desired format — length, structure, delivery specifications]
```

---

## Examples

### Example 1: Product Launch Email

```
CONTEXT: I am a SaaS company (Sprintly) selling project management software to mid-market engineering teams. We are launching a new AI-powered sprint planning feature that automates estimation and reduces planning overhead by 40%.

OBJECTIVE: Create a compelling product launch email that drives sign-ups for our beta waitlist.

STYLE: Direct, benefit-driven, newsletter-style. Short paragraphs. Active voice.

TONE: Excited but credible — highlight innovation without overselling. Use data to support claims. Avoid hype words like "revolutionary" or "game-changing."

AUDIENCE: Engineering managers and team leads at 50-500 person companies who are familiar with agile methodologies. They are frustrated with estimation inaccuracy and long planning meetings. They care about developer velocity, team adoption, and ROI.

RESPONSE:
- Subject line: 6 options (list them)
- Opening paragraph: 2-3 sentences that hook with a pain point
- 3 key benefits: bullet points with specific metrics
- CTA section: button text (3 options) + link
- PS section: social proof hook ("Join 200+ teams already on the waitlist")
```

### Example 2: Customer Support Response

```
CONTEXT: A customer named Sarah has been trying to cancel her subscription for 3 days. She called twice, emailed, and used the live chat — but each time was routed to a different agent and had to re-explain her situation. She is now on her fourth contact and is frustrated.

OBJECTIVE: Apologize, resolve the cancellation immediately, and restore trust so she would consider returning in the future.

STYLE: Conversational, personal, human-to-human. No corporate jargon.

TONE: Deeply apologetic and empathetic. Acknowledge the frustration. Do not make excuses. Take full ownership.

AUDIENCE: Sarah, a long-term customer (2+ years) who values reliability and hates bureaucratic runaround. She is busy and wants this resolved in one interaction with no friction.

RESPONSE:
1. Opening: Personalized apology that acknowledges the specific frustration (2-3 sentences)
2. Resolution: Confirm immediate cancellation + confirmation email in 5 minutes
3. Goodwill offer: 2 months free if she returns within 90 days
4. Feedback ask: 1-question survey about what went wrong (link)
5. Close: Warm sign-off with direct contact info for any follow-up
```

### Example 3: Thought Leadership Article

```
CONTEXT: Our company (DataStream) provides real-time data pipelines for fintech companies. We recently published a benchmark study showing our platform processes transactions 3x faster than the industry average. We want to turn this into a bylined article for a major fintech publication (Finextra).

OBJECTIVE: Establish DataStream's CTO as a thought leader in real-time data infrastructure. Position the benchmark as a significant industry finding.

STYLE: Journalistic — lead with the finding, then explain methodology, then discuss implications. Third-person where referencing the company, first-person for CTO opinions. Quote-friendly (include quotable soundbites).

TONE: Authoritative and data-backed. Confident but not arrogant. Give credit to industry peers. Let the data tell the story.

AUDIENCE: Fintech CTOs, VPs of Engineering, and data architects at mid-to-large financial institutions. They are technically sophisticated (familiar with Kafka, Kinesis, streaming architectures). They value rigorous methodology and are skeptical of vendor benchmarks.

RESPONSE:
- Headline: 5 options (must include a number and a strong verb)
- Deck / summary: 2-3 sentences explaining the finding and why it matters
- Article body (~800 words):
  - Hook: The latency problem in fintech
  - The benchmark: methodology, setup, surprising finding
  - Why it matters: implications for real-time fraud detection, trading, customer experience
  - What's next: industry trends
  - CTO quote: 1 strong quotable paragraph
- Author bio: 2 sentences
```

---

## When to Use COSTAR

| Use Case | Why COSTAR Works |
|----------|------------------|
| **Marketing copy & emails** | Tone + Audience gives precise brand voice control |
| **Customer service scripts** | Context + Objective ensures situation-aware responses |
| **Thought leadership** | Style + Tone differentiates from competitors |
| **Proposals & pitches** | Audience + Response ensures format alignment |
| **Content at scale** | Reusable template — swap Context/Audience for each segment |
| **Cross-functional communication** | Ensures appropriate tone for different stakeholders |

### When NOT to use COSTAR

| Situation | Better Alternative |
|-----------|-------------------|
| Simple one-off questions | RTF or APE |
| Multi-step procedures or code | RISEN or RTCROS |
| Exploratory analysis with iteration | CRISPE |
| Quick rewrites or refactoring | BAB |

---

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|-------------|-----|
| Vague context | Model generates generic output | Add specific details: company, product, market |
| Multiple objectives | Conflicting signals dilute quality | Split into separate prompts |
| No audience definition | Wrong depth/vocabulary for reader | Specify role, knowledge level, pain points |
| Ignoring tone | Output feels flat or mismatched | Add explicit tone directive with examples |
| Lazy response format | Output needs reformatting | Be specific: length, structure, elements |
| Style vs. Tone confusion | Both needed but conflated | Style = how it reads; Tone = how it feels |

---

## Variants

| Variant | Components | Best For |
|---------|-----------|----------|
| **COAST** | Context, Objective, Actions, Scenario, Task | Feature ideas → user stories |
| **RASCE** | Role, Audience, Style, Constraints, Examples | Brand-aligned content without Context or Response |
| **PECRA** | Purpose, Expectation, Context, Request, Audience | Marketing copy with Purpose replacing Objective |

---

## References

- Original COSTAR framework documentation (Singapore GovTech / Data Science & AI team)
- Widely cited in prompt engineering courses and enterprise prompt libraries
- Adapted for content operations, customer experience, and marketing teams
