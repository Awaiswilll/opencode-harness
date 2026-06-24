# Evaluation Templates

---

## Template A: PEEM Evaluation Checklist

**PEEM** = **P**rompt **E**valuation & **E**ffectiveness **M**easurement

Use this checklist to evaluate any prompt before deployment.

### 1. Clarity

| Criteria | Rating (1-5) | Notes |
|----------|:------------:|-------|
| Instructions are unambiguous | ☐☐☐☐☐ | |
| No contradictory directives | ☐☐☐☐☐ | |
| Single interpretation possible | ☐☐☐☐☐ | |
| Steps are in logical order | ☐☐☐☐☐ | |
| Domain terminology is defined | ☐☐☐☐☐ | |

### 2. Specificity

| Criteria | Rating (1-5) | Notes |
|----------|:------------:|-------|
| Format is explicitly specified | ☐☐☐☐☐ | |
| Length constraints are clear | ☐☐☐☐☐ | |
| Success criteria are measurable | ☐☐☐☐☐ | |
| Variables are bounded | ☐☐☐☐☐ | |
| Edge cases are addressed | ☐☐☐☐☐ | |

### 3. Constraints

| Criteria | Rating (1-5) | Notes |
|----------|:------------:|-------|
| Scope boundaries are explicit | ☐☐☐☐☐ | |
| Prohibited content is listed | ☐☐☐☐☐ | |
| Required elements are specified | ☐☐☐☐☐ | |
| Safety guardrails are in place | ☐☐☐☐☐ | |
| Fallback behaviors are defined | ☐☐☐☐☐ | |

### 4. Examples

| Criteria | Rating (1-5) | Notes |
|----------|:------------:|-------|
| At least 1 example provided | ☐☐☐☐☐ | |
| Example covers edge case | ☐☐☐☐☐ | |
| Example is representative | ☐☐☐☐☐ | |
| Input/output format matches | ☐☐☐☐☐ | |

### 5. Test Results

| Test | Pass/Fail | Details |
|------|:---------:|---------|
| First output quality | ☐ Pass ☐ Fail | |
| Repeated run consistency | ☐ Pass ☐ Fail | |
| Works with variations | ☐ Pass ☐ Fail | |
| Graceful error handling | ☐ Pass ☐ Fail | |
| Within token budget | ☐ Pass ☐ Fail | |

### Overall Score

| Category | Weight | Score | Weighted |
|----------|:------:|:-----:|:--------:|
| Clarity | 25% | /5 | |
| Specificity | 25% | /5 | |
| Constraints | 20% | /5 | |
| Examples | 15% | /5 | |
| Test Results | 15% | /5 | |
| **Total** | **100%** | | **/5** |

**Decision:** ☐ Deploy ☐ Revise ☐ Redesign

---

## Template B: A/B Test Plan

### Test Overview

```
Test ID:         [ID]
Prompt A:        [NAME / VERSION]
Prompt B:        [NAME / VERSION]
Date:            [DATE]
Evaluator:       [PERSON / MODEL]
Task:            [TASK DESCRIPTION]
Sample size:     [NUMBER OF TRIALS]
```

### Metrics

| Metric | Definition | Target | Measure Method |
|--------|-----------|--------|----------------|
| Accuracy | [DEFINITION] | [TARGET] | [METHOD] |
| Completeness | [DEFINITION] | [TARGET] | [METHOD] |
| Format compliance | [DEFINITION] | [TARGET] | [METHOD] |
| Safety pass rate | [DEFINITION] | [TARGET] | [METHOD] |
| Token efficiency | [DEFINITION] | [TARGET] | [METHOD] |
| User satisfaction | [DEFINITION] | [TARGET] | [METHOD] |

### Trial Log

| Trial | Prompt A Result | Prompt B Result | Winner |
|:-----:|:---------------:|:---------------:|:------:|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| ... | | | |
| N | | | |

### Summary

```
Prompt A total wins:   [COUNT] / [TOTAL]
Prompt B total wins:   [COUNT] / [TOTAL]
Ties:                  [COUNT]

Winner: [A / B / Tie]
Confidence: [HIGH / MEDIUM / LOW]
Notes: [OBSERVATIONS]
```

---

## Template C: Golden Dataset Template

A golden dataset is a curated set of test cases used for regression testing prompts.

### Dataset Structure

```
golden_dataset/
├── manifest.json
├── test_cases/
│   ├── tc-001-basic.json
│   ├── tc-002-edge-case.json
│   ├── tc-003-adversarial.json
│   └── ...
└── expected_outputs/
    ├── tc-001-expected.md
    ├── tc-002-expected.md
    └── ...
```

### Test Case Schema

```json
{
  "id": "tc-001",
  "category": "basic | edge | adversarial | regression",
  "description": "Brief description of what this tests",
  "input": {
    "prompt": "The prompt template with {variables}",
    "variables": {
      "key": "value"
    }
  },
  "expected": {
    "contains": ["required text 1", "required text 2"],
    "not_contains": ["forbidden text 1"],
    "format": "json | markdown | text",
    "schema": {},
    "max_tokens": 500,
    "min_quality_score": 4
  },
  "tags": ["safety", "formatting", "regression-fix-42"],
  "last_verified": "2026-06-03"
}
```

### Runbook

```
1. Load all test cases from golden_dataset/test_cases/
2. Run each test case through the prompt under evaluation
3. Compare output against expected_outputs/ using:
   a. Exact match (for structured outputs)
   b. Contains match (for required elements)
   c. Schema validation (for JSON/YAML)
   d. LLM-as-judge scoring (for quality)
4. Flag regressions (tests that passed before but fail now)
5. Update manifest.json with results
```

### Sample Manifest

```json
{
  "dataset_name": "Customer Support Prompt v2",
  "version": "2.1.0",
  "total_cases": 42,
  "last_run": "2026-06-03",
  "results": {
    "passed": 38,
    "failed": 3,
    "skipped": 1,
    "regressions": 0,
    "pass_rate": "90.5%"
  }
}
```

---

## Evaluation Flowchart

```
         ┌──────────────┐
         │  New Prompt   │
         └──────┬───────┘
                ▼
     ┌──────────────────┐
     │  PEEM Checklist   │◄── Self-evaluation
     └──────┬──┬────────┘
            │  │ FAIL
            │  ▼
            │  ┌──────────────┐
            │  │   Revise     │
            │  └──────────────┘
            │ PASS
            ▼
     ┌──────────────────┐
     │  Golden Dataset   │◄── Regression tests
     └──────┬──┬────────┘
            │  │ FAIL
            │  ▼
            │  ┌──────────────┐
            │  │   Debug      │
            │  └──────────────┘
            │ PASS
            ▼
     ┌──────────────────┐
     │   A/B Testing    │◄── Compare variants
     └──────┬───────────┘
            ▼
     ┌──────────────┐
     │   Deploy     │
     └──────────────┘
```
