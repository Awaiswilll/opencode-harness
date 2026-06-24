# Output Formats

> A practical guide to controlling LLM output structure — from plain text to JSON schemas, XML, markdown, code, tables, and lists.

---

## Table of Contents

1. [Why Output Format Matters](#why-output-format-matters)
2. [Plain Text vs Structured Output](#plain-text-vs-structured-output)
3. [JSON Schema Prompting](#json-schema-prompting)
4. [XML and Markdown Responses](#xml-and-markdown-responses)
5. [Code Generation Patterns](#code-generation-patterns)
6. [Table and List Formatting](#table-and-list-formatting)
7. [Multi-Format Decision Guide](#multi-format-decision-guide)

---

## Why Output Format Matters

The format of an LLM's output determines whether it can be reliably used in downstream systems. Without explicit format instructions:

- **Machine parsing fails** — JSON is malformed, missing keys, extra fields
- **Human reading suffers** — inconsistent structure, buried key information
- **Downstream automation breaks** — pipelines, dashboards, integrations

**The failure rate of unstructured output:**

| Format Attempt | Failure Rate | Consequence |
|----------------|-------------|-------------|
| "Respond in JSON" (no schema) | 8-15% | Parsing errors in production |
| JSON with schema in prompt | 2-5% | Manual cleanup needed |
| Native structured output API | <0.3% | Production-reliable |
| Schema + API enforcement + validate | <0.05% | Enterprise-grade |

### Cost of Format Errors

| Scenario | Cost of Error |
|----------|---------------|
| Chat application | User annoyance (low) |
| Data extraction pipeline | Reprocessing, delays (medium) |
| Automated decision system | Wrong decisions (high) |
| Regulatory/Compliance | Legal exposure (critical) |

### Format Reliability Hierarchy

```
Level 5: API-enforced schema + validation + retry
Level 4: API-enforced schema (response_format / tool_use)
Level 3: Schema in prompt + validation + retry
Level 2: Format description + examples in prompt
Level 1: "Respond in [format]" — no schema, no examples
Level 0: No format instruction at all
```

**Rule:** For production, never go below Level 3. For critical systems, use Level 4 or 5.

---

## Plain Text vs Structured Output

### Plain Text

**When to use:**
- Chat and conversational applications
- Open-ended Q&A where structure doesn't matter
- Human reading only (no downstream parsing)
- Creative writing, storytelling

**How to specify:**

```
Respond in plain text — no markdown, no formatting, no bullet points.
Just natural language paragraphs.
```

**Risks:**
- Inconsistent structure across responses
- Hard to extract specific information programmatically
- May include unwanted formatting (headers, bold, lists) despite instructions

**Plain text is acceptable when:**
- The response is consumed directly by a human
- No automated processing is required
- Consistency is nice-to-have, not need-to-have

### Structured Output

**When to use:**
- Data extraction and transformation
- API integration (LLM output feeds another system)
- Database storage and querying
- Automated reporting and dashboards
- Any machine-readable pipeline

**Benefits of structured output:**
- Deterministic parsing (key always exists)
- Schema validation catches errors
- Automated retry on format failure
- Clear contract between LLM and consuming system

**Cost:**
- Additional tokens for schema/examples (30-300 tokens)
- Slightly higher latency (model spends tokens planning structure)
- Requires more careful prompt design

### The Hybrid Approach

For maximum flexibility, use a structured wrapper with unstructured content:

```json
{
  "summary": "Plain text summary of findings...",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "confidence": "high",
  "needs_follow_up": false
}
```

This gives downstream systems the structured fields they need while allowing natural language where it adds value.

---

## JSON Schema Prompting

### The Problem

Without enforcement, LLMs produce malformed JSON:

```json
// Missing quotes
{name: "John", age: 30}
// Trailing comma
{"name": "John", "age": 30,}
// Extra keys
{"name": "John", "age": 30, "unexpected": "field"}
// Wrong types
{"name": "John", "age": "thirty"}
// Missing fields
{"name": "John"}
```

### Level 1: Prompt Only

```
Respond with JSON:
{
  "name": string,
  "age": number,
  "city": string
}
```

**Failure rate:** 8-15% — unreliable for production.

### Level 2: Prompt + Example

```
Extract the person's details and return as JSON.

Example:
Input: "Jane is 25 and lives in London"
Output: {"name": "Jane", "age": 25, "city": "London"}

Input: "{user_input}"
Output:
```

**Failure rate:** 2-5% — better but still needs validation.

### Level 3: Prompt + Example + Schema

```
You are a JSON extraction API. Respond ONLY with valid JSON
matching this schema. Never include explanation, markdown,
or anything outside the JSON object.

Schema:
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "description": "Full name of the person" },
    "age": { "type": "integer", "description": "Age in years" },
    "city": { "type": "string", "description": "City of residence" }
  },
  "required": ["name", "age", "city"]
}
```

**Failure rate:** 2-4% with prompt-only; <0.3% with API enforcement.

### Level 4: Native Structured Output API

```python
# OpenAI Structured Outputs
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5.5",
    input="Extract: John is 30 and lives in NYC",
    text={
        "format": {
            "type": "json_schema",
            "name": "person",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "integer"},
                    "city": {"type": "string"}
                },
                "required": ["name", "age", "city"]
            }
        }
    }
)
```

```python
# Anthropic Tool Use for structured extraction
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=[
        {
            "name": "extract_person",
            "description": "Extract person details",
            "input_schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "integer"},
                    "city": {"type": "string"}
                },
                "required": ["name", "age", "city"]
            }
        }
    ],
    messages=[{"role": "user", "content": "Extract: John is 30 and lives in NYC"}]
)
```

**Failure rate:** <0.3% — production-reliable.

### Level 5: Layered Defense

Production strategy with multiple fallbacks:

```
1. Native structured output API (response_format or tool_use)
2. Schema-in-prompt with worked example (backup)
3. validate-and-retry: catch parse errors, request regeneration
4. Parse with lenient parser (regex extract JSON from markdown)
5. Log all failures for prompt improvement

Validation step in code:

import json
import re
from jsonschema import validate, ValidationError

def parse_llm_json(response_text, schema):
    if not response_text.strip():
        return None
    try:
        data = json.loads(response_text)
        validate(instance=data, schema=schema)
        return data
    except (json.JSONDecodeError, ValidationError):
        # Try to extract JSON from markdown
        match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```',
                          response_text, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group(1))
                validate(instance=data, schema=schema)
                return data
            except (json.JSONDecodeError, ValidationError):
                pass
        return None
```

### JSON Schema Design Best Practices

| Practice | Why | Example |
|----------|-----|---------|
| Field descriptions improve accuracy | Model understands extraction intent | `"age": { "type": "integer", "description": "Age in whole years" }` |
| Required fields prevent missing data | Model knows which fields are mandatory | `"required": ["name", "age"]` |
| Enums constrain values | Prevents unexpected categories | `"severity": { "type": "string", "enum": ["low", "medium", "high"] }` |
| Nested objects mirror data structure | Complex extractions | `"address": { "type": "object", "properties": {...} }` |
| Arrays for multiple items | Lists of extracted entities | `"items": { "type": "array", "items": { "type": "string" } }` |

### Common JSON Schema Pitfalls

| Pitfall | Problem | Fix |
|---------|---------|-----|
| Too many fields | Model starts omitting fields | Keep to 5-10 required fields |
| Nested depth > 3 | Model produces malformed nesting | Flatten or use simpler structure |
| Ambiguous descriptions | Wrong extraction | Explicit: "Full name including middle initial" |
| Missing enum fallback | Unexpected values crash pipeline | Always include an "other" or "unknown" enum option |
| OneOf / AnyOf | Most models handle these poorly | Use simpler patterns |

---

## XML and Markdown Responses

### XML Responses

XML is particularly well-suited for LLM output because:
- Claude models natively understand XML structure
- XML tags provide clear element boundaries
- Nested XML mirrors complex data relationships
- XML is self-describing (tags reveal meaning)

**Basic XML prompt:**

```
Return your analysis in the following XML format:

<analysis>
  <summary>A brief overview of findings</summary>
  <findings>
    <finding severity="critical">Description of critical finding</finding>
    <finding severity="high">Description of high severity finding</finding>
  </findings>
  <recommendations>
    <recommendation priority="1">First thing to fix</recommendation>
  </recommendations>
</analysis>
```

**Advanced XML with attributes and nesting:**

```
<code_review>
  <file path="src/auth.py">
    <issues>
      <issue line="42" severity="critical">
        <type>SQL Injection</type>
        <description>User input directly concatenated into SQL query</description>
        <fix>Use parameterized queries instead of string interpolation</fix>
        <code_snippet>
          # Bad:
          cursor.execute(f"SELECT * FROM users WHERE id = {user_input}")
          # Good:
          cursor.execute("SELECT * FROM users WHERE id = ?", (user_input,))
        </code_snippet>
      </issue>
    </issues>
  </file>
  <summary>
    <total_issues>1</total_issues>
    <critical>1</critical>
    <high>0</high>
    <medium>0</medium>
    <low>0</low>
  </summary>
</code_review>
```

**XML response best practices:**

1. **Always provide the exact XML structure** in the prompt
2. **Show attributes inline** — `<finding severity="critical">` not `severity: critical`
3. **Close all tags** — unclosed tags cause parsing failures
4. **Use CDATA for code snippets** — avoids XML entity escaping issues
5. **Keep nesting under 4 levels** — deeper nesting confuses the model
6. **Validate XML after generation** — libraries like `xml.etree.ElementTree` can catch errors

### Markdown Responses

Markdown is ideal for human-readable output that still has structure.

**Markdown prompt:**

```
Respond with markdown using this structure:

## Summary
[2-3 sentence overview]

## Key Findings
- **[Finding 1]**: [Brief explanation]
- **[Finding 2]**: [Brief explanation]

## Recommendations
1. **[Action 1]** — [Expected impact]
2. **[Action 2]** — [Expected impact]

## Details
> Additional context or caveats if needed
```

**Markdown features that work well with LLMs:**

| Feature | Example | LLM Reliability |
|---------|---------|-----------------|
| Headers | `# H1`, `## H2` | Very high |
| Bold | `**text**` | Very high |
| Italic | `*text*` | Very high |
| Bullet lists | `- item` | Very high |
| Numbered lists | `1. item` | Very high |
| Code blocks | ` ``` ` | Very high |
| Blockquotes | `> text` | High |
| Tables | `\| col \| col \|` | Moderate |
| Links | `[text](url)` | Moderate |
| Images | `![alt](url)` | Low |
| Task lists | `- [ ] task` | Low |
| Footnotes | `[^1]` | Low |

**Markdown best practices:**

1. **Specify exact heading levels** — "Use ## for section headers, not #"
2. **Show the template** — include an example of the markdown structure
3. **Request code block language tags** — ` ```python ` not just ` ``` `
4. **Avoid complex nested lists** — models struggle with multi-level indentation
5. **Consider whether you need markdown** — if only one feature (e.g., bullet list), a simple format may suffice

### XML vs Markdown: Selection Guide

| Aspect | XML | Markdown |
|--------|-----|----------|
| Best for | Structured data, machine parsing | Human readability, documentation |
| Claude compatibility | Excellent | Good |
| GPT/Gemini compatibility | Good | Excellent |
| Token efficiency | Lower (verbose tags) | Higher (compact syntax) |
| Nesting support | Excellent (native) | Limited (via indentation) |
| Validation | Schema validation possible | No formal validation |
| Parsing complexity | Low | Medium |
| Human readability | Low (verbose) | High (clean rendering) |

---

## Code Generation Patterns

### Basic Code Response

```
Generate Python code to solve this problem:

Problem: Write a function that finds all prime numbers up to N.

Return ONLY the code, no explanation, no markdown formatting.
```

**Issue:** Without constraints, the model may add explanations, comments, or markdown.

### Controlled Code Generation

```
You are a code generator. Follow these rules:

1. Return ONLY executable code — no explanation, no markdown
2. Include necessary imports at the top
3. Use Python 3.11+ syntax
4. Add type hints to all functions
5. Include a `if __name__ == "__main__":` block with usage example

Task:
[code task description]
```

### Multi-File Code Response

For complex tasks, structured output helps:

```
Return code as JSON with file paths as keys:

{
  "src/main.py": "contents of main.py",
  "src/utils.py": "contents of utils.py",
  "tests/test_main.py": "contents of tests"
}

Code specifications:
- Python 3.11, type hints, pytest for testing
- No external dependencies beyond standard library
```

### Code Review Output

```
Review the following code. Return your findings as:

[
  {
    "file": "path/to/file.py",
    "line": 42,
    "severity": "error" | "warning" | "suggestion",
    "category": "security" | "performance" | "style" | "correctness",
    "message": "Description of the issue",
    "suggestion": "How to fix it"
  }
]
```

### Code Generation Prompt Template

```
Task: [clear description of what the code should do]

Requirements:
- Language: [language]
- Environment: [runtime, version constraints]
- Dependencies: [allowed packages, none if standard library]
- Style: [naming conventions, patterns to follow]
- Testing: [test framework, coverage requirements]

Output format:
[```lang
code block with no explanation

or

JSON with file paths as keys]
```

### Language-Specific Patterns

| Language | Prompt Addition |
|----------|----------------|
| Python | "Use type hints, follow PEP 8, use snake_case" |
| JavaScript | "Use const/let, arrow functions, ES2022+" |
| TypeScript | "Use strict mode, explicit types, no `any`" |
| Rust | "Use 2021 edition, clippy-clean, handle all errors" |
| Go | "Use gofmt style, handle errors explicitly" |
| SQL | "Use CTEs for complex queries, parameterize all values" |

---

## Table and List Formatting

### Markdown Tables

Tables are useful for comparative or tabular data but have moderate LLM reliability.

```
Format the results as a markdown table:

| Product | Price | Rating | In Stock |
|---------|-------|--------|----------|
| [name] | [price] | [rating] | [yes/no] |
| [name] | [price] | [rating] | [yes/no] |
```

**Prompt tips for reliable tables:**

1. **Provide the exact header row and separator line**
2. **Show 1-2 example rows** in the prompt
3. **Request a specific number of rows** — "Generate exactly 5 rows"
4. **Avoid merged cells** — models don't handle colspan/rowspan
5. **Keep columns under 6** — more columns = more alignment errors

### Alternative: JSON-based Tables

For production, generate tables as JSON first, then convert to display format:

```json
{
  "columns": ["Product", "Price", "Rating", "In Stock"],
  "rows": [
    ["Widget A", "$19.99", 4.5, true],
    ["Widget B", "$29.99", 3.8, false]
  ]
}
```

This is more reliable than prompting for markdown tables directly. The JSON can be rendered as a table in the UI.

### CSV Output

For data export and spreadsheet compatibility:

```
Return the data in CSV format with headers.
Use commas as delimiters. Escape commas with quotes.
Do not include any header row other than the column names.

Product,Price,Rating,In Stock
Widget A,$19.99,4.5,Yes
Widget B,$29.99,3.8,No
```

### Bullet and Numbered Lists

**Simple bullet list:**

```
List the top 5 reasons for customer churn. Format as:
- Reason 1: brief explanation
- Reason 2: brief explanation
```

**Nested lists:**

```
Organize findings by severity:

Critical:
- Finding A: [description]
- Finding B: [description]

High:
- Finding C: [description]
```

**Numbered steps:**

```
Provide the deployment steps as a numbered list:
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]
```

### List Reliability Tips

| Issue | Mitigation |
|-------|-----------|
| Inconsistent bullet character | Explicitly state: "Use hyphens (-), not asterisks" |
| Wrong number of items | "Provide exactly 5 items, no more, no less" |
| Extra blank lines | "No blank lines between list items" |
| Items too long | "Each item max 15 words" |
| Unordered starts numbering | "Use 1. 2. 3. for the sequence" |

---

## Multi-Format Decision Guide

### Format Selection Matrix

| Requirement | Recommended Format | API Support |
|-------------|-------------------|-------------|
| Machine-parsable data | JSON with schema | OpenAI (Structured Outputs), Anthropic (Tool Use), Gemini (Response Schema) |
| Human-readable report | Markdown | All models |
| Hierarchical structured data | XML | Claude (best), GPT/Gemini (good) |
| Code | Fenced code block with language tag | All models |
| Tabular data | JSON → render as table | Production-reliable |
| Simple comparison | Markdown table | Acceptable for non-critical |
| Data export | JSON or CSV | JSON is more reliable |
| API response | JSON with schema enforcement | Use native API features |
| Log/event data | JSON Lines (one JSON object per line) | Requires careful prompting |
| Configuration | YAML | Modest reliability |
| Chat/messaging | Plain text | All models |

### Token Cost Comparison

For the same data content:

| Format | Relative Token Cost | Notes |
|--------|-------------------|-------|
| Plain text | 1x (baseline) | No structural overhead |
| Bullet list | 1.1-1.3x | Minimal overhead |
| Markdown table | 1.3-1.5x | Header row + separator |
| JSON (compact) | 1.2-1.5x | Keys add tokens |
| JSON (pretty) | 1.5-2.0x | Whitespace adds up |
| XML | 1.5-2.5x | Verbose opening/closing tags |
| YAML | 1.3-1.8x | Indentation adds lines |

### Production Reliability Scale

```
Format Reliability (1-10):
  10: Native structured output API (JSON Schema enforced by model)
   9: Tool use / function calling with strict schema
   8: Prompt + JSON Schema + validated output + retry
   7: Prompt + examples + validated output
   6: Prompt with explicit schema (no API enforcement)
   5: Markdown with explicit template
   4: XML with explicit template
   3: Bullet/numbered list description
   2: "Respond in JSON" (no schema)
   1: No format instruction
```

### Multi-Format Output Pattern

Sometimes you need the same content in multiple formats:

```
Return BOTH a human-readable summary AND structured data:

## Summary
[2-3 sentence executive summary]

## Data
```json
{
  "metrics": {...},
  "findings": [...]
}
```
```

This pattern satisfies both human readers and automated pipelines from a single LLM call.

---

## Summary

- **Always specify the output format** — never leave it to the model's choice
- **JSON with schema enforcement** (native API) is the most reliable structured output
- **Markdown** is best for human-readable content, **XML** for Claude-based structured output
- **Code generation** needs explicit constraints on language, style, and output format
- **Tables and lists** work but have failure modes — JSON-first rendering is more reliable
- **Layered defense** (API enforcement + prompt + validation + retry) is essential for production
- **Match format to use case** — not every output needs to be JSON; plain text is fine for chat

> Next: [05-Best-Practices.md](./05-Best-Practices.md)
