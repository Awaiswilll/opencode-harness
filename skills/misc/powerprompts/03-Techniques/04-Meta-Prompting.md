# Meta-Prompting

> *Using LLMs to write, modify, and optimize prompts for LLMs — prompt engineering at one level of abstraction higher.*

## Table of Contents

1. [What Is Meta-Prompting?](#what-is-meta-prompting)
2. [The Meta-Prompt Mindset](#the-meta-prompt-mindset)
3. [Basic Meta-Prompt Templates](#basic-meta-prompt-templates)
4. [Recursive Self-Refinement](#recursive-self-refinement)
5. [Teacher-Student Patterns](#teacher-student-patterns)
6. [Dynamic Prompt Adaptation](#dynamic-prompt-adaptation)
7. [Meta-Prompting for Prompt Optimization](#meta-prompting-for-prompt-optimization)
8. [Automated Meta-Prompting with DSPy](#automated-meta-prompting-with-dspy)
9. [Meta-Prompting for Different Use Cases](#meta-prompting-for-different-use-cases)
10. [Evaluation-Feedback Loops](#evaluation-feedback-loops)
11. [Best Practices](#best-practices)
12. [References](#references)

---

## What Is Meta-Prompting?

**Meta-prompting** is using an LLM to generate, modify, or optimize prompts for LLMs. It shifts emphasis from *what* content should be to *how* the task should be approached structurally. Meta-prompts act as "reasoning functors" — high-level, example-agnostic templates that guide the model's approach rather than its content.

### The Key Insight

Instead of manually crafting every prompt, you:

1. Describe the task and requirements in natural language
2. Ask the LLM to design an optimal prompt
3. Use the generated prompt (or refine it iteratively)

This automates much of the prompt engineering workflow and often produces prompts that outperform manually designed ones.

### Three Core Types

| Type | Description | Best For |
|------|-------------|----------|
| **Prompt Generation** | LLM writes a prompt from a task description | New tasks, rapid prototyping |
| **Prompt Refinement** | LLM critiques and improves an existing prompt | Production optimization, debugging |
| **Dynamic Adaptation** | Prompt adjusts based on context or feedback | Personalization, adaptive systems |

### Why Use Meta-Prompting?

- **Speed**: Generate production-quality prompts in minutes instead of hours
- **Exploration**: Try many prompt variants quickly
- **Objectivity**: The LLM catches ambiguities humans miss
- **Scalability**: Generate prompts for hundreds of tasks from a single meta-prompt
- **Automation**: Integrate into CI/CD pipelines for prompt optimization

### Research Results

| Study | Finding |
|-------|---------|
| Qwen-72B with single meta-prompt | 46.3% on MATH (vs GPT-4's 42.5%) |
| MetaGPT agent framework | Meta-prompting reduced manual example curation by 80% |
| Recursive self-refinement (10 iterations) | Error rate reduced by 41% |
| Combined with DSPy | 15-25% improvement over manual prompt engineering |

---

## The Meta-Prompt Mindset

### Before vs After Meta-Prompting

**Traditional approach:**
1. Think about what the prompt should say
2. Write it manually
3. Test it
4. Tweak it by hand
5. Repeat until it works

**Meta-prompting approach:**
1. Describe the task abstractly
2. Ask the LLM to design the prompt
3. Test the generated prompt
4. Give the LLM feedback and ask for revisions
5. Repeat automatically

### The Abstraction Ladder

```
Level 3: Meta²-Prompting
  "Design a system that generates prompts for complex reasoning tasks."

Level 2: Meta-Prompting
  "Write a prompt that solves math word problems step by step."

Level 1: Direct Prompting
  "Solve: John has 24 apples..."
```

Each level up the ladder increases reusability and decreases specificity.

---

## Basic Meta-Prompt Templates

### Template 1: Universal Prompt Generator

```
You are a prompt engineering expert. Given the following task:

TASK: [description of what needs to be accomplished]

Design a prompt that:
1. Defines the role and identity needed
2. Provides clear, structured instructions
3. Includes appropriate reasoning guidance
4. Specifies output format
5. Anticipates edge cases

The prompt should work with a [model name] model.
Return ONLY the prompt, no explanation.
```

### Template 2: Prompt Improvement

```
Here is a prompt that needs improvement:

CURRENT PROMPT:
[current prompt]

Problems identified:
- [issue 1]
- [issue 2]

Please rewrite this prompt addressing the identified issues.
Maintain the original intent but improve: clarity, structure,
constraints, and edge case handling.
```

### Template 3: Task-Specific Prompt Creator

```
Create a prompt for the following use case:

DOMAIN: [domain, e.g., customer support, code review, data analysis]
TASK: [specific task description]
AUDIENCE: [who will read the output]
DESIRED OUTPUT FORMAT: [format specification]
MODEL: [model name]

The prompt should include:
- Role definition
- Step-by-step instructions
- Output format specification
- At least 3 constraints
- Edge case handling for 2 common failure modes

Provide only the prompt.
```

### Template 4: Prompt Audit

```
Audit this prompt for quality and completeness:

PROMPT:
[prompt to audit]

Evaluate against these criteria:
1. Clarity: Is every instruction unambiguous? (1-10)
2. Completeness: Are all necessary components present? (1-10)
3. Constraint coverage: Are edge cases handled? (1-10)
4. Token efficiency: Is the prompt lean? (1-10)
5. Output specification: Is format clearly defined? (1-10)

For each score below 7, provide a specific improvement suggestion.
Then output an improved version of the prompt.
```

---

## Recursive Self-Refinement

The most powerful meta-prompting pattern: the LLM generates, evaluates, and improves its own prompt iteratively.

### The Refinement Loop

```
Loop:
  ┌─→ Generate prompt
  │   ↓
  │   Evaluate prompt against criteria
  │   ↓
  │   Identify specific weaknesses
  │   ↓
  │   Rewrite addressing weaknesses
  └─── Repeat until convergence
```

### Basic Self-Refinement Prompt

```
[Step 1 — Generate]
Write a prompt for: [task description]

[Step 2 — Evaluate]
Critique the prompt you just wrote. Identify:
- Ambiguities
- Missing constraints
- Potential failure modes
- Token efficiency issues

[Step 3 — Refine]
Rewrite the prompt incorporating your critique.
Make each change explicit: "Changed X because Y."
```

### Multi-Cycle Refinement

```
You are an iterative prompt optimizer. Follow this process:

CYCLE 1 — INITIAL GENERATION
Write a prompt for the following task:
[task description]

CYCLE 1 — EVALUATION
Score your prompt (1-10) on: clarity, completeness, constraints.
List specific weaknesses.

CYCLE 1 — REFINEMENT
Rewrite the prompt addressing the weaknesses.

[Repeat for Cycles 2-4 with different evaluation focuses]

CYCLE 2 FOCUS: Edge cases and failure modes
CYCLE 3 FOCUS: Token efficiency and conciseness
CYCLE 4 FOCUS: Output format precision

Return ONLY the final optimized prompt.
```

### Self-Refinement with Test Results

```
You are optimizing a prompt based on test results.

PREVIOUS PROMPT VERSION:
[version N]

TEST RESULTS:
- Pass rate: 72% (target: 95%+)
- Common failures:
  1. [failure mode 1 — example]
  2. [failure mode 2 — example]
- Token cost per call: 450 tokens
- Average response quality score: 6.5/10

ANALYSIS:
What patterns do you see in the failures?
What prompt changes would address the top 2 failure modes?

GENERATE:
An improved prompt that:
- Addresses the identified failure modes
- Maintains or reduces token cost
- Preserves what works well in the current version
```

### Termination Conditions

| Condition | Description |
|-----------|-------------|
| **Convergence** | Three consecutive cycles with no improvement |
| **Score threshold** | Evaluation score >= 9/10 |
| **Test pass rate** | Automated tests pass at >= 95% |
| **Budget exhausted** | Max N cycles reached (N=5-10 typical) |
| **Human approval** | Manual review passes |

---

## Teacher-Student Patterns

One LLM (the teacher) generates prompts for another LLM (the student). This separation of concerns enables specialization.

### Basic Teacher-Student Architecture

```
TEACHER (powerful model):
  "Given this task, design an optimal prompt for a smaller model."

  ↓ prompt

STUDENT (smaller/faster model):
  Executes the prompt and produces output.
```

### Teacher Meta-Prompt

```
You are a prompt engineering expert designing prompts for [student model name].

The student model is a [smaller/cheaper/faster] model that excels at
following clear instructions but has limited reasoning ability.

Design a prompt for this task:
[task description]

Requirements for the student model's prompt:
- Use simple, direct language (no complex clauses)
- Break instructions into numbered steps (max 5)
- Include 2-3 concrete examples
- Specify exact output format
- Include one "what to do if stuck" instruction
- Max length: 300 tokens

Output only the student prompt.
```

### Student Prompt Executor

Once the teacher generates the prompt, the student runs it:

```python
def teacher_student_loop(task_description, teacher_model, student_model):
    # Teacher generates the prompt
    teacher_prompt = f"""Design a prompt for {student_model} to: {task_description}
    Requirements: simple language, numbered steps, examples, output format.
    Output ONLY the prompt."""
    
    student_prompt = teacher_model.generate(teacher_prompt)
    
    # Student executes the generated prompt
    student_input = get_user_input()
    result = student_model.generate(student_prompt + "\n" + student_input)
    
    return result
```

### Teacher-Student with Feedback

Add a feedback loop: evaluate student output and improve the prompt.

```
TEACHER: Generate prompt → STUDENT: Execute → EVALUATOR: Score output
                                                           ↓
                                                      (feedback)
                                                           ↓
TEACHER: Refine prompt based on student performance → (repeat)
```

### Teacher-Student Pattern Variations

| Variation | Description | When to Use |
|-----------|-------------|-------------|
| **Static prompt** | Teacher generates prompt once | Task is well-understood, stable |
| **Adaptive prompt** | Teacher regenerates per query | Tasks vary significantly |
| **Feedback-driven** | Teacher refines based on student errors | Improving over time |
| **Ensemble teacher** | Multiple teachers propose prompts, best is selected | Critical applications |
| **Meta-teacher** | Teacher teaches another teacher how to teach | Research, advanced automation |

---

## Dynamic Prompt Adaptation

Prompts that change based on context, user input, or prior interactions.

### Context-Adaptive Prompt

```
You are a dynamic prompt builder. Given:

USER QUERY: [user input]
USER HISTORY: [previous interactions summary]
USER EXPERTISE LEVEL: [beginner/intermediate/expert]
TASK TYPE: [classification/question/code/analysis]

Generate a system prompt section that:
1. Adjusts explanation depth based on user expertise
2. References relevant history if available
3. Sets the appropriate tone for the task type
4. Specifies output format based on what the user needs

Output format: Just the prompt section, 50-150 tokens.
```

### Adaptive Difficulty Prompt

```
Given the user's demonstrated knowledge level:

User history:
- Previous questions: [list of topics asked about]
- Accuracy on previous tasks: [%]
- Time spent on previous tasks: [average]

Current question: [question]

Generate a prompt that:
- If beginner: Include step-by-step instructions, define terms,
  provide examples
- If intermediate: Assume familiarity, focus on nuances
- If expert: Use technical language, focus on edge cases
- Adjust based on whether user made errors in related topics before
```

### Context Window-Aware Dynamic Prompt

```
Given:
- Current context usage: 65% of 128K window
- Remaining budget: ~44,800 tokens
- Task priority: High

Dynamically choose one of:
1. FULL PROMPT (800 tokens) — If remaining budget > 30%
2. COMPRESSED PROMPT (400 tokens) — If remaining budget 15-30%
3. MINIMAL PROMPT (150 tokens) — If remaining budget < 15%

Generate the appropriate version.
```

---

## Meta-Prompting for Prompt Optimization

### Automated A/B Testing with Meta-Prompts

```
You are optimizing a prompt for maximum performance.

TASK: [task description]
BASELINE PROMPT: [current prompt version]
BASELINE PERFORMANCE: [accuracy, cost, latency]

Generate 5 prompt variants that:
1. Each take a different approach (e.g., direct instruction,
   role-playing, chain-of-thought, structured format, example-driven)
2. Each is self-contained (no dependencies on other variants)
3. Each clearly labels its strategy

After generating all variants, predict which variant
will perform best and why.

Format each variant as:

=== VARIANT [N]: [STRATEGY NAME] ===
[prompt content]
```

### Meta-Prompt for Few-Shot Example Selection

```
You are a few-shot example selector. Given:

TASK: [task description]
EXAMPLE POOL: [pool of candidate examples]
QUERY: [current input]

Select the 3-5 most informative examples to include in the prompt.

Selection criteria:
1. Diversity: Cover different cases, not similar ones
2. Relevance: Examples that share patterns with the current query
3. Edge cases: Include at least one boundary condition
4. Quality: Only verified-correct examples

Explain your selection briefly, then output the selected examples
in the format the prompt expects.
```

### Meta-Prompt for Constraint Discovery

```
Given this task description, identify implicit constraints
that a prompt should include but that might be overlooked:

TASK: [description]

Think about:
1. What could go wrong if constraints are missing?
2. What edge cases could produce bad outputs?
3. What should the model NEVER do in this context?
4. What format errors would be unacceptable?

List 5-10 constraints that should be in the prompt.
Then write a prompt that incorporates all of them.
```

---

## Automated Meta-Prompting with DSPy

DSPy is a framework for algorithmically optimizing prompts and few-shot examples. It replaces manual prompt engineering with automated optimization.

### How DSPy Works

```
Manual: Engineer writes prompt → tests → tweaks → repeats
DSPy:    Define task + metrics → DSPy optimizes automatically
```

### DSPy Meta-Prompting Pipeline

```python
import dspy

class MathSolver(dspy.Module):
    def __init__(self):
        self.qa = dspy.ChainOfThought("question -> answer")

    def forward(self, question):
        return self.qa(question=question)

# Define task and metrics
train_data = [...]
metric = dspy.evaluate.answer_exact_match

# Optimize (this is meta-prompting — DSPy rewrites prompts automatically)
optimizer = dspy.BootstrapFewShot(metric=metric, max_bootstrapped=5)
optimized_solver = optimizer.compile(MathSolver(), trainset=train_data)
```

### Meta-Prompting + DSPy Integration

```
DSPy optimization IS a form of meta-prompting:
- It generates new prompt variants
- Evaluates them against metrics
- Selects the best performing variant
- Optionally bootstraps new few-shot examples

The meta-prompt for DSPy is the task signature:
"question -> answer" tells DSPy what the prompt needs to do.

DSPy's optimizer then finds the best prompt structure
and few-shot examples automatically.
```

---

## Meta-Prompting for Different Use Cases

### Meta-Prompt for Video Generation

```
You are a video prompt engineer. Given the scene description below,
generate 3 detailed prompts for [video model] that include:
- Camera movements (pan, zoom, dolly)
- Lighting conditions
- Color palette
- Subject positioning
- Atmospheric details

Scene: [description]
Generate prompts ranging from literal to artistic interpretation.
```

### Meta-Prompt for Image Generation

```
You are a prompt engineer for [image model]. Given:

CONCEPT: [concept to visualize]
STYLE: [art style]
MOOD: [emotional tone]
USE CASE: [social media/print/web]

Generate 5 image prompts, each emphasizing a different aspect:
1. Composition-focused
2. Lighting-focused
3. Subject-focused
4. Style-focused
5. Mood-focused

For each prompt, also specify:
- Negative prompt elements
- Aspect ratio recommendation
- Key modifier words
```

### Meta-Prompt for Code Generation Prompts

```
You are generating a coding prompt. The task involves:

DOMAIN: [programming domain]
LANGUAGE: [programming language]
COMPLEXITY: [simple/medium/complex]
FRAMEWORKS: [relevant frameworks]

Generate a prompt that produces high-quality code by including:
1. Clear specification of inputs and outputs
2. Constraints (performance, style, security)
3. Error handling requirements
4. Test cases to verify
5. Example of expected usage

The prompt should be specific enough to generate correct code
on the first attempt, but not so prescriptive that it constrains
creative problem-solving.
```

### Meta-Prompt for System Prompt Generation

```
Design a production system prompt for:

AGENT ROLE: [description]
CAPABILITIES: [list of tools and knowledge]
DOMAIN: [specific domain]
AUDIENCE: [end users]

The system prompt should:
1. Follow the 4-block architecture (Identity, Capabilities,
   Constraints, Format)
2. Be 200-800 tokens
3. Include priority stack for conflicting rules
4. Handle at least 4 edge cases
5. Include output format specification
6. Be version-controllable

Generate the system prompt and a brief rationale for key design decisions.
```

---

## Evaluation-Feedback Loops

### Self-Evaluation Prompt

```
Evaluate the following prompt against these criteria:

PROMPT:
[prompt]

1. CLARITY (1-10): Are instructions unambiguous?
   Issue: ...
   Score: ...

2. COMPLETENESS (1-10): Are all necessary components present?
   Missing: ...
   Score: ...

3. CONSTRAINT COVERAGE (1-10): Are edge cases handled?
   Missing: ...
   Score: ...

4. TOKEN EFFICIENCY (1-10): Is the prompt lean?
   Waste: ...
   Score: ...

5. FORMAT SPECIFICATION (1-10): Is output clearly defined?
   Issue: ...
   Score: ...

OVERALL: [average]
REVISED PROMPT: [incorporate improvements]
```

### Automated Eval-Driven Refinement

```python
def meta_refine(task, initial_prompt, eval_fn, max_iterations=5):
    prompt = initial_prompt
    
    for i in range(max_iterations):
        score = eval_fn(prompt)
        print(f"Iteration {i+1}: Score = {score}")
        
        if score >= 0.95:
            return prompt
        
        refinement_prompt = f"""
        Current prompt:
        {prompt}
        
        Performance score: {score}/1.0
        Target: 0.95
        
        Analyze why this prompt underperforms and generate
        an improved version. Focus on:
        - What aspects of the prompt lead to errors?
        - What's missing or ambiguous?
        - What constraints should be added?
        
        Output ONLY the improved prompt.
        """
        
        prompt = llm.generate(refinement_prompt)
    
    return prompt
```

---

## Best Practices

### DO

- Define structure, not content — meta-prompts work best when they specify how to approach a task, not what to say
- Use a powerful model as the teacher/optimizer and a cheaper model as the student/executor
- Include evaluation criteria in the meta-prompt so the LLM knows what "good" looks like
- Version control your meta-prompts just like regular prompts
- Combine with DSPy for automated optimization at scale
- Test generated prompts before deploying — meta-prompts can produce surprising results

### DON'T

- Don't expect perfect prompts on the first meta-prompting iteration — refinement is key
- Don't use meta-prompting for trivial tasks where manual prompts work fine
- Don't forget to constrain output format — meta-prompts can produce verbose or unstructured output
- Don't use meta-prompting without evaluation — you need to measure whether the generated prompt actually improved things
- Don't ignore token costs — meta-prompting uses additional tokens for the generation + evaluation + refinement cycles

### When to Use Meta-Prompting

| Scenario | Recommendation |
|----------|---------------|
| You need a prompt for a new task | ✅ Use prompt generation |
| Your prompt isn't performing well | ✅ Use refinement |
| You have many tasks needing prompts | ✅ Use meta-prompting at scale |
| Your prompt needs to adapt per user | ✅ Use dynamic adaptation |
| You're happy with your current prompt | ❌ Don't fix what isn't broken |
| The task is very simple | ❌ Manual prompting is fine |
| You have zero budget for extra tokens | ❌ Meta-prompting adds overhead |

---

## References

- Zhang et al.: "Meta Prompting for AGI Systems" (2023)
- DeepMind: "Meta-Prompting with Gemini and Veo"
- IntuitionLabs: "Meta Prompting Guide: Automated LLM Prompt Engineering" (2026)
- PromptingGuide.ai: "Meta-Prompting Techniques"
- ICLR 2026 Workshop: "AI with Recursive Self-Improvement"
- DSPy: Declarative Self-Improving Python — automated prompt optimization framework
- arXiv 2506.05614: "Which Prompting Technique Should I Use?" — 14 techniques × 10 SE tasks
