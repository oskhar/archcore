# Research: POS Architecture Complexity Benchmark (Refined)

## Decision Log

### Decision: Git Metric Extraction Strategy
- **Rationale**: To capture "Lead time per SCS" and "Time between commits" (mandatory per Constitution V), we need a reliable way to query git history programmatically.
- **Approach**: Use `child_process.execSync` with `git log` commands.
  - **Lead Time**: `git log --pretty=format:%at --reverse` -> `last_commit_time - first_commit_time`.
  - **Commit Intervals**: Iterate through `git log --pretty=format:%at` results and calculate `t[i] - t[i+1]`.
- **Alternatives Considered**: Using a library like `isomorphic-git` (rejected to keep laboratory dependencies minimal).

### Decision: Artillery Trend Extraction
- **Rationale**: Current `loader.ts` only extracts aggregated summaries. To capture "concurrency effects" and "event flow", we need more granular data.
- **Approach**: Update `loader.ts` to extract `vusers.created_by_scenario` and `vusers.session_length` from the Artillery JSON report. Use `aggregate.summaries['vusers.session_length']` as a proxy for end-to-end flow duration.
- **Validated Raw Data**: Implement a `DataValidator` class to prune results where `http.requests` < threshold or `success_rate` is NaN, ensuring only "full" datasets are graphed.

### Decision: Visualization Redesign (Detailed Line Charts)
- **Rationale**: User requires trend capture over time, SCS progression, and multi-variable overlays.
- **Approach**:
  - **Multi-Variable Overlays**: Use dual Y-axes in `Chart.js` to plot Latency (left) and Throughput (right) on the same line chart.
  - **SCS Progression**: Map SCS branch merge order to the X-axis of the complexity trend chart.
  - **Consistent Scales**: Fix `y.min: 0` and optionally set `y.max` based on the global maximum of the dataset to ensure Monolith vs Hybrid comparisons are visually comparable.
  - **Legends & Labeling**: Enforce `plugins.legend.display: true` and `scales.y.title.display: true` in all configurations.

## Technical Unknowns Resolved

### Unknown: How to extract commit intervals?
- **Resolved**: `git log --pretty=format:%at -- [path]` returns unix timestamps. Example script:
  ```typescript
  const timestamps = execSync(`git log --pretty=format:%at -- ${path}`).toString().split('\n').map(Number);
  const intervals = [];
  for (let i = 0; i < timestamps.length - 1; i++) {
    intervals.push(Math.abs(timestamps[i] - timestamps[i+1]));
  }
  ```

### Unknown: How to handle empty/incomplete datasets in Chart.js?
- **Resolved**: Filter the `results` array in `MetricsAggregator` before passing to `GraphReporter`. Use `null` for missing data points in a series to maintain the X-axis alignment without breaking the line.

### Unknown: Chart.js 4.x compatibility in Node?
- **Resolved**: `chartjs-node-canvas` requires registering components (CategoryScale, LinearScale, etc.). This is already correctly implemented in `graph-reporter.ts`.

## Alignment with docs/research.md
- **Parameter 1**: SCS Progression -> Tracked via commit timestamps and branch metadata.
- **Parameter 2**: Latency Trend -> p95 across multiple Artillery runs.
- **Parameter 3**: Concurrency Effects -> Throughput (RPS) vs Latency correlation.
- **Parameter 4**: Event Flow -> Eventual consistency lag (Hybrid only) vs Sync response time (Monolith).
