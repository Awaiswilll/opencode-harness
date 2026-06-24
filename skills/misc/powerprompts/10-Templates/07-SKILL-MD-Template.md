# SKILL.md & AGENTS.md Templates

---

## Template A: SKILL.md

```markdown
---
name: skill-name
description: One-line description of what this skill does
version: 1.0.0
author: Your Name
tags:
  - tag1
  - tag2
  - tag3
---

# Skill: [Skill Name]

## Description

A comprehensive description of this skill — what problems it solves,
when to use it, and what makes it valuable.

## Prerequisites

- [Prerequisite 1]
- [Prerequisite 2]
- [Prerequisite 3]

## Usage

### Basic Usage

[Explain how to invoke the skill with a simple example]

### Advanced Usage

[More complex usage patterns]

## Instructions

### Step 1: [Step Name]

[Detailed instructions for step 1]

### Step 2: [Step Name]

[Detailed instructions for step 2]

### Step 3: [Step Name]

[Detailed instructions for step 3]

## Examples

### Example 1: [Title]

\`\`\`
Input:  [Sample input]
Output: [Expected output]
\`\`\`

### Example 2: [Title]

\`\`\`
Input:  [Sample input]
Output: [Expected output]
\`\`\`

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| param1 | string | "default" | Description |
| param2 | number | 42 | Description |

## Dependencies

- [Dependency 1] — [Purpose]
- [Dependency 2] — [Purpose]

## Troubleshooting

### Issue: [Common Problem]

**Solution:** [How to fix it]

### Issue: [Common Problem]

**Solution:** [How to fix it]

## See Also

- [Link to related skill]
- [Link to documentation]
```

---

## Template B: AGENTS.md

```markdown
# Agents Configuration

## Overview

This directory contains configuration and system prompts for the
AI agents used in this project. Each agent has a defined role,
capabilities, and boundary conditions.

---

## Agent: [Agent Name]

| Field | Value |
|-------|-------|
| **Role** | [Role description] |
| **Model** | [e.g., gpt-4o, claude-3-opus] |
| **Temperature** | [0.0–1.0] |
| **Max tokens** | [Number] |
| **System prompt** | [Link to prompt file] |

### Capabilities
- [Capability 1]
- [Capability 2]
- [Capability 3]

### Boundaries
- [Boundary 1]
- [Boundary 2]

### Available Tools
- [Tool 1]: [Description]
- [Tool 2]: [Description]

---

## Agent: [Agent Name]

| Field | Value |
|-------|-------|
| **Role** | [Role description] |
| **Model** | [e.g., gpt-4o, claude-3-opus] |
| **Temperature** | [0.0–1.0] |
| **Max tokens** | [Number] |
| **System prompt** | [Link to prompt file] |

### Capabilities
- [Capability 1]
- [Capability 2]

### Boundaries
- [Boundary 1]

### Available Tools
- [Tool 1]: [Description]

---

## Agent Hierarchy

```
User Request
    │
    ▼
┌──────────────┐
│  Orchestrator │────► Agent A ──► Agent B
└──────────────┘         │
                         ▼
                    Agent C
```

## Prompt Directory Structure

```
prompts/
├── system/           # System prompts (agent identities)
│   ├── orchestrator.md
│   ├── agent-a.md
│   └── agent-b.md
├── templates/        # Reusable prompt templates
│   └── *.md
├── golden/           # Golden dataset for evaluation
│   └── *.json
└── evaluations/      # Test results and evaluations
    └── *.md
```
```

---

## Common Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier |
| `description` | Yes | One-line summary |
| `version` | Recommended | Semver version |
| `author` | Optional | Creator name |
| `tags` | Recommended | Search keywords |
| `model` | Recommended | Target model |
| `temperature` | Optional | Default temperature |
| `max_tokens` | Optional | Output limit |

## Prompt File Structure Convention

```
File naming:       NN-name-with-hyphens.md
YAML frontmatter:  Always at the top (--- delimited)
Sections:          ## Heading (ATX-style)
Lists:             - with hyphens
Code:              ```language blocks
```

## Quick Start

1. Copy the SKILL.md template above
2. Fill in the YAML frontmatter
3. Write clear, numbered instructions
4. Add at least 2 examples
5. Document known issues in Troubleshooting
6. Copy the AGENTS.md template
7. List all agents with their prompts and tools
8. Commit both files to the project root
