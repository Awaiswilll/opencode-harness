# Monitoring

> A comprehensive guide to monitoring prompt-engineered systems in production — covering key metrics, prompt management platforms, alerting, and observability setup.

---

## Table of Contents

1. [Why Monitoring Matters](#why-monitoring-matters)
2. [Key Metrics to Track](#key-metrics-to-track)
3. [Prompt Management Platforms Comparison](#prompt-management-platforms-comparison)
4. [Alerting Thresholds](#alerting-thresholds)
5. [Observability Setup](#observability-setup)
6. [Building a Monitoring Dashboard](#building-a-monitoring-dashboard)
7. [Incident Response from Monitoring Data](#incident-response-from-monitoring-data)

---

## Why Monitoring Matters

Unlike traditional software, LLM-powered systems have non-deterministic outputs, variable costs, and unique failure modes. Monitoring is essential for:

| Reason | Example |
|--------|---------|
| **Quality degradation** | Prompt change causes task completion rate to drop 5% |
| **Cost explosion** | Token usage doubles due to prompt bloat |
| **Security incidents** | Injection attempts spike after new deployment |
| **Latency regression** | New model version increases p95 latency by 3x |
| **User experience** | Satisfaction scores decline slowly over time |
| **Safety compliance** | Filter hit rate indicates novel attack patterns |

### The Three Pillars of LLM Monitoring

```
1. QUALITY — Is the system producing good outputs?
2. COST — Are we spending appropriately?
3. SAFETY — Are our defenses holding?
```

---

## Key Metrics to Track

### Quality Metrics

| Metric | What It Detects | How to Measure | Alert If |
|--------|-----------------|----------------|----------|
| Task completion rate | Overall system effectiveness | User surveys, goal tracking | Drops >5% in 1h |
| User satisfaction score | Perceived quality | Thumbs up/down, star rating | Drops >10% in 24h |
| Escalation rate | Prompt not handling edge cases | Human handoff count | Increases >50% in 1h |
| Format compliance rate | Output contract violations | Schema validation | Below 99% in 1h |
| Hallucination rate | Fabricated information | LLM-as-Judge, human review | >1% of responses |
| Response relevance | Addressing user intent | Embedding similarity | Below 0.8 average |

### Cost Metrics

| Metric | What It Detects | How to Measure | Alert If |
|--------|-----------------|----------------|----------|
| Token cost per call | Cost regressions from prompt bloat | (input + output) * model rate | >$0.05 per call |
| Average input tokens | Prompt size creep | Tokenizer count | >2000 tokens |
| Average output tokens | Response verbosity | Tokenizer count | >500 tokens |
| Cost by model | Routing effectiveness | Aggregate by model | Cheap model <50% traffic |
| Cache hit rate | Caching efficiency | Cache hits / total calls | <20% hit rate |
| Cost per user | User-level economics | Total cost / active users | >$0.50/user/month |

### Performance Metrics

| Metric | What It Detects | How to Measure | Alert If |
|--------|-----------------|----------------|----------|
| Time to First Token (TTFT) | Model + network latency | Client-side timing | >2s p95 |
| Total generation time | Prompt complexity + response length | End-to-end timing | >10s p95 |
| P50/P95/P99 latency | Overall user experience | Percentile calculation | P95 > 5s |
| Error rate | API failures, rate limits, timeouts | Error count / total calls | >1% of calls |
| Retry rate | Downstream instability | Retry count / total calls | >5% of calls |

### Safety Metrics

| Metric | What It Detects | How to Measure | Alert If |
|--------|-----------------|----------------|----------|
| Layer 1 block rate | Brute-force injection attempts | Blocklist hits / total inputs | >5% of total traffic |
| Layer 3 classifier alerts | Novel attack patterns | Classifier confidence scores | Mean score shift >0.1 |
| Layer 5 filter hit rate | Output policy violations | Filter triggers / total outputs | >0.1% of responses |
| Layer 6 judge flag rate | Subtle injection attempts | Judge flags / total convos | >0.01% of conversations |
| Tool authorization failures | Tool misuse attempts | Denied calls / total tool calls | >1% of tool calls |

### Business Metrics

| Metric | What It Detects |
|--------|-----------------|
| Daily active users | Adoption and usage |
| Conversations per user | Engagement depth |
| Session length | Value per conversation |
| Revenue attribution | ROI of AI features |
| Support ticket deflection | Cost savings from automation |

---

## Prompt Management Platforms Comparison (2026)

| Platform | Type | Strengths | Limitations | Pricing |
|----------|------|-----------|-------------|---------|
| **Langfuse** | Open-source | Versioning + tracing + evaluation; self-hostable | Self-hosting overhead for scale | Free self-host / Paid cloud |
| **LangSmith** | Managed (LangChain) | LangChain integration, Hub, tagging, eval | Tied to LangChain ecosystem | Usage-based |
| **PromptLayer** | Managed | Provider-agnostic, A/B testing, usage tracking | Less evaluation depth | Per-request |
| **Prompt Assay** | Managed | Multi-model compare, AI-assisted editing, eval | Platform fees | Per-seat |
| **Agenta** | Open-source | Jinja templating, environments, CI/CD webhooks | Smaller community | Free self-host / Paid cloud |
| **EmberLM** | Managed | Git-like versioning, CI GitHub App, tag-based deployment | Newer platform | Per-seat |
| **LaunchDarkly AI Configs** | Managed | Feature-flag-style prompt management, runtime updates | Limited eval features | Per-seat |
| **Maxim AI** | Managed | End-to-end: IDE, A/B testing, observation | Full-feature cost | Enterprise |
| **LangWatch** | Managed | CLI + UI, evaluation, safe deployment | Smaller ecosystem | Per-request |

### Platform Selection Guide

| If you need... | Choose... |
|----------------|-----------|
| Free, self-hosted option | Langfuse |
| Deep LangChain integration | LangSmith |
| Provider-agnostic usage tracking | PromptLayer |
| Non-engineer friendly UI | Prompt Assay |
| Git-native workflow | EmberLM |
| Feature-flag integration | LaunchDarkly AI Configs |
| End-to-end enterprise platform | Maxim AI |

### Integration Example (Langfuse)

```python
from langfuse import Langfuse

langfuse = Langfuse(
    public_key="pk-...",
    secret_key="sk-...",
    host="https://cloud.langfuse.com"
)

@langfuse.observe(
    name="customer-support",
    capture_input=True,
    capture_output=True,
)
def handle_support_request(user_message: str) -> str:
    # Your prompt + LLM call
    response = call_llm(system_prompt, user_message)

    # Score the response
    langfuse.score(
        trace_id=current_trace_id,
        name="user_satisfaction",
        value=user_feedback,
    )

    return response
```

### Tracing Structure

```yaml
trace:
  id: trace_abc123
  timestamp: 2026-06-01T14:23:00Z

  # Root span: the overall request
  - name: customer-support-request
    input: "I need to reset my password"
    output: "I can help you reset your password..."

    # Child spans for each step
    children:
      - name: input-validation
        input: "..."
        output: "PASSED"
        duration: 2ms

      - name: retrieval (RAG)
        input: "password reset policy"
        output: "Password reset requires email verification..."
        duration: 150ms

      - name: llm-call
        model: gpt-4o-mini
        input_tokens: 850
        output_tokens: 120
        duration: 1200ms
        temperature: 0.3

      - name: output-validation
        input: "I can help you reset your password..."
        output: "VALID (schema ok, no PII detected)"
        duration: 5ms

  # Scores attached to the trace
  scores:
    relevance: 0.95
    accuracy: 1.0
    user_satisfaction: 5
```

---

## Alerting Thresholds

### Tiered Alert System

| Tier | Response Time | Examples | Channel |
|------|--------------|----------|---------|
| **Critical** | <5 minutes | Safety filter bypass, cost spike >200% | PagerDuty call + Slack |
| **High** | <15 minutes | Quality drop >10%, latency spike >2x | Slack urgent + email |
| **Medium** | <1 hour | Gradual quality decline, cache miss increase | Slack notification |
| **Low** | <24 hours | Dashboard pattern, weekly trend | Email digest |

### Recommended Alert Rules

```yaml
alerts:
  critical:
    - name: safety_filter_bypass
      condition: "layer_5_block_rate < 0.001 AND layer_6_flag_rate > 0.01"
      description: "Potential injection bypass — safety filters not catching attacks"
      window: 5m
      action: page_oncall

    - name: cost_spike
      condition: "cost_per_minute > baseline * 3"
      description: "Cost exceeded 3x normal rate"
      window: 5m
      action: page_oncall

  high:
    - name: quality_degradation
      condition: "task_completion_rate < 0.85"
      description: "Task completion rate below 85%"
      window: 15m
      action: slack_urgent

    - name: latency_regression
      condition: "p95_latency > baseline * 2"
      description: "P95 latency doubled"
      window: 15m
      action: slack_urgent

    - name: format_compliance_drop
      condition: "format_compliance_rate < 0.95"
      description: "Output format compliance below 95%"
      window: 15m
      action: slack_urgent

  medium:
    - name: cache_hit_rate_drop
      condition: "cache_hit_rate < 0.20"
      description: "Cache hit rate below 20%"
      window: 1h
      action: slack_notify

    - name: token_usage_increase
      condition: "avg_input_tokens > baseline * 1.5"
      description: "Average input tokens increased 50%"
      window: 1h
      action: slack_notify

    - name: error_rate_increase
      condition: "error_rate > 0.01"
      description: "Error rate above 1%"
      window: 1h
      action: slack_notify

  low:
    - name: weekly_quality_trend
      condition: "task_completion_rate < baseline * 0.95 FOR 7d"
      description: "Gradual quality decline over past week"
      window: 7d
      action: email_digest

    - name: model_distribution_shift
      condition: "gpt-4o-mini_share < 0.40"
      description: "Cheap model usage below 40% — routing may need tuning"
      window: 24h
      action: email_digest
```

### Alert Fatigue Prevention

| Strategy | Implementation |
|----------|---------------|
| Rate limiting | Max 1 alert per metric per 15 minutes |
| Muting | Auto-mute during maintenance windows |
| Grouping | Correlate related alerts into incidents |
| Dynamic thresholds | Use rolling windows (e.g., 3σ from 7-day baseline) |
| Escalation delay | Wait 2 minutes before critical alert (confirm not transient) |

---

## Observability Setup

### Core Observability Stack

```
┌─────────────────────────────────────────────────┐
│                  Application Layer                │
│  [Prompt] → [LLM Call] → [Response] → [User]     │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│               Instrumentation Layer               │
│  OpenTelemetry SDK (Python/TS/Go)                 │
│  - Spans for each operation                       │
│  - Attributes (model, tokens, latency)            │
│  - Events (cache hit/miss, retries)               │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                 Collection Layer                  │
│  OpenTelemetry Collector                         │
│  - Receives spans from SDK                       │
│  - Processes, batches, exports                   │
│  - Runs as sidecar or daemonset                  │
└────┬──────────┬──────────┬──────────┬───────────┘
     │          │          │          │
┌────▼───┐ ┌───▼────┐ ┌───▼───┐ ┌───▼──────────┐
│Tracing │ │Metrics │ │Logs   │ │LLM-Specific  │
│Datadog │ │Grafana │ │ELK    │ │Langfuse      │
│Jaeger  │ │Datadog │ │Loki   │ │(traces +     │
│        │ │        │ │       │ │ scores)       │
└────────┘ └────────┘ └───────┘ └──────────────┘
```

### OpenTelemetry Instrumentation

```python
from opentelemetry import trace
from opentelemetry.trace import SpanKind
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

tracer = trace.get_tracer("prompt-monitoring")

@tracer.start_as_current_span("llm-request", kind=SpanKind.CLIENT)
def monitored_llm_call(
    prompt: str,
    model: str,
    system_prompt: str = None,
) -> str:
    span = trace.get_current_span()

    # Set attributes
    span.set_attribute("llm.model", model)
    span.set_attribute("llm.system_prompt.hash", hash(system_prompt))
    span.set_attribute("llm.prompt.length", len(prompt))

    # Start timer
    start = time.time()

    try:
        response = call_llm(prompt, model=model)

        # Record timing
        duration = time.time() - start
        span.set_attribute("llm.duration_ms", duration * 1000)

        # Record token counts
        span.set_attribute("llm.tokens.input", count_tokens(prompt))
        span.set_attribute("llm.tokens.output", count_tokens(response))

        # Record status
        span.set_status(trace.StatusCode.OK)

        return response

    except Exception as e:
        span.set_status(trace.StatusCode.ERROR, str(e))
        span.record_exception(e)
        raise
```

### Langfuse Observability Setup

```python
from langfuse import Langfuse
from langfuse.decorators import observe
from langfuse.model import Usage

langfuse = Langfuse()

@observe(
    name="customer-support-agent",
    capture_input=True,
    capture_output=True,
    update_level="all",  # Log all updates
)
def handle_query(user_input: str, user_id: str) -> str:
    # Log user feedback
    langfuse.create_observation(
        name="user-feedback",
        type="GENERATION",
        input=user_input,
        metadata={
            "user_id": user_id,
            "user_tier": get_user_tier(user_id),
            "session_id": get_session_id(),
        }
    )

    response = call_llm(system_prompt, user_input)

    # Score the response
    langfuse.score(
        name="response-quality",
        value=compute_quality(response),
        comment="Auto-scored by evaluator",
    )

    return response
```

### Structured Logging

```python
import structlog
import json

logger = structlog.get_logger()

def log_llm_call(
    prompt_id: str,
    prompt_version: str,
    model: str,
    input_tokens: int,
    output_tokens: int,
    latency_ms: float,
    user_id: str,
    success: bool,
    error: str = None,
):
    logger.info(
        "llm_call",
        prompt_id=prompt_id,
        prompt_version=prompt_version,
        model=model,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        total_tokens=input_tokens + output_tokens,
        cost=compute_cost(model, input_tokens, output_tokens),
        latency_ms=latency_ms,
        user_id=user_id[-4:],  # Partial for privacy
        success=success,
        error=error,
    )

# Example log output (JSON):
# {
#   "event": "llm_call",
#   "prompt_id": "customer-support",
#   "prompt_version": "v1.2.0",
#   "model": "gpt-4o-mini",
#   "input_tokens": 850,
#   "output_tokens": 120,
#   "total_tokens": 970,
#   "cost": 0.00044,
#   "latency_ms": 1200,
#   "user_id": "xyz1",
#   "success": true,
#   "error": null,
#   "timestamp": "2026-06-01T14:23:00Z"
# }
```

---

## Building a Monitoring Dashboard

### Dashboard Structure

```yaml
dashboard:
  name: "LLM Production Monitoring"
  refresh: 60s

  sections:
    - name: "Overview"
      panels:
        - metric: task_completion_rate
          type: stat
          unit: percent
          color: green (>=95) / yellow (85-95) / red (<85)

        - metric: cost_per_hour
          type: stat
          unit: USD
          sparkline: true

        - metric: active_users
          type: stat
          unit: count

    - name: "Quality"
      panels:
        - metric: task_completion_rate
          type: timeseries
          unit: percent
          window: 7d

        - metric: user_satisfaction
          type: timeseries
          unit: score (1-5)
          window: 7d

        - metric: escalation_rate
          type: timeseries
          unit: percent
          window: 7d

    - name: "Cost"
      panels:
        - metric: cost_by_model
          type: pie
          group: model

        - metric: cost_per_completion
          type: timeseries
          unit: USD
          window: 30d

        - metric: cache_hit_rate
          type: timeseries
          unit: percent
          window: 7d

    - name: "Performance"
      panels:
        - metric: latency_p50_p95_p99
          type: timeseries
          unit: ms
          window: 24h

        - metric: ttft_p95
          type: stat
          unit: ms
          threshold: 2000

        - metric: error_rate
          type: timeseries
          unit: percent
          window: 24h

    - name: "Safety"
      panels:
        - metric: layer_block_rate_by_layer
          type: bar
          unit: percent
          group: layer

        - metric: injection_attempts
          type: timeseries
          unit: count
          window: 24h

        - metric: filter_hit_rate
          type: timeseries
          unit: percent
          window: 24h
```

### Grafana Example Configuration

```yaml
# Monitoring via Grafana + Prometheus + Loki
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090

  - name: Loki
    type: loki
    url: http://loki:3100

rules:
  groups:
    - name: llm_alerts
      rules:
        - alert: HighCostPerCompletion
          expr: avg(cost_per_completion{job="llm-api"}) > 0.05
          for: 5m
          annotations:
            summary: "Average cost per completion exceeded $0.05"

        - alert: LowUserSatisfaction
          expr: avg(user_satisfaction{job="llm-api"}) < 3.0
          for: 5m
          annotations:
            summary: "User satisfaction dropped below 3.0"
```

---

## Incident Response from Monitoring Data

### Detecting Incidents via Monitoring

```yaml
incident_scenarios:
  - name: "Prompt Bloat"
    detection:
      - avg_input_tokens > baseline * 1.5 for 1h
      - cost_per_completion > baseline * 1.5 for 1h
    response:
      - Review recent prompt changes
      - Run compression analysis
      - Rollback if necessary

  - name: "Quality Degradation"
    detection:
      - task_completion_rate drops >5% in 15 minutes
      - user_satisfaction drops >10% in 1 hour
    response:
      - Compare eval scores between current and previous prompt version
      - Check model version changes
      - Check for upstream data changes (RAG, APIs)

  - name: "Injection Attack"
    detection:
      - layer_5_filter_hit_rate > 5x baseline
      - layer_6_flag_rate > 10x baseline
    response:
      - Follow incident response playbook (Identify → Contain → Analyze → Remediate → Report → Harden)
      - Block attacking IPs
      - Review injection patterns for defense updates

  - name: "Cost Explosion"
    detection:
      - cost_per_minute > baseline * 3 for 5 minutes
    response:
      - Identify source: model mix shift? Token count spike? Traffic surge?
      - Adjust routing rules
      - Scale back model quality tier
```

### Monitoring Retrospective Template

```markdown
## Monitoring Incident: [TITLE]

**Detected:** 2026-06-01 14:23 UTC
**Duration:** 47 minutes
**Severity:** High

### What Happened
[Description of the incident and what monitoring detected]

### Detection
Which metric(s) triggered the alert?
- avg_input_tokens: 2,400 (baseline: 850)
- cost_per_completion: $0.12 (baseline: $0.02)

### Root Cause
Prompt engineer deployed v1.3.0 with 3x larger system prompt without running eval.

### Resolution
Rolled back to v1.2.0. Cost returned to baseline within 2 minutes.

### Improvements
- [ ] Add pre-deployment prompt size check to CI/CD
- [ ] Set hard limit on system prompt token count with alert
- [ ] Include cost-per-completion in eval comparison
```

---

> **Key takeaway:** Monitoring is not optional for production LLM systems. Track quality, cost, performance, and safety metrics. Set tiered alerts with clear thresholds. Use OpenTelemetry for instrumentation and a dedicated platform (Langfuse, Grafana) for visualization. The goal is detecting problems before users notice them.
