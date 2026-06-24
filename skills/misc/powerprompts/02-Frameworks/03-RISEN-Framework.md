# RISEN Framework

> **Role, Instructions, Steps, End Goal, Narrowing**
>
> *Best for task execution, multi-step processes, technical writing, and code reviews*

---

## Overview

RISEN is a five-component framework optimized for **procedural tasks** — anything that requires a defined process, ordered steps, and clear completion criteria. It excels in domains where precision and repeatability matter more than creativity or brand voice.

The framework is particularly strong for technical workflows: code review, security auditing, system design, incident response, and quality assurance. The **Narrowing** component (constraints and exclusions) is what distinguishes RISEN from simpler frameworks — it explicitly defines what NOT to do.

---

## Component Breakdown

### R — Role

| Aspect | Description |
|--------|-------------|
| **What it is** | The expert persona the model should adopt for this task |
| **Why it matters** | Activates specific knowledge domains and professional judgment patterns |
| **What to include** | Professional title, years of experience, specific expertise areas, certifications if relevant |

**Tips:**
- Match the role to the rigor needed: "Senior security engineer at a FAANG company" sets a higher bar than "Security reviewer"
- Include specific expertise areas that are relevant to the task at hand
- Certifications add credibility signals for regulated domains (CISSP, PMP, AWS Certified)

**Bad:** "You are a developer."
**Good:** "You are a senior security engineer with 10 years of experience in web application security. You hold a CISSP certification and have conducted 50+ code reviews for production systems. Your expertise includes OWASP Top 10, authentication protocols, and cloud security architecture."

### I — Instructions

| Aspect | Description |
|--------|-------------|
| **What it is** | The core task directive — precise, imperative, unambiguous |
| **Why it matters** | This is the single most important component — everything else supports it |
| **What to include** | The action to perform, the scope of the task, what to look for or what to produce |

**Tips:**
- Start with an imperative verb: "Review," "Analyze," "Build," "Debug," "Test"
- Be specific about scope: "Review the following code" not "Look at this"
- If there are multiple sub-tasks, enumerate them

**Bad:** "Review this code."
**Good:** "Review the following Python web application code and identify all security vulnerabilities. For each finding, provide the severity level, the exact file and line number, and a concrete fix recommendation. Cover: authentication logic, input validation, data sanitization, session management, and dependency security."

### S — Steps

| Aspect | Description |
|--------|-------------|
| **What it is** | The ordered sequence the model should follow during reasoning and execution |
| **Why it matters** | Prevents the model from jumping to conclusions or skipping important analysis steps |
| **What to include** | Numbered list of steps in logical order, dependencies between steps |

**Tips:**
- Number the steps explicitly — this forces sequential reasoning
- Steps should be additive: step 2 builds on step 1's output
- 3-7 steps is the sweet spot — too few loses structure, too many loses attention

**Pattern for effective steps:**

```
STEPS:
  1. [First logical action — what to do before anything else]
  2. [Second action — builds on step 1]
  3. [Third action — deeper analysis or cross-cutting concern]
  4. [Synthesis — combine findings from previous steps]
  5. [Final validation — check your own work]
```

**Bad:**
```
STEPS:
  - Check security
  - Write report
```

**Good:**
```
STEPS:
  1. Read through the code and identify all input entry points (user input, file uploads, API parameters, database reads)
  2. Check for OWASP Top 10 vulnerabilities at each entry point — SQL injection, XSS, CSRF, IDOR, SSRF, insecure deserialization
  3. Verify authentication and authorization logic — are there any privilege escalation paths?
  4. Review data validation and sanitization — is there a defense-in-depth approach?
  5. Check dependency usage for known vulnerabilities — review imports, third-party packages, and their versions
  6. Synthesize findings into a prioritized list with severity ratings
```

### E — End Goal

| Aspect | Description |
|--------|-------------|
| **What it is** | The definition of "done" — what the final deliverable looks like |
| **Why it matters** | Without a clear end goal, the model may stop too early or continue past usefulness |
| **What to include** | Deliverable format, required sections, quality bar, what "complete" means |

**Tips:**
- Be specific about the artifact: "A prioritized list of findings" not "A report"
- Include structural requirements: sections, ordering, format
- Set a quality bar: "Each finding must include severity, location, and fix"
- If there is a maximum length, specify it here

**Bad:** "Give me the results."
**Good:** "END GOAL: A prioritized list of findings with the following structure:
  - Severity (Critical / High / Medium / Low)
  - Finding name (short, descriptive)
  - Location (file:line range)
  - Description (2-3 sentences explaining the vulnerability)
  - Impact (what an attacker could do)
  - Fix recommendation (concrete code change or configuration change)
  
  Sort findings by severity (Critical first). Maximum 15 findings. If you find more than 15, list the top 15 and note how many additional low-severity findings were identified."

### N — Narrowing

