# Quickstart: POS Benchmark Refinement

## Prerequisites
- Node.js 20+
- Docker & Docker Compose
- `artillery` (npm install -g artillery)
- Git

## Step 1: Run Laboratory Benchmarks
Ensure both architectures are running via Docker:
```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Execute a specific scenario benchmark:
```bash
# From repository root
npm run lab:benchmark -- --scenario product-crud --architecture monolith
npm run lab:benchmark -- --scenario product-crud --architecture hybrid
```
Results will be stored in `laboratory/results/*.json`.

## Step 2: Generate Refined Reports
Run the automated reporter to process results and generate charts:
```bash
# From repository root
npm run lab:report
```
Generated PNG charts will be saved to `reports/graphs/`.

## Step 3: Verify Data Integrity
Check `laboratory/results/metrics-consolidated.json` to ensure all datasets are correctly aggregated and pruned for incompleteness.

## Step 4: Review Complexity Progression
Compare Monolith vs Hybrid developer metrics in `reports/BENCHMARK_REPORT_TRACE.md`.
Observe trend lines for:
1. Latency (p95)
2. Throughput (RPS)
3. LOC Churn (Complexity)
4. Commit Intervals (Cognitive Load)
