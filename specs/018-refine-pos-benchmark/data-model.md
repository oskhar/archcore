# Data Model: Refined POS Benchmark

## Key Entities

### LabResult (Input)
Representing a single Artillery run for an architecture/scenario pair.
- `runId`: string (Unix timestamp)
- `architecture`: MONOLITH | HYBRID
- `scenario`: PRODUCT_CRUD | INVENTORY_SYNC | SALES_TRANSACTION
- `startTime`: ISO8601 string
- `endTime`: ISO8601 string
- `metrics`: MetricSet
- `devMetrics`: DevMetricSet

### MetricSet
- `throughput`: number (RPS)
- `latency_p50`: number (ms)
- `latency_p95`: number (ms)
- `latency_p99`: number (ms)
- `success_rate`: number (0-1)
- `failure_rate`: number (%)
- `consistency_lag_ms?`: number (Hybrid only)
- `rehydration_time_ms?`: number (Hybrid only)

### DevMetricSet
- `files_touched`: number
- `loc_churn`: number
- `lead_time_min`: number (Total duration from first commit to merge)
- `commit_count`: number
- `avg_commit_interval_min`: number (Time between commits)

### AggregatedResult (Output)
Data ready for `GraphReporter`.
- `scenario`: string
- `monolith`: MetricSet & DevMetricSet
- `hybrid`: MetricSet & DevMetricSet
- `trends`:
  - `labels`: string[] (Run IDs or SCS branch names)
  - `monolithLatency`: number[]
  - `hybridLatency`: number[]
  - `monolithThroughput`: number[]
  - `hybridThroughput`: number[]
  - `hybridLag`: number[]

## Storage Schema

### Raw Data (JSON)
- Path: `laboratory/results/{arch}-{scenario}-{runId}.json`
- Source: Artillery output.

### Consolidated Metrics (JSON)
- Path: `laboratory/results/metrics-consolidated.json`
- Purpose: Cache for `MetricsAggregator` to avoid re-parsing raw files.

### Git Metrics (JSONL)
- Path: `laboratory/results/commit-intervals.jsonl`
- Format: `{ branch: string, commit: string, timestamp: number, interval_to_prev: number }`