| Aspect | Description |
|--------|-------------|
| **What it is** | Constraints, exclusions, and boundaries — what the model should NOT do or consider |
| **Why it matters** | This is the defining component of RISEN. Explicit negatives prevent scope creep and wasted output |
| **What to include** | Out-of-scope topics, excluded analysis dimensions, prohibited behaviors, format negatives |

**Tips:**
- Be explicit: "Do NOT comment on code style, performance, or architecture unless directly related to security"
- Use contrastive framing: "Only report security issues" is weaker than "Only report security issues. Do NOT report on: code style, performance optimization, architectural decisions, or feature suggestions"
- Narrowing is especially important for models that tend to over-deliver (adding extra analysis, suggestions, praise, or disclaimers)

**Bad:** "Focus on security."
**Good:** "NARROWING: Only report on security issues. Do NOT comment on:
  - Code style, formatting, or naming conventions
  - Performance optimization or algorithmic efficiency
  - Architectural decisions or design patterns
  - Missing features or feature suggestions
  - General code quality or best practices unrelated to security
  
  If you cannot identify any security issues, state 'No security issues identified' and stop. Do not add disclaimers about limited review scope."

---

## Complete Prompt Template

```
ROLE: [Expert persona — title, experience, domain, certifications, methodology]
INSTRUCTIONS: [Core task — what to do, scope, sub-tasks enumerated]
STEPS:
  1. [Step 1 — first logical action]
  2. [Step 2 — builds on step 1]
  3. [Step 3 — continues analysis]
  4. [Step 4 — synthesis or cross-cutting]
  5. [Step 5 — final validation]
END GOAL: [Definition of done — deliverable format, structure, quality bar]
NARROWING: [Constraints and exclusions — what NOT to do, scope boundaries]
```

---

## Examples

### Example 1: Code Security Review

```
ROLE: You are a senior security engineer with 10 years of experience in web application security. You hold a CISSP certification and have conducted 50+ code reviews for production systems. Your expertise includes OWASP Top 10, authentication protocols, cloud security architecture, and penetration testing.

INSTRUCTIONS: Review the following Python web application (Django) code and identify all security vulnerabilities. For each finding, provide the severity, exact location, and a concrete fix recommendation. Cover: authentication logic, authorization checks, input validation, data sanitization, session management, CSRF protection, and dependency security.

STEPS:
  1. Map all input entry points: user input forms, API endpoints, file uploads, database queries, and external service calls
  2. Trace data flow from each entry point through the application — identify where data is used without proper validation or sanitization
  3. Review authentication and authorization logic — check for hardcoded credentials, weak password policies, missing permission checks, and privilege escalation paths
  4. Check for OWASP Top 10: SQL injection, XSS, CSRF, IDOR, SSRF, insecure deserialization, security misconfiguration, and broken access control
  5. Review third-party dependencies — check for known vulnerabilities in imported packages and their versions
  6. Synthesize findings into a prioritized list. Validate each finding by considering: can this be exploited? what is the impact? is there a compensating control?

END GOAL: A prioritized list of findings with:
  - Severity (Critical / High / Medium / Low)
  - Finding name
  - Location (file:line range)
  - Description (2-3 sentences)
  - Impact (what an attacker could achieve)
  - Fix recommendation (specific code or configuration change)
  
  Sort by severity (Critical first). Maximum 10 findings. If more than 10, list top 10 and summarize remaining.

NARROWING: Only report security issues. Do NOT report on:
  - Code style, formatting, naming conventions
  - Performance optimization or algorithmic efficiency
  - Architectural decisions or design patterns
  - Missing features or feature suggestions
  - General code quality or best practices unrelated to security
  - Do NOT add disclaimers, introductory paragraphs, or summaries beyond the finding list
```

### Example 2: Incident Postmortem

```
ROLE: You are a Site Reliability Engineer (SRE) with experience managing incidents at large-scale SaaS companies. You have written 100+ postmortems and follow the Google SRE postmortem methodology (blameless, data-driven, action-oriented).

INSTRUCTIONS: Analyze the following incident timeline and system architecture to produce a complete incident postmortem. Identify root cause, contributing factors, blast radius, and actionable remediation items.

STEPS:
  1. Parse the timeline and identify key events: when did the incident start? when was it detected? what actions were taken? when was it resolved?
  2. Identify the root cause — trace through the system architecture to find the triggering condition
  3. Identify contributing factors — what made the incident worse or delayed detection/resolution
  4. Assess blast radius — what systems, users, or data were affected? quantify impact (downtime minutes, error rates, affected users)
  5. Determine detection gaps — why wasn't this caught earlier? what monitoring failed?
  6. Generate remediation items — categorize as: prevent recurrence, improve detection, reduce blast radius, speed up recovery

END GOAL: A structured postmortem with these sections:
  1. Incident summary (3-5 sentences)
  2. Timeline (key events with timestamps)
  3. Root cause (1 paragraph)
  4. Contributing factors (bullet list)
  5. Blast radius and impact (quantified)
  6. Remediation items (table: Item | Category | Priority | Owner | ETA)
  7. Lessons learned (3-5 bullet points)
  
  Prioritization: P0 = must fix this week, P1 = fix this sprint, P2 = add to backlog, P3 = nice to have.

NARROWING:
  - Do NOT assign blame to individuals. Use systemic language: "the deployment pipeline allowed..." not "the engineer forgot..."
  - Do NOT include speculation — only what can be confirmed from logs, metrics, or timelines
  - Do NOT suggest organizational or process changes unless directly related to the incident cause
  - Do NOT add a summary section — the document IS the summary
```

