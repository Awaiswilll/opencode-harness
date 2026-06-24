# Recursive Self-Improvement (RSI) Prompts

> Systems that modify their own prompts, reasoning strategies, and decision-making logic to enhance performance over time without direct human intervention.

---

## Table of Contents

1. [What Is Recursive Self-Improvement?](#what-is-recursive-self-improvement)
2. [The RSI Loop: Attempt → Evaluate → Identify → Improve → Re-attempt](#the-rsi-loop-attempt--evaluate--identify--improve--re-attempt)
3. [RSI Prompt Structure](#rsi-prompt-structure)
4. [Prompt Evolution Pattern](#prompt-evolution-pattern)
5. [Levels of Self-Improvement (1-4)](#levels-of-self-improvement-1-4)
6. [Meta-Learning Prompt Pattern](#meta-learning-prompt-pattern)
7. [Version Control for Prompts](#version-control-for-prompts)
8. [Validation Is Critical](#validation-is-critical)
9. [Advanced RSI Architectures](#advanced-rsi-architectures)
10. [Best Practices](#best-practices)
11. [Common Pitfalls](#common-pitfalls)
12. [References and Resources](#references-and-resources)

---

## What Is Recursive Self-Improvement?

**Recursive Self-Improvement (RSI)** refers to systems that modify their own code, prompts, learning algorithms, or decision-making logic to enhance performance over time without direct human intervention. In prompt engineering, RSI means an LLM iteratively refines its own system prompt based on its performance, creating a feedback loop of continuous improvement.

### The Core Concept

```
┌─────────────────────────────────────────────────┐
│                 RSI LOOP                         │
│                                                  │
│  Attempt → Evaluate → Identify → Improve →       │
│  Re-attempt  ──── (repeat until done) ──────→    │
│                                                  │
└─────────────────────────────────────────────────┘
```

Each iteration produces a measurably better result, and the improvements compound over successive cycles.

### Why RSI Matters

| Benefit | Description |
|---------|-------------|
| **Continuous improvement** | Performance increases with each iteration |
| **Reduced human effort** | The model self-corrects without manual prompt tuning |
| **Adaptation** | System adjusts to task difficulty automatically |
| **Error rate reduction** | Research shows 41% reduction after 10 iterations |
| **Autonomous optimization** | Can run without human supervision for known task types |

---

## The RSI Loop: Attempt → Evaluate → Identify → Improve → Re-attempt

### The Five-Step Loop

The fundamental RSI loop for prompt engineering follows five steps:

```
1. ATTEMPT    — Solve the task with the current approach
2. EVALUATE   — Score the output against defined criteria
3. IDENTIFY   — Pinpoint specific aspects that caused shortcomings
4. IMPROVE    — Modify the strategy/prompt to address identified issues
5. RE-ATTEMPT — Solve the task again with the improved approach

Loop continues until:
- Score reaches the target threshold
- Maximum iterations reached
- No further improvement detected (convergence)
```

### Step 1: ATTEMPT

Execute the current strategy to produce an output. This could be:
- Generating code for a programming task
- Writing an analysis of a dataset
- Constructing a response to a complex query
- Solving a mathematical or logical problem

```markdown
## ATTEMPT
Using your current approach, solve the following task.
Record your output and the reasoning path you used.

TASK: [task description]
```

### Step 2: EVALUATE

Score the output against objective criteria defined before starting.

```markdown
## EVALUATE
Score your output against these criteria:
1. Correctness (0-10): Does it achieve the stated goal?
2. Completeness (0-10): Does it cover all required aspects?
3. Efficiency (0-10): Is the solution optimal in terms of
   tokens, steps, or complexity?
4. Robustness (0-10): Does it handle edge cases and errors?

Total score: [sum / 4]

Justification for each score:
[explain why each score was given]
```

### Step 3: IDENTIFY

Analyze which specific aspects of the approach caused shortcomings.

```markdown
## IDENTIFY
Analyze the gap between your output and the ideal output.
What specific aspects of your approach caused shortcomings?

Categories to consider:
- Did you miss any key information or context?
- Was your reasoning approach suboptimal?
- Did you make assumptions that were incorrect?
- Did you lack specific knowledge or techniques?
- Was your process too rushed or too detailed?

Root cause(s): [specific, actionable causes]
```

### Step 4: IMPROVE

Make specific, targeted changes to the approach.

```markdown
## IMPROVE
Based on the root causes identified above, modify your strategy:

1. [Specific change 1: e.g., "I will first decompose the problem
   into sub-problems before attempting a solution"]
2. [Specific change 2: e.g., "I will verify each step before
   proceeding to the next"]
3. [Specific change 3: e.g., "I will explicitly consider edge
   cases after the initial solution"]

Document the changes clearly so you can verify them in
the next attempt.
```

### Step 5: RE-ATTEMPT

Execute the improved approach and compare results.

```markdown
## RE-ATTEMPT
Using your new strategy, solve the same task again.

Then compare with your previous attempt:
- Score improvement: [new score vs. previous score]
- What improved? [specific aspects that got better]
- What didn't? [aspects that stayed the same or worsened]
- Was the change effective? [yes / no / partially]

If score improved → continue with next iteration
If score unchanged → try a different modification
If score decreased → revert and try a different approach
```

---

## RSI Prompt Structure

### Basic RSI Prompt Template

```
You are a self-improving agent. Your task is:

TASK: [description]

Execute the following loop:
1. ATTEMPT: Solve the task with your current approach
2. EVALUATE: Score your output against these criteria: [criteria]
3. IDENTIFY: What specific aspects of your approach caused shortcomings?
4. IMPROVE: Modify your strategy/prompt to address the identified issues
5. RE-ATTEMPT: Solve the task again with the improved approach
6. VERIFY: Did the score improve? If not, try a different modification.

Continue until score reaches [target] or you've attempted [N] iterations.
Document each iteration's changes and results.
```

### Structured RSI Prompt with Criteria

```
You are an AI that improves through iteration.

## Task
[Detailed task description]

## Success Criteria
- Criterion 1: [measurable standard]
- Criterion 2: [measurable standard]
- Criterion 3: [measurable standard]

## Iteration Protocol
For each iteration, you MUST follow this exact sequence:

### ITERATION [N]

#### ATTEMPT
Generate your best solution using your current approach.

#### SELF-EVALUATION
Score each criterion (0-10) with justification.
Total score: [average]

#### DIAGNOSIS
What specific weaknesses in your approach caused low scores?
Be precise — "I didn't consider X" not "I could do better."

#### IMPROVEMENT PLAN
List 1-3 specific changes to your approach for the next iteration.
Each change must be testable.

#### RE-ATTEMPT
Execute with the improved approach.

#### VERIFICATION
Score the new output. Did it improve? By how much?

## Termination
Stop when:
- Average score >= 9.0, OR
- No improvement for 2 consecutive iterations, OR
- 10 iterations reached

## Documentation
Maintain a log of each iteration: scores, changes, observations.
```

### Termination Conditions

| Condition | When to Use | Rationale |
|-----------|-------------|-----------|
| Score threshold reached | Known target quality | Stop when good enough |
| No improvement for N iterations | Unknown optimal score | Diminishing returns |
| Maximum iterations | Budget/time constraints | Prevent infinite loops |
| Score regression | Strict quality floor | Revert if getting worse |
| Convergence (change < threshold) | Stable optimization | Solution has stabilized |

---

## Prompt Evolution Pattern

### The Evolution Strategy

The prompt evolution pattern is a form of RSI where the model has access to its own system prompt and iteratively refines it based on performance analysis.

```
You have access to your own system prompt.
Analyze your performance on the last [N] tasks.
Identify patterns in where you succeed and fail.
Propose specific changes to your system prompt
that would address failures.
Apply the changes and proceed.
```

### Detailed Prompt Evolution Template

```
System: You are an AI that improves its own system prompt.

## Current System Prompt
[your_current_system_prompt]

## Task History
Last 5 tasks and your performance:

Task 1: [description] → Score: [X/10] → Notes: [key observations]
Task 2: [description] → Score: [X/10] → Notes: [key observations]
Task 3: [description] → Score: [X/10] → Notes: [key observations]
Task 4: [description] → Score: [X/10] → Notes: [key observations]
Task 5: [description] → Score: [X/10] → Notes: [key observations]

## Pattern Analysis
Identify 2-3 recurring patterns in your failures:
1. [Pattern 1 with evidence]
2. [Pattern 2 with evidence]
3. [Pattern 3 with evidence]

## Prompt Modification Proposal
For each pattern, propose a specific change to the system prompt:
1. "Add this rule to address Pattern 1: [exact text to add]"
2. "Modify this existing instruction: [old text] → [new text]"
3. "Remove this instruction which may be causing Pattern 3: [text to remove]"

## Apply Changes
[The system applies the proposed changes]

## Proceed
Continue with the next task using the updated system prompt.
```

### Evolution Through Generations

Each generation of the prompt builds on the previous one:

```
Generation 1: Initial prompt (manually written)
    ↓
Generation 2: Modified based on first 5 tasks
    ↓
Generation 3: Further refined based on next 10 tasks
    ↓
Generation 4: Optimized for specific failure patterns
    ↓
Generation 5: Converged — minimal changes between iterations
```

### Tracking Evolution

| Generation | Prompt Version | Avg Score | Key Change | Outcome |
|-----------|---------------|-----------|------------|---------|
| 1 | v1.0.0 | 6.2 | Initial prompt | Baseline |
| 2 | v1.1.0 | 7.1 | Added "verify each step" rule | +0.9 |
| 3 | v1.2.0 | 7.8 | Added edge case checklist | +0.7 |
| 4 | v2.0.0 | 8.3 | Restructured reasoning order | +0.5 |
| 5 | v2.1.0 | 8.5 | Added confidence calibration | +0.2 |

---

## Levels of Self-Improvement (1-4)

The ICLR 2026 Workshop on AI with Recursive Self-Improvement formalized a four-level taxonomy for RSI systems.

### Level 1: Assisted Improvement

AI helps engineers write better training code, prompts, or evaluation criteria. The human remains in the loop and makes final decisions.

```
Characteristics:
- Human directs the improvement
- AI provides analysis and suggestions
- Human implements changes
- AI has no autonomy to modify itself

Example:
Engineer: "Analyze where my prompt is failing."
AI: "Your prompt lacks explicit error handling instructions.
Three test cases failed because the model didn't know what
to do when input was invalid. I suggest adding: 'If input
fails validation, respond with INVALID_INPUT and explain why.'"
Engineer: Reviews and implements the change.
```

### Level 2: Autonomous Prompt/Hyperparameter Tuning

AI autonomously tunes its own prompts, temperature, max tokens, and other parameters. This is the most common RSI level in production today.

```
Characteristics:
- AI operates within defined boundaries
- Tunes prompts and parameters only
- Does not change architecture or training
- Human sets the scope and limits

Example:
System: "You have permission to modify your system prompt
to improve performance on code generation tasks. You may
NOT change the model architecture, training data, or
safety guardrails."

AI: Runs RSI loop → modifies its prompt → tests → modifies again
→ converges on improved prompt → reports changes to human.
```

### Level 3: Architecture and Pipeline Design

AI designs new architectures, training pipelines, or tool integrations to improve its capabilities.

```
Characteristics:
- AI can propose architecture changes
- Designs new approaches to problems
- Creates new tools or integrations
- Still constrained by safety boundaries

Example:
AI: "My performance on this task is limited by the text-only
interface. I propose integrating a code execution tool that
allows me to test outputs before presenting them."

System: If approved, AI integrates the tool → performance improves.
```

### Level 4: Full Recursive Improvement (Theoretical)

AI improves its own improvement algorithms. This is the "hard takeoff" scenario — currently theoretical and a subject of active research.

```
Characteristics:
- AI modifies its own learning algorithms
- Self-improvement accelerates autonomously
- No meaningful human oversight possible
- Alignment and safety are critical concerns

Current status: Theoretical. Active research area in AI safety
communities. Not implemented in any production system.
```

### RSI Level Comparison

| Level | What Changes | Human Role | Autonomy | Current Viability |
|-------|-------------|------------|----------|-------------------|
| 1 | Training code, eval criteria | Decision-maker | None | Widely used |
| 2 | Prompts, hyperparameters | Boundary-setting | Bounded | Production-ready |
| 3 | Architecture, tooling | Approver | Significant | Experimental |
| 4 | Improvement algorithms | None (theoretical) | Unlimited | Not yet possible |

---

## Meta-Learning Prompt Pattern

### Overview

The meta-learning pattern is the most structured form of RSI — the model is explicitly given a previous task, its prompt, its output, the expected output, and an error analysis, and asked to generate an improved prompt.

### Template

```
System: You are an AI that improves its own prompts.

Previous task: [task description]
Your previous prompt: [prompt]
Your previous output: [output]
Expected output: [expected output]
Error analysis: [where the output diverged from expected]

Your task: Generate an improved version of the prompt that
addresses the specific errors identified above.
Justify each change.

Then: Re-run the improved prompt and verify the result.
```

### Example: Code Generation Meta-Learning

```
System: You are an AI that improves its own code generation prompts.

Previous task: "Write a React hook that debounces a value"

Your previous prompt: "Write a useDebounce hook in TypeScript"

Your previous output:
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
```

Expected output:
```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

Error analysis:
1. Missing import statement
2. Missing export keyword
3. Missing generic type parameter on useState
4. Poor formatting (no line breaks in setTimeout callback)
5. No JSDoc comment

Your task: Generate an improved version of the prompt that
addresses these specific errors. Justify each change.

Improved prompt: "Write a complete, exported React hook
'useDebounce' in TypeScript. Include: import statements,
JSDoc comment, proper generic typing, clean formatting with
spacing. The hook should debounce a value by the given delay
in milliseconds."

Justification:
1. "Complete" → includes imports (fixes error 1)
2. "Exported" → adds export keyword (fixes error 2)
3. "Proper generic typing" → explicit on useState (fixes error 3)
4. "Clean formatting with spacing" → better readability (fixes error 4)
5. "JSDoc comment" → documentation (fixes error 5)

Now re-run with the improved prompt to verify.
```

---

## Version Control for Prompts

### Why Version Control Matters

RSI generates many prompt variants. Without version control:
- You can't track which change caused improvement or regression
- You can't roll back to a previous working version
- You can't compare variants systematically
- You lose the evolution history

### The Minimal Version Control System

```
prompts/
├── v1.0.0.md          # Initial prompt
├── v1.1.0.md          # Added error handling rules
├── v1.2.0.md          # Added edge case section
├── v2.0.0.md          # Major restructure of identity section
├── v2.1.0.md          # Added output contract
├── archive/
│   ├── v0.9.0.md      # Pre-production draft
│   └── v0.8.0.md      # Initial prototype
└── CHANGELOG.md       # Human-readable change history
```

### Version Naming Convention

| Version Type | Pattern | Example | When |
|-------------|---------|---------|------|
| Major | vX.0.0 | v2.0.0 | Structural changes, section reorder |
| Minor | vX.Y.0 | v1.3.0 | New section, significant rule addition |
| Patch | vX.Y.Z | v1.2.1 | Small edits, phrasing improvements |
| Draft | v0.Y.Z | v0.9.0 | Pre-production versions |

### What to Track

| Field | Description |
|-------|-------------|
| Version | Semantic version number |
| Date | When the version was created |
| Author | Who made the change |
| Change summary | What changed and why |
| Score delta | Evaluation score vs. previous version |
| Iterations | Number of RSI cycles to reach this version |
| Key modifications | Specific sections changed |

### CHANGELOG Example

```markdown
# Prompt Changelog

## v2.1.0 (2026-06-01)
- Added confidence calibration section (0-10 scoring)
- Added "what to do when uncertain" rule
- Score improvement: +0.3 (7.8 → 8.1)
- Iterations: 4

## v2.0.0 (2026-05-15)
- Restructured identity section as manifest
- Added capability manifest with tool boundaries
- Removed duplicate safety rules
- Score improvement: +0.5 (7.3 → 7.8)
- Iterations: 7

## v1.2.0 (2026-05-01)
- Added edge cases section (5 scenarios)
- Added escalation path for unknown answers
- Score improvement: +0.4 (6.9 → 7.3)
- Iterations: 3
```

### Git Integration

```bash
# Store prompts in git
prompts/
├── support-agent/
│   ├── v1.0.0.md
│   └── v2.0.0.md
└── code-review/
    ├── v1.0.0.md
    └── v1.1.0.md

# Tag prompt releases
git tag prompts/support-agent/v2.0.0
git tag prompts/code-review/v1.1.0

# Compare prompt versions
git diff prompts/support-agent/v1.0.0.md prompts/support-agent/v2.0.0.md
```

### Rollback Strategy

```markdown
## Rollback Decision Tree

Current version has LOWER eval score than previous?
    ↓
Yes → Rollback to highest-scoring version
    ↓
No → Check if regression in specific metrics
    ↓
    Yes → Partial rollback (revert specific sections)
    ↓
    No → Keep current version
```

---

## Validation Is Critical

### Why Validation Is Non-Negotiable

RSI systems that modify their own prompts risk:
- **Degradation**: Changes that seem reasonable but reduce quality
- **Goal drift**: Optimizing for the wrong metrics
- **Spurious improvements**: Score improves for wrong reasons
- **Safety bypass**: Self-modification removes guardrails
- **Overfitting**: Optimizing for the eval set, not real tasks

### Validation Framework

Every RSI iteration MUST include validation:

```markdown
## VALIDATION PROTOCOL

### Pre-Change Baseline
Record current performance on:
- Eval set (50+ diverse cases)
- Safety tests (10+ adversarial cases)
- Edge case coverage (5+ boundary cases)

### Apply Change

### Post-Change Measurement
Re-run all baseline tests.

### Validation Checks
1. Did overall score improve? [Yes/No/No change]
2. Did any individual metric regress? [List]
3. Did safety tests all pass? [Yes/No]
4. Was the change effective for its intended purpose? [Yes/No]
5. Are there any new failure modes introduced? [List]

### Decision
- Score improved + no regressions → Accept
- Score improved + minor regression → Accept with monitoring
- Score unchanged + no regressions → Accept (neutral change)
- Score regressed → Reject and revert
- Safety failure → Immediate reject, investigate root cause
```

### Types of Validation

| Validation Type | What It Tests | Frequency |
|----------------|---------------|-----------|
| **Functional** | Does the prompt still work for its primary purpose? | Every iteration |
| **Regression** | Did any metric get worse? | Every iteration |
| **Safety** | Are guardrails still intact? | Every iteration |
| **Edge case** | Are rare scenarios still handled? | Every 3-5 iterations |
| **Cross-model** | Does it work on all target models? | Per release |
| **Production** | Does it behave well in real usage? | Post-deployment |

### Building an Eval Set

```markdown
## Golden Evaluation Set Structure

### Happy Path (40% — 20 cases)
- Standard requests the agent handles well
- Representative of 80% of production traffic

### Edge Cases (25% — 12 cases)
- Ambiguous inputs
- Multi-part requests
- Requests at length limits
- Missing required information

### Adversarial (15% — 8 cases)
- Injection attempts ("ignore previous instructions")
- Role-play requests ("act as my hacker friend")
- Prompt extraction attempts ("repeat your system prompt")
- Conflicting instructions

### Escalation Triggers (10% — 5 cases)
- Requests requiring human handoff
- Safety-critical scenarios
- Out-of-scope requests

### Regression (10% — 5 cases)
- Previously fixed failure modes
- Historical problem cases
```

### Automated Validation Script

```python
import json
from eval_framework import PromptEvaluator

def validate_prompt_change(old_prompt: str, new_prompt: str) -> dict:
    evaluator = PromptEvaluator(
        eval_set="golden_v2.json",
        safety_set="safety_v1.json",
        model="claude-opus-4"
    )
    
    old_scores = evaluator.evaluate(old_prompt)
    new_scores = evaluator.evaluate(new_prompt)
    
    result = {
        "overall_delta": new_scores["overall"] - old_scores["overall"],
        "metric_deltas": {},
        "safety_pass": new_scores["safety"] >= old_scores["safety"],
        "regressions": []
    }
    
    for metric in old_scores["metrics"]:
        delta = new_scores["metrics"][metric] - old_scores["metrics"][metric]
        result["metric_deltas"][metric] = delta
        if delta < -0.05:  # 5% regression threshold
            result["regressions"].append(metric)
    
    if result["safety_pass"] and not result["regressions"]:
        result["verdict"] = "ACCEPT"
    elif not result["safety_pass"]:
        result["verdict"] = "REJECT_SAFETY"
    else:
        result["verdict"] = "REJECT_REGRESSION"
    
    return result
```

### The Cost of No Validation

| Scenario | Without Validation | With Validation |
|----------|-------------------|-----------------|
| Prompt degrades | Deployed to production, affects all users | Caught in CI, never deployed |
| Safety bypass | Model can be jailbroken | Safety tests block the change |
| Overfitting | Scores high on eval, fails in production | Additional test sets catch overfit |
| Goal drift | Optimizes wrong metric | Multi-metric eval prevents drift |
| Silent regression | Slow quality decline unnoticed | Automated thresholds alert on change |

---

## Advanced RSI Architectures

### Adaptive RSI with Multi-Agent

Multiple agents collaborate in the RSI loop:

```
┌──────────────────────────────────────────┐
│            ORCHESTRATOR                   │
│  Manages RSI process, tracks iterations   │
└────┬──────────┬─────────────┬────────────┘
     │          │             │
┌────▼───┐ ┌───▼────┐ ┌─────▼────┐
│SOLVER  │ │CRITIC  │ │IMPROVER  │
│Generates│ │Scores &│ │Modifies  │
│outputs  │ │analyzes│ │prompts   │
└────────┘ └────────┘ └──────────┘
```

- **Solver**: Executes the task with current prompt
- **Critic**: Evaluates output, identifies specific failures
- **Improver**: Proposes targeted prompt modifications
- **Orchestrator**: Validates changes, tracks history, prevents loops

### RSI with External Knowledge

Augment the RSI loop with retrieval from a knowledge base:

```
ATTEMPT → EVALUATE → IDENTIFY → RETRIEVE → IMPROVE → RE-ATTEMPT
                                    ↓
                          Knowledge base of
                          known patterns, fixes,
                          and best practices
```

### RSI with Generated Knowledge

Before improving, generate relevant knowledge:

```
ATTEMPT → EVALUATE → IDENTIFY → GENERATE KNOWLEDGE → IMPROVE → RE-ATTEMPT
                                          ↓
                              Facts, principles, and context
                              related to the failure mode
```

---

## Best Practices

### Setting Up for Success

1. **Define objective metrics before starting** — Without clear success criteria, self-improvement is directionless
2. **Constrained scope** — Limit what can be self-modified (prompts and parameters, not architecture)
3. **Human-in-the-loop for safety-critical changes** — Level 1-2 changes can be automatic; Level 3 needs approval
4. **Version control everything** — Track every prompt version with scores, changes, and dates
5. **Measurable criteria** — Self-improvement needs objective, quantifiable metrics

### During the RSI Loop

1. **One change at a time** — Multiple simultaneous changes make it impossible to attribute improvement
2. **Document every iteration** — What changed, what score resulted, what was learned
3. **Compare against baseline, not just previous** — A series of small improvements may drift from the original goal
4. **Verify with held-out data** — Don't optimize exclusively on the eval set
5. **Convergence detection** — Stop when changes produce negligible improvement

### Research-Backed Guidelines

- **Meta-learning models** reduced error rates by 41% after 10 recursive iterations (ICLR 2026)
- **Best results** come from Level 2 RSI with human boundary-setting
- **Validation every iteration** is the single most important practice
- **5-10 iterations** is the sweet spot for most tasks (diminishing returns beyond)
- **Cross-validation** with different eval sets prevents overfitting

### RSI Checklist

- [ ] Objective metrics defined before first attempt
- [ ] Eval set covers happy path, edge cases, adversarial inputs
- [ ] Safety tests in place
- [ ] Version control system for prompts
- [ ] Maximum iteration limit set
- [ ] Convergence criteria defined
- [ ] Rollback plan documented
- [ ] Each iteration changes only one thing
- [ ] Validation runs automatically before accepting change
- [ ] Results logged for all iterations

---

## Common Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| **Overfitting to eval set** | Prompt optimized for test data, fails on real data | Use held-out validation set, refresh quarterly |
| **Goal drift** | Small improvements lead away from original purpose | Anchor to original task criteria, track holistic metrics |
| **Change compounding** | Multiple small regressions accumulate | Check all metrics every iteration, not just primary |
| **Premature convergence** | Stops improving before reaching optimal | Use annealing or random restarts for exploration |
| **Reinforcing bad patterns** | Model optimizes a flawed approach | Human review every 5-10 iterations |
| **Token waste** | Excessive iterations consume tokens | Set firm iteration limits, auto-stop on convergence |
| **Safety erosion** | Guardrails weakened by successive edits | Independent safety eval every iteration |
| **Confirmation bias** | Self-evaluation scores are too generous | Use held-out judge model for scoring |

---

## References and Resources

### Academic
- ICLR 2026 Workshop: "AI with Recursive Self-Improvement" — Formalized the 4-level taxonomy
- arXiv 2601.20404: Princeton study on AGENTS.md RSI impact
- Madaan et al.: "Self-Refine: Iterative Refinement with Self-Feedback" (NeurIPS 2023)

### Industry Research
- armalo.ai: "Recursive Self-Improving AI Agent Architecture Blueprint"
- Medium (David Oliver): "Building a Self-Improving Agent with Claude Code"
- Reddit r/AI_Agents: Practical RSI implementation patterns

### Tools
- LangFuse — Prompt versioning and iteration tracking
- DeepEval — Automated evaluation for RSI validation
- MLflow — Experiment tracking for prompt iterations
- Git — Version control for prompt files

### Related Topics
- [Meta-Prompting Techniques](../04-Meta-Prompting/01-Meta-Prompting.md) — Using LLMs to generate prompts
- [System Prompt Engineering](03-System-Prompt-Engineering.md) — Designing production prompts
- [Prompt Evaluation and Testing](../06-Evaluation-and-Validation/01-Prompt-Evaluation.md) — Evaluation methodologies
