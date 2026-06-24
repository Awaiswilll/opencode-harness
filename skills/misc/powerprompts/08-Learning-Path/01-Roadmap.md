# Prompt Engineering Learning Roadmap

> A structured 8-stage roadmap from complete beginner to production-grade prompt engineer, with time estimates, key skills, and career progression guidance.

---

## Table of Contents

1. [The 8-Stage Roadmap](#the-8-stage-roadmap)
2. [Stage Details](#stage-details)
3. [Career Timeline](#career-timeline)
4. [Skill Progression Matrix](#skill-progression-matrix)
5. [Learning Approach](#learning-approach)

---

## The 8-Stage Roadmap

| Stage | Focus | Time Estimate | Prerequisites | Key Outcome |
|-------|-------|:-------------:|---------------|-------------|
| **0. Orientation** | Mindset & setup | 20 min | None | Understand what prompting is and how LLMs work at a high level |
| **1. Foundations** | LLM mechanics, tokenization | 90 min | Stage 0 | Understand tokens, context windows, temperature, sampling, model differences |
| **2. Prompt Core** | Anatomy of prompts | 180 min | Stage 1 | Write clear role-based prompts with structure, few-shot examples, and output format |
| **3. Advanced Reasoning** | Thinking techniques | 150 min | Stage 2 | Apply CoT, ToT, ReAct, self-consistency, generated knowledge, contrastive prompting |
| **4. Production Engineering** | Structured outputs, caching, evals | 200 min | Stage 3 | Deploy prompts with versioning, caching, evaluation, and cost optimization |
| **5. Agents & Multi-Agent** | Tool use, MCP, patterns | 180 min | Stage 4 | Build agentic systems with tool use, sub-agents, and multi-agent orchestration |
| **6. RAG & Infrastructure** | Chunking, vector DBs, deployment | 150 min | Stage 5 | Implement retrieval-augmented generation with monitoring and scaling |
| **7. Safety & Ethics** | Hallucination, red teaming | 90 min | Stage 6 | Defend against prompt injection, jailbreaks, and content safety issues |
| **8. Capstone Projects** | End-to-end | ~40h (4 × 10h) | All above | Build 4 production-grade systems demonstrating mastery |

**Total estimated learning time:** ~30 hours of instruction + ~40 hours of projects

---

## Stage Details

### Stage 0: Orientation (20 minutes)

**Goal:** Understand the landscape and set up your learning environment.

| Topic | What to Learn | Resource |
|-------|---------------|----------|
| How LLMs work (3-min high level) | Transformer architecture basics, training process | Any "LLM explained in 5 minutes" video |
| What prompt engineering is | Definition, why it matters, real-world applications | learnprompting.org introduction |
| Ecosystem overview | OpenAI, Anthropic, Google, open-source models | Model provider documentation |
| Tooling setup | Install Python, API keys, playground access | Quickstart guides |

**Key questions to answer:**
- What is a prompt? What is a completion?
- How do LLMs differ from traditional software?
- What can prompt engineering achieve?

### Stage 1: Foundations (90 minutes)

**Goal:** Understand the technical fundamentals that inform prompt design.

| Topic | What to Learn | Time |
|-------|---------------|:----:|
| Tokenization | How text is split into tokens, tokenizer tools | 20 min |
| Context windows | What they are, limits (4K → 200K), implications | 15 min |
| Temperature & sampling | How temperature affects randomness, top-k, top-p | 15 min |
| Model differences | GPT vs Claude vs Gemini vs open-source | 20 min |
| System vs user vs assistant roles | Message structure in chat completions | 10 min |
| Pricing fundamentals | Input vs output token costs, model tiers | 10 min |

**Practice:** Use a tokenizer tool to analyze different texts. Call a model with temperature=0 vs temperature=1 and compare outputs. Run the same prompt across GPT-4o-mini and Claude Opus — observe differences.

**Checkpoint:** Can you explain what happens when you increase temperature? Can you estimate the cost of a 500-token input to GPT-4o?

### Stage 2: Prompt Core (180 minutes)

**Goal:** Write effective, structured prompts using established frameworks.

| Topic | What to Learn | Time |
|-------|---------------|:----:|
| Role prompting | Assigning personas, why it works | 20 min |
| Prompt structure | Clarity, specificity, action verbs | 20 min |
| Zero-shot vs few-shot | When to use each, example quality | 25 min |
| Output formatting | JSON, markdown, XML tags, schemas | 25 min |
| Constraint-based prompting | Dos, don'ts, boundaries, format | 20 min |
| Framework deep dives | COSTAR, RISEN, CRISPE, RTCROS, CRAFT | 40 min |
| Negative prompting | Contrastive examples, what NOT to do | 15 min |
| Iterative refinement | Test, measure, improve cycle | 15 min |

**Practice:** Take a vague prompt ("Write about AI") and refine it through 5 iterations using the CLEAR framework. For each iteration, identify which component you improved.

**Frameworks to master:**
1. **COSTAR** — Context, Objective, Style, Tone, Audience, Response
2. **RISEN** — Role, Instructions, Steps, End Goal, Narrowing
3. **CRISPE** — Capacity, Insight, Statement, Personality, Experiment

**Checkpoint:** Can you write a COSTAR prompt from scratch? Can you convert a vague request into a structured prompt with all essential components?

### Stage 3: Advanced Reasoning (150 minutes)

**Goal:** Apply sophisticated reasoning techniques for complex tasks.

| Topic | What to Learn | Time |
|-------|---------------|:----:|
| Chain-of-Thought (CoT) | "Let's think step by step", zero-shot CoT | 20 min |
| Tree-of-Thoughts (ToT) | Exploring multiple reasoning paths | 20 min |
| ReAct | Interleaving reasoning with tool use | 25 min |
| Self-Consistency | Multiple samples → majority vote | 15 min |
| Generated Knowledge | Generate facts first, then answer | 15 min |
| Step-Back Prompting | Abstract to principles, then apply | 15 min |
| Contrastive CoT | Correct vs incorrect reasoning examples | 15 min |
| Self-Refine | Generate → critique → refine → repeat | 15 min |
| Plan-and-Solve | Plan first, then execute step by step | 10 min |

**Practice:** Give the model a complex logic puzzle. Try it with and without CoT. Then try ToT (ask it to explore 3 paths). Compare results.

**Checkpoint:** Can you explain when to use CoT vs ToT vs ReAct? Can you write a prompt that uses self-consistency?

### Stage 4: Production Engineering (200 minutes)

**Goal:** Deploy prompts reliably with versioning, evaluation, and cost management.

| Topic | What to Learn | Time |
|-------|---------------|:----:|
| Prompt versioning | Git + YAML, semantic versioning, changelogs | 30 min |
| Evaluation frameworks | PEEM 9 axes, golden datasets | 35 min |
| A/B testing | Sample sizes, Wilcoxon test, Cohen's d | 30 min |
| Regression testing | CI/CD gates, threshold enforcement | 25 min |
| Cost optimization | Model routing, caching, compression | 30 min |
| Structured outputs | JSON mode, function calling, Pydantic schemas | 25 min |
| Monitoring | Metrics, alerting, observability | 25 min |

**Practice:** Set up a Git repo with a prompts directory. Create a prompt with version metadata. Write a simple evaluation script. Run an A/B test comparing two prompt variants.

**Checkpoint:** Can you create a PR for a prompt change with eval results? Can you implement a model routing function?

### Stage 5: Agents & Multi-Agent (180 minutes)

**Goal:** Build systems where LLMs use tools, plan, and collaborate.

| Topic | What to Learn | Time |
|-------|---------------|:----:|
| Tool use | Function calling, tool definitions, executing actions | 30 min |
| Model Context Protocol (MCP) | Standardized tool interface | 20 min |
| Agent patterns | ReAct loop, plan-execute, observe-think-act | 35 min |
| Sub-agents | Delegating subtasks to specialized agents | 25 min |
| Multi-agent orchestration | Debate, consensus, hierarchical | 30 min |
| Agent evaluation | Tool correctness, plan adherence, efficiency | 20 min |
| Guardrails for agents | Authorization, human-in-the-loop, escalation | 20 min |

**Practice:** Build an agent that can search the web, summarize results, and send an email summary. Add a second agent that reviews the first agent's output.

**Checkpoint:** Can you design a multi-agent system for a specific use case? Can you implement tool authorization checks?

### Stage 6: RAG & Infrastructure (150 minutes)

**Goal:** Implement retrieval-augmented generation with production infrastructure.

| Topic | What to Learn | Time |
|-------|---------------|:----:|
| Chunking strategies | Fixed-size, semantic, recursive | 20 min |
| Embedding models | Text-embedding-3, voyage, BGE | 20 min |
| Vector databases | Pinecone, Weaviate, Qdrant, pgvector | 25 min |
| Retrieval strategies | Simple search, hybrid, reranking | 25 min |
| RAG evaluation | Faithfulness, answer relevancy, context precision | 20 min |
| Monitoring for RAG | Retrieval latency, relevance scores, fallbacks | 20 min |
| Scaling considerations | Indexing pipelines, caching, sharding | 20 min |

**Practice:** Build a RAG system that answers questions from a set of documents. Evaluate it using faithfulness and relevancy metrics.

**Checkpoint:** Can you explain different chunking strategies and when to use each? Can you evaluate a RAG system's retrieval quality?

### Stage 7: Safety & Ethics (90 minutes)

**Goal:** Defend against attacks and ensure responsible AI deployment.

| Topic | What to Learn | Time |
|-------|---------------|:----:|
| Threat model | Direct, indirect, agentic injection | 15 min |
| Defense layers | 6-layer framework, defense-in-depth | 20 min |
| System prompt hardening | Anti-injection patterns, instruction hierarchy | 15 min |
| Red teaming | garak, PyRIT, promptfoo | 20 min |
| Jailbreak testing | Categories, testing protocol | 10 min |
| Incident response | 6-step playbook | 10 min |

**Practice:** Run garak against a prompt you wrote. Try to jailbreak your own system. Implement the sandwich pattern for instruction hierarchy.

**Checkpoint:** Can you explain the three types of prompt injection? Can you implement a defense-in-depth strategy?

### Stage 8: Capstone Projects (~40 hours)

**Goal:** Build 4 production-grade systems demonstrating end-to-end mastery.

See [03-Capstone-Projects.md](03-Capstone-Projects.md) for detailed project descriptions.

---

## Career Timeline

### Junior Prompt Engineer (0-6 months)

| Aspect | Description |
|--------|-------------|
| **Skills** | Core prompting (COSTAR, RISEN), few-shot, CoT, basic evaluation |
| **Responsibilities** | Write prompts, run evaluations, document changes |
| **Tools** | Playgrounds, Git, basic Python scripting |
| **Outputs** | Single prompts, simple chains, eval reports |
| **Impact** | Improving existing prompts, measuring quality |

### Prompt Engineer / AI Engineer (6-18 months)

| Aspect | Description |
|--------|-------------|
| **Skills** | Advanced reasoning (ToT, ReAct), A/B testing, versioning, cost optimization |
| **Responsibilities** | Design prompt systems, manage evaluations, mentor juniors |
| **Tools** | Langfuse, DeepEval, CI/CD pipelines |
| **Outputs** | Multi-prompt systems, evaluation frameworks, monitoring dashboards |
| **Impact** | Own prompt quality and cost for a feature or product area |

### Senior Prompt Engineer / Lead (18-36 months)

| Aspect | Description |
|--------|-------------|
| **Skills** | Agent systems, RAG architecture, safety engineering, team leadership |
| **Responsibilities** | Design architecture, set standards, lead incidents, drive strategy |
| **Tools** | LangSmith, PyRIT, vector databases, MCP |
| **Outputs** | Agent frameworks, safety programs, team processes, architectural decisions |
| **Impact** | Cross-team influence, system-wide quality and safety ownership |

### Staff / Architect (36+ months)

| Aspect | Description |
|--------|-------------|
| **Skills** | System design, research translation, organizational strategy |
| **Responsibilities** | Define org-wide best practices, drive research adoption, mentor staff |
| **Tools** | Custom platforms, research prototype tools |
| **Outputs** | Engineering-wide standards, published research, platform decisions |
| **Impact** | Industry influence, org-wide AI quality, strategic direction |

### Salary Ranges (2026, approximate)

| Level | Range (USD) |
|-------|:-----------:|
| Junior (0-2 years) | $80K - $130K |
| Mid (2-5 years) | $130K - $190K |
| Senior (5-8 years) | $180K - $260K |
| Staff/Architect (8+ years) | $250K - $400K+ |

---

## Skill Progression Matrix

| Skill Domain | Stage 1-2 (Beginner) | Stage 3-4 (Intermediate) | Stage 5-6 (Advanced) | Stage 7-8 (Expert) |
|-------------|:-------------------:|:-----------------------:|:-------------------:|:-----------------:|
| **Prompt writing** | Basic structure, role, output format | COSTAR, RISEN, few-shot, constraints | Conditional logic, meta-prompting | Novel frameworks, research-backed techniques |
| **Reasoning techniques** | Zero-shot CoT | ToT, ReAct, self-consistency | Generated knowledge, contrastive CoT | Technique chaining, custom reasoning patterns |
| **Evaluation** | Manual review, eyeball test | Golden datasets, LLM-as-Judge | Wilcoxon, A/B testing, regression gates | Automated eval pipelines, meta-evaluation |
| **Versioning** | Save prompt files | Git + YAML, semantic versions | CI/CD integration, PR review process | Multi-environment, canary deployment |
| **Cost management** | Aware of pricing | Model routing, caching | Semantic caching, dynamic routing | Cost-quality optimization algorithms |
| **Agents** | Understand concept | Build simple ReAct agents | Multi-agent systems, MCP | Agent frameworks, orchestration patterns |
| **Safety** | Aware of injection | Implement basic defenses | Defense-in-depth, red teaming | Security program ownership |
| **RAG** | Understand concept | Build basic RAG pipeline | Advanced retrieval, reranking | RAG at scale, hybrid search |

---

## Learning Approach

### Weekly Learning Structure

```yaml
weekly_plan:
  total_time: 5-10 hours
  structure:
    - theory: 30% (reading, watching)
    - practice: 50% (writing prompts, building systems)
    - review: 20% (evaluating, documenting, reflecting)
```

### Recommended Learning Sequence

1. **Complete Stage 0-2** in week 1 (dedicated study)
2. **Spend week 2-3** on Stage 3 (reasoning techniques need practice)
3. **Week 4-5** on Stage 4 (production skills are foundational)
4. **Week 6-7** on Stage 5 (agents are the most in-demand skill)
5. **Week 8** on Stage 6 (RAG)
6. **Week 9** on Stage 7 (safety)
7. **Weeks 10-14** on Stage 8 (capstone projects)

### Daily Practice Ideas

| Time Available | Activity |
|:--------------:|----------|
| 15 min | Read one prompt technique, test it with a sample |
| 30 min | Write a prompt, run it 3 times with different settings, compare |
| 1 hour | Complete one stage module + practice exercise |
| 2 hours | Build a small system (agent, RAG, eval pipeline) |
| 4+ hours | Capstone project work |

### Measuring Progress

| Milestone | Evidence |
|-----------|----------|
| Stage 2 complete | Can write COSTAR prompts from scratch |
| Stage 3 complete | Can apply 5+ reasoning techniques to novel problems |
| Stage 4 complete | Has a Git repo with versioned prompts + eval suite |
| Stage 5 complete | Built a working agent with tool use |
| Stage 6 complete | Built a working RAG system with evaluation |
| Stage 7 complete | Can run red teaming tools and interpret results |
| Stage 8 complete | Published 4 capstone projects on GitHub |

---

> **Key takeaway:** This is a ~30-hour curriculum plus ~40 hours of projects. Move at your own pace — deeper understanding is more important than speed. The most valuable skill is not memorizing techniques, but knowing which technique to apply to which problem. Build projects that demonstrate real capability rather than just consuming content.
