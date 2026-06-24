# Courses and Resources

> A curated collection of free courses, paid programs, books, research papers, and official documentation for learning prompt engineering at every level.

---

## Table of Contents

1. [Free Courses](#free-courses)
2. [Structured Paid Programs](#structured-paid-programs)
3. [Books and Key Papers](#books-and-key-papers)
4. [Official Documentation](#official-documentation)
5. [GitHub Repos](#github-repos)
6. [Communities and Newsletters](#communities-and-newsletters)

---

## Free Courses

### Comprehensive Courses

| Course | Provider | Hours | Certificate | Description |
|--------|----------|:-----:|:-----------:|-------------|
| Learn Prompting (A-Z Guide) | learnprompting.org | ~20h | No | Most comprehensive free guide. Covers everything from basics to advanced techniques, images, and audio. Updated for 2026. |
| Complete Prompt Engineering Course | promptengineering.org | ~15h | Free tier + Paid | 15 sections from fundamentals to production. Free tier covers sections 01-10. |
| Prompt Engineering for Everyone | IBM / Cognitive Class | ~5h | Yes | IBM badge. Categorizes techniques into action, context, format, and persona categories. |
| Prompt Engineering Guide (Google) | Google / Google Cloud Skills Boost | ~4h | Yes | Official Google content. Covers Gemini-specific prompting and best practices. |
| Learn Prompting Basics | DeepLearning.AI (with OpenAI) | ~1.5h | No | Quick introduction by Isa Fulford (OpenAI) and Andrew Ng. Good starting point. |
| Introduction to Prompt Engineering | Codecademy | ~2h | Yes | Interactive course with hands-on exercises. |

### Short Tutorials and Guides

| Resource | Provider | Time | Best For |
|----------|----------|:----:|----------|
| The Art of ChatGPT Interactions | Dr Leo S Lo (CLEAR framework) | ~2h | Learning the CLEAR evaluation framework |
| Coursiv Prompt Engineering Cert | Coursiv | ~6h | Getting a quick certificate (34 lessons, 3 units) |
| Prompt Engineering for Developers | Maxim AI | ~4h | Developer-focused with production examples |
| ChatGPT Prompt Engineering for Developers | DeepLearning.AI (with OpenAI) | ~1.5h | Practical prompt patterns for developers |

### University Courses (Free Access)

| Course | Institution | Focus |
|--------|-------------|-------|
| CS 224N: Natural Language Processing | Stanford | Academic foundations of LLMs |
| CS 329T: Trustworthy Machine Learning | Stanford | Safety and reliability |
| MIT 6.S063: Full Stack LLM Development | MIT | Building applications with LLMs |

---

## Structured Paid Programs

### Certification Programs

| Program | Provider | Duration | Cost | Focus |
|---------|----------|:--------:|:----:|-------|
| AI Prompt Engineering Certification | Maxim AI / Coursiv | ~6h | Paid | Multi-model prompt engineering |
| Bootcamp (Mejba Ahmed) | Individual creator | 22 chapters, 221 lessons | Paid | GPT-5, Claude, Midjourney prompting |
| Prompt Engineering Professional Certificate | Various (Coursera) | ~30h | Subscription | Comprehensive with capstone |
| Certified AI Prompt Engineer | USAII | Self-paced | Paid | Formal certification with exam |

### Bootcamps and Workshops

| Program | Duration | Format | Focus |
|---------|:--------:|:------:|-------|
| Full Stack LLM Bootcamp | 8 weeks | Live online | Production LLM applications |
| AI Engineering Fellowship | 12 weeks | Part-time | Mentorship + project-based |
| Enterprise Prompt Engineering Workshop | 2 days | On-site or virtual | Team training for organizations |

### Comparing Free vs Paid

| Aspect | Free | Paid |
|--------|:----:|:----:|
| Depth | Good for fundamentals | Advanced topics, production patterns |
| Certification | Rare (IBM, Google offer some) | Yes, typically |
| Hands-on projects | Limited | Structured projects with feedback |
| Community access | Forum-based | Cohort-based, mentor access |
| Updated content | Variable | Usually maintained |
| Best for | Self-motivated learners, exploring the field | Career changers, team training, structured learning |

---

## Books and Key Papers

### Books

| Title | Author(s) | Year | Focus |
|-------|-----------|:----:|-------|
| The Prompt Report | Schulhoff et al. | 2024 | Comprehensive survey of prompt engineering (arXiv:2406.06608) |
| Systematic Survey of Prompt Engineering | Sahoo et al. | 2024 | Academic survey of techniques and taxonomies |
| A Comprehensive Taxonomy of Prompt Engineering | Frontiers of Computer Science | 2025 | Springer-published taxonomy of 30+ techniques |
| Prompt Engineering for LLMs | Various | 2025 | Production patterns and case studies |

### Key Research Papers

| Paper | Authors | Venue | Year | Contribution |
|-------|---------|-------|:----:|-------------|
| Chain-of-Thought Prompting Elicits Reasoning in LLMs | Wei et al. | NeurIPS | 2022 | Introduced CoT prompting |
| Tree of Thoughts: Deliberate Problem Solving | Yao et al. | NeurIPS | 2023 | Multi-path reasoning |
| ReAct: Synergizing Reasoning and Acting | Yao et al. | ICLR | 2023 | Reasoning + tool use |
| Self-Consistency Improves Chain of Thought Reasoning | Wang et al. | ICLR | 2023 | Majority voting over CoT paths |
| Least-to-Most Prompting | Zhou et al. | ICLR | 2023 | Decomposition strategy |
| Plan-and-Solve Prompting | Wang et al. | arXiv | 2023 | Zero-shot planning |
| Self-Refine: Iterative Refinement | Madaan et al. | NeurIPS | 2023 | Self-feedback loop |
| Generated Knowledge Prompting | Liu et al. | ACL | 2022 | Pre-generation of relevant knowledge |
| Step-Back Prompting | Google DeepMind | arXiv | 2023 | Abstraction-then-application |
| PEEM: Prompt Engineering Evaluation Metrics | arXiv | 2026 | Evaluation framework with 9 axes |

### Technical Reports

| Report | Organization | Description |
|--------|-------------|-------------|
| OWASP LLM Top 10 | OWASP | Security vulnerabilities in LLM applications |
| NIST AI Risk Management Framework | NIST | AI risk assessment and management guidelines |
| EU AI Act | European Commission | Regulatory framework for AI systems |
| ISO 42001 | ISO | AI management system standard |

---

## Official Documentation

| Provider | Resource | Link | Best For |
|----------|----------|------|----------|
| OpenAI | Prompt Engineering Guide | help.openai.com | GPT models, structured outputs, function calling |
| OpenAI | API Reference | platform.openai.com | Technical API usage |
| Anthropic | Prompt Engineering Docs | docs.anthropic.com | Claude models, XML tags, long context |
| Anthropic | System Prompt Guide | docs.anthropic.com | Production system prompt design |
| Google / Gemini | Prompting Guide | ai.google.dev | Gemini-specific techniques, multimodal |
| Google | Gemini API Documentation | ai.google.dev | API integration, safety settings |
| IBM | Prompt Engineering Guide | ibm.com/watsonx | Enterprise patterns, watsonx platform |
| DeepSeek | Documentation | platform.deepseek.com | Open-source model prompting |
| Meta / Llama | Prompting Guide | llama.meta.com | Self-hosting, open-source patterns |
| Microsoft | PyRIT Documentation | github.com/Azure/PyRIT | Red teaming tool |
| Microsoft | Guidance for Azure AI | learn.microsoft.com | Azure OpenAI integration |

### Documentation Reading Order

```yaml
beginner:
  - OpenAI Prompt Engineering Guide (overview)
  - Anthropic Prompt Engineering Docs (system prompts)
  - Google Prompting Guide (multimodal)

intermediate:
  - OpenAI API Reference (structured outputs)
  - Anthropic Tool Use Documentation
  - DeepLearning.AI Prompt Engineering Course

advanced:
  - OWASP LLM Top 10 (security)
  - NIST AI RMF (governance)
  - PyRIT / garak documentation (red teaming)
```

---

## GitHub Repos

### Curriculum Repositories

| Repo | Description | Stars | Best For |
|------|-------------|:-----:|----------|
| `GS-RUN/prompt-engineering-course` | 14-block academic course for engineers | High | Structured 30h curriculum |
| `kunalsuri/prompt-engineering-playbook` | 7-module curriculum with hands-on exercises | High | Practical, exercise-based learning |
| `fardinsabid/ai-prompt-engineer-roadmap` | 12-18 month learning plan | Medium | Career path guidance |
| `ckelseo/prompt-architect` | System prompt architecture patterns | Medium | Production architecture |

### Tool Repositories

| Repo | Description | Language |
|------|-------------|:--------:|
| `microsoft/pyrit` | Python Risk Identification Tool for red teaming | Python |
| `leondz/garak` | LLM vulnerability scanner | Python |
| `promptfoo/promptfoo` | Prompt testing and evaluation framework | TypeScript |
| `confident-ai/deepeval` | Evaluation framework with 14+ metrics | Python |
| `langfuse/langfuse` | Open-source observability and evaluation | TypeScript |
| `usnistgov/dioptra` | NIST AI risk testing platform | Python |

### Template Repositories

| Repo | Description |
|------|-------------|
| `openai/openai-cookbook` | Official OpenAI code examples and guides |
| `anthropics/anthropic-cookbook` | Official Anthropic code examples |
| `run-llama/llama_index` | RAG framework with prompt management |

---

## Communities and Newsletters

### Communities

| Community | Platform | Focus | Size |
|-----------|----------|-------|:----:|
| r/PromptEngineering | Reddit | General discussion, tips, sharing | Large |
| r/LocalLLaMA | Reddit | Open-source models, self-hosting | Large |
| AI Engineer Community | Discord | Production LLM engineering | Medium |
| LangChain Discord | Discord | Agent and chain development | Very Large |
| Anthropic Research Slack | Slack | Safety, alignment, advanced techniques | Invite-only |

### Newsletters

| Newsletter | Frequency | Focus |
|-----------|:---------:|-------|
| The Batch (Andrew Ng / DeepLearning.AI) | Weekly | AI news, courses, research summaries |
| Import AI (Jack Clark) | Monthly | AI progress, policy, safety |
| TLDR AI | Daily | Brief AI news summaries |
| Prompt Engineering Weekly | Weekly | Prompt techniques and case studies |
| AI Breakfast | Weekly | Curated AI resources and tools |
| The AI Engineer Newsletter | Weekly | Production AI engineering patterns |

### Following Researchers

| Researcher | Institution | Known For |
|------------|-------------|-----------|
| Andrew Ng | DeepLearning.AI | AI education, prompt engineering courses |
| Jason Wei | OpenAI | Chain-of-Thought prompting |
| Shunyu Yao | Princeton | Tree-of-Thoughts, ReAct |
| Denny Zhou | Google DeepMind | Step-Back, Plan-and-Solve |
| Mirac Suzgun | Stanford | Self-Consistency, prompt evaluation |
| Schulhoff et al. | Various | The Prompt Report survey |

---

## Quick Reference: Best Resource by Goal

| If you want to... | Start here... |
|-------------------|---------------|
| Get started quickly | learnprompting.org (free) |
| Get a certificate | IBM Prompt Engineering (free cert) |
| Learn production patterns | Production sections of this compendium |
| Understand the theory | The Prompt Report (arXiv survey) |
| Build a RAG system | LlamaIndex documentation |
| Red team your prompts | PyRIT or garak (GitHub) |
| Evaluate your prompts | DeepEval (GitHub) |
| Version your prompts | Langfuse (open source) |
| Stay updated | The Batch newsletter (DeepLearning.AI) |

---

> **Key takeaway:** Start with free courses (learnprompting.org, IBM, DeepLearning.AI) and official documentation. Supplement with research papers for deeper understanding. Use GitHub tools (DeepEval, PyRIT, promptfoo) for hands-on practice. Stay updated via newsletters and community forums — the field evolves monthly.
