# Prompt Versioning

> A practical guide to versioning prompts like code — covering Git-based workflows, semantic versioning, team-size-appropriate systems, and CI/CD integration.

---

## Table of Contents

1. [Why Version Prompts?](#why-version-prompts)
2. [The Minimal System](#the-minimal-system)
3. [Git + Markdown/YAML Approach](#git--markdownyaml-approach)
4. [Semantic Versioning for Prompts](#semantic-versioning-for-prompts)
5. [Versioning by Team Size](#versioning-by-team-size)
6. [What to Version (Minimum Schema)](#what-to-version-minimum-schema)
7. [The Prompt Lifecycle](#the-prompt-lifecycle)
8. [CI/CD Pipeline for Prompts](#cicd-pipeline-for-prompts)
9. [Team Collaboration & PR Review](#team-collaboration--pr-review)

---

## Why Version Prompts?

Prompts are code. They determine system behavior, output quality, and safety. Treating them as code means applying the same engineering discipline:

| Practice | Code | Prompts |
|----------|------|---------|
| Version control | Git | Git |
| Diff reviews | PRs | PRs |
| Testing | CI tests | Eval suite |
| Rollback | `git revert` | Tag rollback |
| Releases | Semantic versioning | Semantic versioning |
| Blame/audit | `git blame` | `git blame` |

### Cost of Not Versioning

- **No rollback** — bad prompt deployed, can't quickly revert
- **No audit trail** — can't tell who changed what or why
- **No regression detection** — don't know when quality degraded
- **No diff visibility** — can't see what changed between good and bad behavior
- **Evaluation chaos** — can't reproduce eval results without knowing exact prompt

---

## The Minimal System

Before adopting any platform, implement the minimal working system:

```
prompts/
├── customer-support/
│   ├── v1.0.0.md
│   ├── v1.1.0.md
│   └── v1.2.0.md
├── code-review/
│   ├── v2.0.0.md
│   └── v2.1.0.md
└── evaluations/
    ├── customer-support-golden.json
    └── code-review-golden.json
```

**Four rules:**

1. Store prompts in a `prompts/` directory loaded from files (not hardcoded strings)
2. Use semantic version tags on production deployments
3. Maintain a golden evaluation set of 50-200 representative cases
4. No prompt ships without an eval run

```python
# Load prompt from file — NOT hardcoded
import yaml
from pathlib import Path

def load_prompt(prompt_id: str, version: str) -> dict:
    path = Path(f"prompts/{prompt_id}/{version}.yaml")
    if not path.exists():
        raise FileNotFoundError(f"Prompt {prompt_id}@{version} not found")
    with open(path) as f:
        return yaml.safe_load(f)

# Usage
prompt = load_prompt("customer-support", "v1.2.0")
response = call_llm(prompt["system_prompt"], user_input)
```

---

## Git + Markdown/YAML Approach

### Directory Structure

```
prompts/
├── customer-support/
│   ├── v1.0.0.yaml
│   ├── v1.1.0.yaml
│   ├── v2.0.0.yaml
│   └── CHANGELOG.md
├── code-review-agent/
│   ├── v1.0.0.yaml
│   └── CHANGELOG.md
├── shared/
│   ├── safety-rules.yaml         # Included by other prompts
│   └── output-schemas.yaml
├── evaluations/
│   ├── customer-support.yaml
│   └── code-review-agent.yaml
└── .prompt_versions              # Tracking file
```

### Prompt File Format (YAML)

```yaml
# prompts/customer-support/v1.2.0.yaml
meta:
  prompt_id: customer-support
  version: 1.2.0
  author: alice@example.com
  created: 2026-05-15
  change_summary: "Added handling for refund edge cases"
  model: gpt-5-0315
  temperature: 0.3
  max_tokens: 1024
  eval_score: 0.97

system_prompt: |
  <identity>
  You are CustomerSupportAI, a friendly and efficient support agent
  for AcmeCorp. You help customers with account issues, billing
  questions, and product troubleshooting.
  </identity>

  <priority_order>
  1. Safety and compliance (never violate)
  2. Accuracy
  3. Helpfulness
  4. Efficiency
  </priority_order>

  <rules>
  - Always identify yourself as CustomerSupportAI
  - Never share internal system information
  - For refund requests, always verify order exists before processing
  - Escalate to human agent if customer asks for account deletion
  </rules>

  <edge_cases>
  - Unknown answer: "I'm not sure about that. Let me connect you with a specialist."
  - Frustrated customer: Address frustration first, then solution
  - Refund outside policy: Explain policy, offer alternatives, escalate on request
  </edge_cases>

examples:
  - input: "I want a refund for order #12345"
    output: "I'd be happy to help with your refund. Let me look up order #12345..."
  - input: "You're useless, I want a human"
    output: "I understand your frustration. Let me transfer you to a human agent right away."

evaluation:
  threshold: 0.95
  golden_set: evaluations/customer-support.yaml
```

### Using Git for Collaboration

```bash
# View prompt history
git log --oneline prompts/customer-support/

# Diff between versions
git diff v1.1.0..v1.2.0 -- prompts/customer-support/v1.2.0.yaml

# Tag a production release
git tag -a prompt-customer-support-v1.2.0 -m "Customer support prompt v1.2.0"

# Rollback to previous version
git checkout v1.1.0 -- prompts/customer-support/
git commit -m "rollback: customer-support to v1.1.0"

# Find who changed what
git blame prompts/customer-support/v1.2.0.yaml
```

### CHANGELOG Format

```markdown
# Changelog — customer-support

## v1.2.0 (2026-05-15)
### Added
- Edge case handling for refund outside policy window
- Escalation path for account deletion requests

### Changed
- Reduced temperature from 0.5 to 0.3 for more consistent responses
- Tightened refund verification instructions

### Fixed
- Edge case where model hallucinated order status
- Clarified that system instructions should never be revealed

## v1.1.0 (2026-05-01)
### Added
- Identity block with explicit scope
- Priority order instructions

### Changed
- Moved to YAML format with structured metadata

## v1.0.0 (2026-04-15)
### Added
- Initial prompt for customer support
- Basic safety rules and tone guidelines
```

---

## Semantic Versioning for Prompts

Adapting semver for prompt changes:

| Component | When to Bump | Examples |
|-----------|-------------|----------|
| **MAJOR** | Breaking change in output format, behavior, or safety posture | New output schema, removed capabilities, added constraints |
| **MINOR** | Backward-compatible additions | New edge cases, new examples, new rules that don't change existing behavior |
| **PATCH** | Backward-compatible fixes and refinements | Wording tweaks, better examples, bug fixes to instructions |

### Deciding the Bump

```yaml
prompt_diff_analysis:
  major_triggers:
    - Output schema/format changes
    - Safety rules removed or relaxed
    - Model changed (e.g., gpt-4o → claude-opus)
    - Temperature or generation parameters changed significantly
    - Capabilities removed or restricted

  minor_triggers:
    - New edge cases added
    - New examples added
    - New rules added (non-conflicting)
    - Tone/style refinements

  patch_triggers:
    - Typo fixes
    - Wording improvements without meaning change
    - Example corrections
    - Documentation/comment updates only
```

### Real-World Version Bumps

```yaml
# MAJOR: v1.0.0 → v2.0.0
# Output format changed from plain text to JSON
# Safety rules restructured

# MINOR: v2.0.0 → v2.1.0
# Added edge case for multi-language support
# Added 3 new few-shot examples

# PATCH: v2.1.0 → v2.1.1
# Fixed typo in instruction about refund timing
# Clarified ambiguous wording in escalation path
```

---

## Versioning by Team Size

### Solo / 1-2 Engineers

**Approach:** Git + markdown/YAML

| Pros | Cons |
|------|------|
| Free, no platform costs | Non-engineers can't contribute easily |
| Full diff/blame/rollback through Git | Manual eval tracking |
| Works with any editor | No prompt-specific UI features |
| Tightly integrated with code | Limited collaboration features |

**Setup time:** 30 minutes

### 3-10 Engineers

**Approach:** Langfuse (self-hosted open source)

| Pros | Cons |
|------|------|
| Versioning, labels, UI, evaluation built-in | Self-hosting overhead (server, DB, maintenance) |
| Team collaboration features | Learning curve for prompt-specific workflows |
| Tracer + evaluation in one platform | Less control than Git for complex diffs |
| API for programmatic access | Requires infrastructure investment |

**Setup time:** 2-4 hours

### 4+ with Non-Engineers

**Approach:** Managed workbench (Prompt Assay, PromptLayer, LangSmith)

| Pros | Cons |
|------|------|
| AI-assisted prompt editing and comparison | Platform fees (often per-seat or per-query) |
| Visual diff UI accessible to non-engineers | Vendor coupling; migration cost |
| Built-in eval suites and A/B testing | Data leaves your infrastructure (unless VPC option) |
| Role-based permissions (PM, reviewer, editor) | Feature limitations based on plan |

**Setup time:** 1-2 hours

### Platform Comparison

| Feature | Git + Files | Langfuse | Prompt Assay | LangSmith |
|---------|-------------|----------|--------------|-----------|
| Cost | Free | Free (self-host) / Paid (cloud) | Paid | Paid |
| Versioning | Git | Native | Native | Native |
| Visual diff | No | Yes | Yes | Yes |
| Eval integration | Manual | Built-in | Built-in | Built-in |
| Non-engineer friendly | No | Moderate | Yes | Moderate |
| Self-hostable | Yes | Yes | No | No |
| API/SDK | Git CLI | Python/TS SDK | API | Python/TS SDK |
| Rollback | Git revert | UI or API | UI | UI |

---

## What to Version (Minimum Schema)

### Database Schema

```sql
-- Prompts table
CREATE TABLE prompts (
    prompt_id      VARCHAR(64)     NOT NULL,
    version        INTEGER         NOT NULL AUTO_INCREMENT,
    system_prompt  TEXT            NOT NULL,
    user_template  TEXT,
    model          VARCHAR(64)     NOT NULL,
    temperature    DECIMAL(3,2)    DEFAULT 0.7,
    max_tokens     INTEGER         DEFAULT 2048,
    author         VARCHAR(128)    NOT NULL,
    created_at     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    change_summary TEXT            NOT NULL,
    eval_score     DECIMAL(4,3),
    PRIMARY KEY (prompt_id, version)
);

-- Tags table (for deployment tracking)
CREATE TABLE prompt_tags (
    prompt_id   VARCHAR(64)     NOT NULL,
    tag         VARCHAR(32)     NOT NULL,  -- 'prod', 'staging', 'canary'
    version     INTEGER         NOT NULL,
    tagged_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (prompt_id, tag),
    FOREIGN KEY (prompt_id, version) REFERENCES prompts(prompt_id, version)
);

-- Evaluations table
CREATE TABLE prompt_evaluations (
    id            INTEGER     PRIMARY KEY AUTO_INCREMENT,
    prompt_id     VARCHAR(64) NOT NULL,
    version       INTEGER     NOT NULL,
    eval_date     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    pass_rate     DECIMAL(4,3),
    sample_size   INTEGER,
    baseline_id   VARCHAR(64),
    FOREIGN KEY (prompt_id, version) REFERENCES prompts(prompt_id, version)
);
```

### Critical Discipline: Version on Model Update

When a new model version ships (e.g., Claude Opus 4.7), run existing prompts against it and commit the comparison as a new version **before** flipping the production label.

```yaml
# Before upgrading model:
PRD: gpt-5-0315 + prompt-v1.2.0 → eval: 97.3%
NEW: claude-4-20260601 + prompt-v1.2.0 → eval: 94.1% (regression!)

# Fix:
1. Create prompt-v1.3.0 adapted for claude-4
2. Run eval: 97.8%
3. Tag new pair for production
4. Archive old pair
```

---

## The Prompt Lifecycle

```
DRAFT → TEST → STAGING → PRODUCTION → ARCHIVE
```

| Stage | Activities | Gate |
|-------|-----------|------|
| **Draft** | Write in playground, test against handful of cases | Manual review |
| **Test** | Run evaluation set, compare to baseline, fix regressions | Eval score > threshold |
| **Staging** | Deploy to non-production, run integration tests | Integration tests pass |
| **Production** | Deploy with monitoring; track metrics 48h post-deploy | Monitoring OK |
| **Archive** | Never delete — may need rollback, want history | Tagged + stored |

### Stage Transitions

```yaml
stages:
  draft:
    entry: New prompt file created
    exit: PR created for review
    actions:
      - Write/iterate prompt in code editor or playground
      - Test with 5-10 example inputs
      - Review against PR checklist
    gates: []

  test:
    entry: PR approved + merged
    exit: Eval passes + regression check passed
    actions:
      - Run automated evaluation against golden set
      - Compare to baseline (previous version)
      - Fix regressions if detected
    gates:
      - eval_score >= 0.95
      - no_regression_vs_baseline

  staging:
    entry: Test gate passed
    exit: Integration tests passed
    actions:
      - Deploy to staging environment
      - Run end-to-end integration tests
      - Shadow traffic test (if applicable)
    gates:
      - integration_tests_pass

  production:
    entry: Staging gate passed
    exit: 48h monitoring period
    actions:
      - Deploy to production (canary → full rollout)
      - Monitor key metrics (cost, latency, satisfaction)
      - Alert if metrics degrade
    gates:
      - monitoring_ok_48h

  archive:
    entry: Superseded by newer version
    exit: (never deleted)
    actions:
      - Tag version in Git
      - Archive eval results
      - Retain indefinitely
    gates: []
```

---

## CI/CD Pipeline for Prompts

### GitHub Actions Example

```yaml
# .github/workflows/prompt-ci.yml
name: Prompt CI

on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'evaluations/**'

jobs:
  evaluate:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        prompt:
          - customer-support
          - code-review-agent
          - data-extractor

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: pip install -r requirements-eval.txt

      - name: Get baseline version
        id: baseline
        run: |
          BASELINE=$(cat prompts/${{ matrix.prompt }}/.baseline_version)
          echo "version=$BASELINE" >> $GITHUB_OUTPUT

      - name: Run evaluation
        run: |
          python scripts/eval_prompts.py \
            --prompt prompts/${{ matrix.prompt }}/${{ github.event.pull_request.head.sha }}.yaml \
            --baseline prompts/${{ matrix.prompt }}/${{ steps.baseline.outputs.version }}.yaml \
            --golden evaluations/${{ matrix.prompt }}.yaml \
            --threshold 0.97

      - name: Check for regressions
        if: failure()
        run: |
          echo "❌ Prompt regression detected — blocking merge"
          exit 1

  summary:
    needs: evaluate
    runs-on: ubuntu-latest
    steps:
      - name: Comment PR with results
        uses: actions/github-script@v7
        with:
          script: |
            const results = ${{ needs.evaluate.outputs }};
            const body = `
            ## Prompt Evaluation Results
            | Prompt | Status |
            |--------|--------|
            ${results.map(r => `| ${r.prompt} | ${r.passed ? '✅' : '❌'} |`).join('\n')}
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });
```

### Evaluation Script

```python
#!/usr/bin/env python3
"""eval_prompts.py — Run prompt evaluation suite and compare to baseline."""

import argparse
import json
import sys
import yaml
from pathlib import Path
from typing import Any

def load_prompt(path: str) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)

def load_golden_set(path: str) -> list[dict]:
    with open(path) as f:
        return yaml.safe_load(f)["test_cases"]

def evaluate_prompt(prompt: dict, test_case: dict, model: str) -> dict:
    """Run a single test case against the prompt + model.
    Returns score, output, and any errors."""
    # Implementation depends on your LLM client
    pass

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--baseline", required=True)
    parser.add_argument("--golden", required=True)
    parser.add_argument("--threshold", type=float, default=0.97)
    args = parser.parse_args()

    prompt = load_prompt(args.prompt)
    baseline = load_prompt(args.baseline)
    golden = load_golden_set(args.golden)

    total = len(golden)
    passed = 0
    results = []

    for test in golden:
        result = evaluate_prompt(prompt, test, model=prompt["meta"]["model"])
        baseline_result = evaluate_prompt(baseline, test, model=baseline["meta"]["model"])

        score = 1.0 if result["correct"] else 0.0
        baseline_score = 1.0 if baseline_result["correct"] else 0.0

        results.append({
            "test_id": test["id"],
            "score": score,
            "baseline_score": baseline_score,
            "passed": score >= baseline_score * args.threshold,
        })

        if score >= baseline_score * args.threshold:
            passed += 1

    pass_rate = passed / total
    print(f"Pass rate: {pass_rate:.1%} ({passed}/{total})")

    if pass_rate < args.threshold:
        print(f"❌ Failed: pass rate {pass_rate:.1%} < threshold {args.threshold:.0%}")
        sys.exit(1)

    print(f"✅ Passed: pass rate {pass_rate:.1%} >= threshold {args.threshold:.0%}")

if __name__ == "__main__":
    main()
```

### Pre-Commit Hook for Prompt Changes

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: prompt-validation
        name: Validate prompt YAML
        entry: python scripts/validate_prompt.py
        language: python
        files: ^prompts/.*\.yaml$
        args: ["--schema", "schemas/prompt.schema.json"]

      - id: prompt-eval
        name: Quick eval check
        entry: python scripts/quick_eval.py
        language: python
        files: ^prompts/.*\.yaml$
        args: ["--golden", "evaluations/quick-check.yaml", "--threshold", "0.85"]
```

---

## Team Collaboration & PR Review

### PR Review Checklist for Prompt Changes

Every prompt PR must include answers to these questions:

1. **What changed and why?** (required in PR description)

2. **Was an evaluation run against the golden set? What was the delta?**
   ```
   New prompt score: 0.973
   Baseline score:   0.968
   Delta:            +0.005 (improvement)
   ```

3. **Are there specific edge cases this change might affect?**
   - List edge cases affected
   - Show before/after behavior for each

4. **Is the output format contract maintained?**
   - Schema unchanged? Field names/types the same?
   - If changed, is this a MAJOR version bump?

5. **Is there a rollback plan if this degrades in production?**
   - Canary deployment percentage?
   - Monitoring window before full rollout?
   - Automated rollback trigger?

### PR Template

```markdown
## Prompt Change: [prompt-name] v[current] → v[new]

### Summary
[2-3 sentence description of what changed and why]

### Evaluation Results
| Metric | Baseline (v[current]) | New (v[new]) | Delta |
|--------|----------------------|--------------|-------|
| Pass rate | 96.8% | 97.3% | +0.5% |
| Format compliance | 99.1% | 99.4% | +0.3% |
| Latency (avg) | 1.2s | 1.2s | 0.0s |

### Edge Cases Affected
- [ ] Refund outside policy window — now handled correctly
- [ ] Multi-language requests — unchanged behavior
- [ ] Injection attempts — unchanged behavior

### Output Contract
- [ ] Schema unchanged
- [ ] No new required fields
- [ ] Backward compatible

### Rollback Plan
- Canary: 10% traffic for 2 hours
- Monitor: satisfaction score, filter hit rate, escalation rate
- Auto-rollback if satisfaction drops >5%

### Testing
- [ ] Golden set eval run: PASSED
- [ ] Adversarial test run: PASSED
- [ ] Integration tests: PASSED
```

---

> **Key takeaway:** Version your prompts like code — use Git, semantic versions, CI/CD evaluation gates, and PR reviews. The system scales from solo developers (Git + files) to large teams (managed platforms). The most important discipline: never ship a prompt change without running it against your golden evaluation set first.