### Example 3: Database Migration Plan

```
ROLE: You are a Senior Database Reliability Engineer with 8 years of experience managing PostgreSQL at scale (100+ TB, 10K+ queries/second). You specialize in zero-downtime migrations, replication, and query optimization. You have executed 50+ production migrations without incident.

INSTRUCTIONS: Create a detailed migration plan to move our primary PostgreSQL database (2TB, PostgreSQL 13) from AWS RDS to a self-hosted PostgreSQL 16 cluster on EC2 with zero unplanned downtime. The migration window is 4 hours on a Saturday at 2 AM UTC (lowest traffic).

STEPS:
  1. Pre-migration assessment — analyze current RDS instance type, storage, IOPS, replication lag, connection pool settings, and query patterns
  2. Migration strategy selection — evaluate options (logical replication, pg_dump/pg_restore, AWS DMS, streaming replication) and recommend the best approach
  3. Rollback plan design — define the triggers and steps to abort the migration and revert to RDS within 5 minutes if key metrics degrade
  4. Migration execution plan — detailed step-by-step with verification checks between each step
  5. Post-migration validation — what queries to run, what metrics to check, how long to observe before declaring success
  6. Cutover and optimization — how to redirect traffic, what to reconfigure, what to optimize on the new cluster

END GOAL: A migration plan document with these sections:
  - Pre-migration checklist (20-30 items, each with verification command)
  - Selected migration strategy with rationale
  - Step-by-step execution plan (numbered steps, each with: action, verification, rollback step if failed)
  - Rollback plan (triggers, steps, estimated time to revert)
  - Post-migration validation (queries to run, metrics to check, observation period)
  - Timeline with buffer (planned vs. actual for each phase)
  - Risk register (top 5 risks with mitigation and contingency)

NARROWING:
  - Do NOT cover application-level changes (code updates, connection string management in app config) — only database infrastructure
  - Do NOT include backup strategy beyond what is needed for this migration
  - Do NOT suggest schema changes, index changes, or query optimizations — this is an infrastructure migration only
  - Do NOT assume any specific monitoring tool — use generic metric descriptions
  - Assume AWS RDS is the source and cannot be modified in-place (e.g., no upgrading to PostgreSQL 16 on RDS)
```

---

## When to Use RISEN

| Use Case | Why RISEN Works |
|----------|-----------------|
| **Code review / security audit** | Steps force systematic analysis; Narrowing prevents scope creep |
| **Incident response / postmortem** | Steps guide structured investigation; End Goal defines the artifact |
| **Migration / deployment planning** | Steps ensure nothing is skipped; Narrowing removes irrelevant concerns |
| **Technical documentation** | Role sets authority level; Instructions define the deliverable |
| **Quality assurance** | Steps enforce checklist-style verification; Narrowing keeps focus |
| **Compliance / regulatory review** | Role with certifications sets credibility; Steps mirror audit protocol |
| **Troubleshooting / debugging** | Steps force systematic elimination; End Goal defines resolution criteria |

### When NOT to Use RISEN

| Situation | Better Alternative |
|-----------|-------------------|
| Creative or brand-focused content | COSTAR |
| Exploratory analysis with iteration | CRISPE |
| Simple one-off questions | RTF or APE |
| Code generation with constraints | RTCROS or TIDD-EC |

---

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|-------------|-----|
| Steps too vague | Model skips important analysis | Break into fine-grained actions |
| No Narrowing | Output includes irrelevant content | Explicitly list exclusions |
| Role too generic | Output lacks expert depth | Add years, domain, specific expertise |
| End Goal too loose | Model stops prematurely | Define exact format and sections |
| Instructions too broad | Output misses key requirements | Enumerate specific sub-tasks |
| Steps not sequential | Model may reorder incorrectly | Number steps and ensure dependency ordering |

---

## References

- RISEN framework adapted from task-oriented prompt design patterns
- The Narrowing component is inspired by constraint-based prompting and negative prompting techniques
- Widely used in DevOps, security engineering, and QA workflows for structured task execution
- Complements the RTCROS framework (which adds explicit Output Format and Stop Conditions for code tasks)
