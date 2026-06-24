# Memory-Augmented Prompting

> A comprehensive reference on incorporating external, persistent, and dynamic memory into prompt construction — covering episodic, semantic, and procedural memory, RAG-enhanced prompts, conversation management, and memory consolidation patterns.

---

## Table of Contents

1. [What Is Memory-Augmented Prompting](#1-what-is-memory-augmented-prompting)
2. [Three-Layer Memory Architecture](#2-three-layer-memory-architecture)
3. [RAG-Enhanced Prompts](#3-rag-enhanced-prompts)
4. [Conversation Memory Management](#4-conversation-memory-management)
5. [Memory Consolidation and Forgetting](#5-memory-consolidation-and-forgetting)
6. [Memory-Augmented Agent Patterns](#6-memory-augmented-agent-patterns)
7. [Prompt Templates for Memory Systems](#7-prompt-templates-for-memory-systems)
8. [Best Practices](#8-best-practices)
9. [Resources](#9-resources)

---

## 1. What Is Memory-Augmented Prompting

### Definition

**Memory-augmented prompting** incorporates external, persistent, or dynamic memory modules into prompt construction. It extends beyond static context windows by leveraging structured memory stores — episodic, semantic, and procedural — to improve sample efficiency, generalization, and personalization.

### The Problem It Solves

LLMs have a fundamental limitation: they don't remember past interactions by default. Each call is independent. Memory-augmented prompting solves:

| Problem | Without Memory | With Memory |
|---|---|---|
| Forgetting user preferences | User must re-state preferences every session | Preferences retrieved automatically |
| Losing conversation context | Context window fills; old turns drop | Summarized memory preserves key details |
| No personalization | Same response for all users | Tailored based on history |
| Repetitive information | User re-explains known context | System recalls from memory |
| Knowledge staleness | Only training data knowledge | RAG injects current information |

### Memory vs. Context Window

| Aspect | Context Window | Memory System |
|---|---|---|
| Capacity | Fixed limit (4K-200K tokens) | Virtually unlimited (database-backed) |
| Persistence | Ephemeral (per-session) | Persistent (across sessions) |
| Retrieval | Sequential (all tokens seen) | Selective (relevant chunks only) |
| Cost | Scales with total tokens | Scales with retrieval volume |
| Granularity | Everything or nothing | Structured: facts, summaries, preferences |

---

## 2. Three-Layer Memory Architecture

### Overview

The three-layer memory architecture is inspired by cognitive science — how humans store and retrieve different types of information.

`
+-------------------------------------------------+
|              PROCEDURAL MEMORY                    |
|  How to perform tasks (workflows, patterns)       |
|  "How to write a PRD" "How to review code"        |
+-------------------------------------------------+
|               SEMANTIC MEMORY                     |
|  Long-term knowledge (facts, preferences)         |
|  "User prefers Python" "Project uses React"       |
+-------------------------------------------------+
|               EPISODIC MEMORY                     |
|  Session-specific interactions (recent turns)     |
|  "In the last turn, user asked about X"           |
+-------------------------------------------------+
`

### 2.1 Episodic Memory

**What it is:** Session-specific interactions — recent conversation turns, what was discussed in the current session.

**Characteristics:**
- Short-lived (relevant for current session only)
- High detail (actual conversation turns, not summaries)
- Temporal ordering matters (what happened when)
- Limited capacity (typically last 10-20 turns)

**Implementation:**
`python
episodic_memory = {
    "recent_turns": [
        {"role": "user", "content": "What's the weather?", "timestamp": "..."},
        {"role": "assistant", "content": "It's sunny", "timestamp": "..."},
    ],
    "current_session_id": "session_123",
    "max_turns": 20
}
`

**Prompt injection pattern:**
`
Recent conversation history (most recent first):
{turns}

Use this history to maintain context and coherence.
Reference earlier parts of the conversation when relevant.
`

### 2.2 Semantic Memory

**What it is:** Long-term knowledge — user preferences, domain facts, project context, personal information.

**Characteristics:**
- Long-lived (persists across sessions)
- Abstracted (summaries and key facts, not raw interactions)
- Structured (key-value pairs, knowledge graph entries)
- Updateable (new information can modify existing knowledge)

**Examples:**
- User's name and preferences
- Project context: technology stack, architecture decisions
- User's demonstrated skill level in various domains
- Frequently referenced information or past questions

**Prompt injection pattern:**
`
<User Profile>
{user_preferences_and_facts}
</User Profile>

<Project Context>
{project_information}
</Project Context>

Use this information to personalize your responses.
`

### 2.3 Procedural Memory

**What it is:** How to perform tasks — workflows, patterns, standard operating procedures.

**Characteristics:**
- Stable (changes slowly, if at all)
- Instruction-focused (step-by-step procedures)
- Reusable (same procedure applies across contexts)
- Often skill-based (AGENTS.md, SKILL.md files)

**Examples:**
- Code review checklist
- Report writing template
- Bug triage workflow
- Deployment procedure

**Prompt injection pattern:**
`
You have access to the following procedures:

<procedure name="code_review">
1. Check for correctness
2. Check for security issues
3. Check for style compliance
4. Verify test coverage
</procedure>

Apply the relevant procedure when the task matches.
`

---

## 3. RAG-Enhanced Prompts

### What Is RAG

**Retrieval-Augmented Generation (RAG)** retrieves relevant documents or passages from a knowledge base and injects them into the prompt as context. This grounds the model's response in factual, up-to-date information.

### RAG-Enhanced Prompt Structure

`
System: You are an assistant with access to a knowledge base.
Answer using the provided context. If the context doesn't contain
the answer, say so. Cite sources using [doc_number].

Context from knowledge base:
{retrieved_documents}

User question: {query}
`

### RAG Execution Flow

`
1. User sends query
2. Retrieve relevant chunks from vector database
   (embed query -> similarity search -> top-k chunks)
3. Build prompt: System instruction + retrieved chunks + query
4. LLM generates response grounded in retrieved context
5. (Optional) Post-processing: citation formatting, fact-checking
`

### Chunking Strategies

| Strategy | Description | Best For |
|---|---|---|
| Fixed size | Split docs into equal-sized chunks (e.g., 500 tokens) | Simple documents |
| Semantic | Split at natural boundaries (paragraphs, sections) | Structured documents |
| Overlapping | Chunks with overlap (e.g., 500 tokens, 100 overlap) | Maintaining context across boundaries |
| Hierarchical | Document -> sections -> paragraphs | Long documents with structure |

### Retrieval Quality Tips

- 5 highly relevant chunks beat 50 loosely related ones
- Diverse retrieval: mix of close semantic matches and broader topical coverage
- Hybrid search: combine semantic (embeddings) + keyword (BM25) for best results
- Re-ranking: retrieve more than needed (e.g., 20 chunks), then re-rank to top 5

### RAG Prompt Variations

**Standard RAG:**
`
Context: {chunks}
Query: {query}
Answer based on the context above.
`

**RAG with citation:**
`
Context:
[1] {chunk_1}
[2] {chunk_2}
[3] {chunk_3}

Query: {query}

Answer using the context. Cite sources: [1], [2], etc.
If no relevant context, say "I don't have information about this."
`

**RAG with multi-hop reasoning:**
`
Context: {chunks}
Query: {query}

This question may require combining information from multiple sources.
If so, explain how you connected the information.
`

**RAG with source filtering:**
`
Context: {chunks}
Query: {query}

Prioritize information from:
1. Official documentation (highest priority)
2. Peer-reviewed papers
3. Reputable industry sources
4. Other sources (lowest priority)

Indicate source priority in your response.
`

---

## 4. Conversation Memory Management

### Challenges in Conversation Memory

| Challenge | Description | Solution |
|---|---|---|
| Context window limit | Only so many tokens fit | Summarization + sliding window |
| Lost-in-the-middle | Model ignores middle of context | Put key info at start/end |
| Token cost | More history = more tokens | Selective retention |
| Irrelevant history | Not all past turns matter | Relevance filtering |

### Sliding Window Strategy

Keep the last N raw turns; summarize everything older.

`
[CONVERSATION SUMMARY (500 tokens)]
Summary of earlier conversation: {summary}

[RECENT HISTORY (last 10 turns)]
{recent_turns}

[CURRENT QUERY]
{query}
`

### Summarization Strategy

Every M turns, summarize the conversation so far.

`
## Conversation Summary (updated every 10 turns)

Session start: {timestamp}
Key topics discussed: [list]
User preferences observed: [list]
Decisions made: [list]
Pending questions: [list]
Unresolved issues: [list]

Token budget: Keep this under 500 tokens.
`

### Hierarchical Memory Strategy

Multiple levels of detail for different needs.

`
Level 1 (Always in context):
  - User name, preferences (50 tokens)
  - Current task context (100 tokens)

Level 2 (Recent turns):
  - Last 10 conversation turns (2000 tokens)

Level 3 (Summarized history):
  - Compressed summary of earlier conversations (500 tokens)

Level 4 (On-demand retrieval):
  - Full details available via database query if needed
`

### Memory Retrieval Prompt

`
You have access to the user's conversation history.
Retrieve relevant memories based on the current query.

Current query: {query}

Relevant past interactions:
{retrieved_memories}

Use these to:
- Avoid asking for information already provided
- Reference past discussions when relevant
- Maintain consistency with previous decisions
- Personalize based on established preferences
`

---

## 5. Memory Consolidation and Forgetting

### Why Consolidation and Forgetting Matter

- **Token efficiency**: You can't (and shouldn't) keep everything
- **Relevance**: Old information may become irrelevant or incorrect
- **Cost**: More tokens = more money
- **Quality**: Too much context degrades model performance

### Memory Consolidation

Convert detailed episodic memories into abstracted semantic memories.

`
Raw episodic memory:
User asked: "How do I implement OAuth in Express?"
Assistant answered with: Step-by-step OAuth implementation guide
User said: "Thanks, that worked"

Consolidated semantic memory:
User has implemented OAuth in Express (completed)
User's skill level: Intermediate-advanced backend developer
User prefers step-by-step guides with code examples
`

**Consolidation prompt:**
`
You are a memory consolidation system. Review these recent interactions:

{recent_interactions}

Extract key information to remember:
1. User preferences (tone, detail level, format)
2. User's demonstrated knowledge/experience
3. Facts about the user's projects or context
4. Decisions or agreements made
5. Topics to follow up on

Output as structured JSON:
{
  "preferences": [...],
  "knowledge_level": "...",
  "project_context": {...},
  "decisions": [...],
  "follow_ups": [...]
}
`

### Forgetting Mechanisms

**Time-based forgetting:**
`
Memories older than {N} days are deprioritized.
If a memory hasn't been accessed in {N} days,
it is archived and only retrieved on explicit request.
`

**Relevance-based forgetting:**
`
When the context window is full, discard:
1. Lowest relevance memories (based on similarity to current query)
2. Oldest memories (not accessed recently)
3. Least important memories (low priority ratings)
`

**Confirmation-based forgetting:**
`
If a memory is contradicted by new information:
1. Flag the contradiction
2. Keep both with timestamps
3. If the new information is confirmed, deprecate the old memory
`

### Decay Schedules

Adaptive RAG Memory (ARM) uses dynamic embedding layers with decay schedules:

`
Memory importance score =
  initial_importance x decay_factor^(days_since_access)

Where decay_factor = 0.9 (memories lose 10% importance per day)

Memories below importance threshold = 0.3 are archived.
Archived memories are not injected into prompts but remain retrievable.
`

---

## 6. Memory-Augmented Agent Patterns

### Pattern 1: Memory-Enhanced Research Agent

`
You are a research agent with memory capabilities.

## Memory Store
You have access to:
1. Past research results (avoid re-searching the same topic)
2. User's research interests and preferences
3. Previously used sources and their reliability ratings

## On Each Research Request
1. Check memory: Have I researched this before?
2. If yes: Retrieve past findings and update with new information
3. If no: Conduct fresh research
4. Store: Save new findings to memory
5. Update: Record source reliability based on this experience
`

### Pattern 2: Personalized Assistant with Long-Term Memory

`
You are a personal AI assistant with persistent memory.

## You Remember
- User's name, preferences, and context
- Past conversations and their outcomes
- User's goals and progress toward them
- Frequently referenced information

## Memory Protocol
1. Before responding, retrieve relevant memories
2. Use memories to personalize your response
3. After responding, update memory with new information
4. Periodically consolidate old memories

## Example
User: "Can you explain this concept again?"
Memory: User has asked about this topic 3 times before.
Their demonstrated knowledge level is intermediate.
-> Adjust explanation depth accordingly.
`

### Pattern 3: Memory-Augmented Code Assistant

`
You are a code assistant that remembers project context.

## Project Memory
- Codebase structure and conventions
- Recently modified files and their purpose
- Known bugs and their status
- User's coding style preferences
- Previous solutions and their outcomes

## On Each Request
1. Retrieve relevant project context
2. Consider past approaches that worked/didn't work
3. Provide context-aware assistance
4. Update project memory with changes made
`

### Pattern 4: RAG-Enhanced Customer Support Agent

`
You are a customer support agent with a knowledge base.

## Knowledge Base
- Product documentation (retrieved via RAG)
- Past customer interactions (for continuity)
- Known issues and workarounds
- Escalation history

## Support Protocol
1. Retrieve relevant documentation for the issue
2. Check if customer has contacted before (context)
3. Provide solution grounded in documentation
4. If issue repeats from past, acknowledge and reference history
5. Update knowledge base with new solution if applicable
`

---

## 7. Prompt Templates for Memory Systems

### Basic Memory-Augmented System Prompt

`
You are an AI assistant with memory capabilities.

## Available Memory Types
1. {memory_type_1}: {description}
2. {memory_type_2}: {description}
3. {memory_type_3}: {description}

## Memory-Aware Behavior
- Before responding, check if you have relevant memories
- Use memories to personalize your response
- Acknowledge past interactions when relevant
- Update memories with new information from each interaction
- If you lack information, say so rather than fabricating

## Current Context
{retrieved_memories}

User: {query}
`

### Memory Retrieval Prompt Template

`
You have a memory store. For each user interaction:

1. RETRIEVE: Search memory for:
   - User's preferences and past behavior
   - Relevant facts from previous conversations
   - Context about the current topic

2. RESPOND: Use retrieved memories to:
   - Personalize your response
   - Reference past discussions
   - Maintain consistency
   - Avoid asking for known information

3. UPDATE: After responding, store new information:
   - New facts about the user
   - New preferences expressed
   - Important context from this interaction

Current retrieved memories:
{memories}

User: {query}
`

### Memory Update Prompt Template

`
Review the following interaction and extract information to remember:

User: {user_message}
Assistant: {assistant_response}

Extract:
1. New facts about the user (preferences, context, knowledge)
2. Decisions or agreements made
3. Topics for follow-up
4. Corrections to previously stored information

Output format:
{
  "facts_to_store": [...],
  "preferences_to_update": {...},
  "follow_up_topics": [...],
  "corrections": [...]
}
`

### RAG-Enhanced Prompt with Memory

`
## Knowledge Base Context
{retrieved_documents}

## Conversation History
{relevant_past_interactions}

## User Context
{user_preferences_and_profile}

## Current Query
{query}

## Instructions
- Answer using the knowledge base context when relevant
- Consider conversation history for continuity
- Personalize based on user context
- Cite sources: [doc_number]
- If the knowledge base doesn't contain the answer, say so
- Do not fabricate information
`

---

## 8. Best Practices

### Retrieval Quality

- **Retrieval quality > context quantity**: 5 highly relevant chunks beat 50 loosely related ones
- **Use hybrid search**: Combine semantic (embedding similarity) with keyword (BM25) for best coverage
- **Re-rank results**: Retrieve more than needed, then re-rank to ensure only the best chunks are injected
- **Diverse retrieval**: Ensure retrieved chunks cover different aspects of the query, not redundant views

### Memory Architecture

- **Three layers are minimum**: Episodic (session), semantic (user), procedural (skills)
- **Consolidate regularly**: Convert raw episodic memories into abstracted semantic memories at fixed intervals
- **Forget strategically**: Not all information deserves to be remembered forever
- **Version memories**: Track when information was stored and when it was last confirmed

### Token Management

- **Summarize aggressively**: Conversation summaries should be 10-20% of the original token count
- **Prioritize recent information**: Recent turns are more likely to be relevant than old ones
- **Budget per layer**: Allocate token budgets for each memory layer (e.g., 500 for semantic, 2000 for episodic)
- **Cache frequent retrievals**: If the same information is retrieved often, keep it in context

### Production Considerations

- **Monitor memory retrieval quality**: Track whether retrieved memories improve response quality
- **Handle memory conflicts**: When new information contradicts old memories, have a resolution strategy
- **User control over memory**: Let users view, edit, and delete stored memories
- **Privacy and security**: Treat user memories as sensitive data — encrypt, isolate, and limit access
- **Test memory-augmented vs. baseline**: Measure whether memory actually improves outcomes

### Common Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Memory overload | Context window fills with memories | Summarize and prioritize aggressively |
| Stale memories | Agent uses outdated information | Implement decay schedules |
| Irrelevant retrieval | Retrieved chunks don't help | Improve retrieval quality (hybrid search, re-ranking) |
| Privacy leaks | One user's memories seen by another | Isolate memory stores per user |
| No forgetting | Memory store grows unbounded | Implement archiving and deletion policies |
| Over-personalization | Agent makes incorrect assumptions | Let users correct stored information |

---

## 9. Resources

### Papers
- Qian et al.: "MemoRAG: Global Memory-Enhanced Retrieval Augmentation" (theWebConf 2025)
- Lewis et al.: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020)
- Borgeaud et al.: "Improving Language Models by Retrieving from Trillions of Tokens" (2022)

### Tools and Frameworks
- Mem0: Persistent memory layer for LLMs
- MemoRAG: Dual-system architecture with global memory for long-context processing
- LangChain: Memory modules for conversation and document retrieval
- LLMLingua: Prompt compression for memory-efficient prompting

### Official Documentation
- OpenAI: "Memory" in Assistants API
- Anthropic: Context window management guidance
- Google: "Memory in AI Systems" documentation

### Guides and Articles
- Unstructured + Mem0: "Adding a Memory Layer to RAG" (2026)
- emergentmind.com: "Memory-Augmented Prompting" topic overview
- Meta Intelligence: "Context Engineering Guide: RAG and Memory Systems" (2026)

### Related Topics in This Knowledge Base
- **Section 04** — Tool-Use Prompting (tools for memory retrieval)
- **Section 09** — Prompt Chaining (pipeline patterns for memory workflows)
- **Section 15** — Context Window Management (strategies for fitting memory into context)
