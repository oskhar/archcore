# Interface Contracts: POS Benchmark Laboratory

## MetricsAggregator
```typescript
interface IMetricsAggregator {
  /**
   * Loads and aggregates benchmark results from the local results directory.
   * Performs data validation to prune incomplete datasets.
   */
  aggregate(results: LabResult[]): AggregatedResult[];

  /**
   * Queries git history to extract SCS-specific development metrics.
   * @param architecture Filter by architectural domain
   */
  getGitMetrics(architecture: Architecture): DevMetricSet;
}
```

## GraphReporter
```typescript
interface IGraphReporter {
  /**
   * Generates a high-resolution PNG chart from a Chart.js configuration.
   * @param name Output filename (without extension)
   * @param configuration Valid Chart.js configuration object
   * @returns Absolute path to the generated file
   */
  generateGraph(name: string, configuration: ChartConfiguration): Promise<string>;

  /**
   * Standardized chart configuration factories.
   * All configurations must include legends, titles, and Y-axis labels.
   */
  getTrendConfig(scenario: string, labels: string[], monolith: number[], hybrid: number[], metric: string): ChartConfiguration;
  getDualAxisTrendConfig(scenario: string, labels: string[], latency: number[], throughput: number[]): ChartConfiguration;
  getComplexityProgressionConfig(labels: string[], monolithLoc: number[], hybridLoc: number[]): ChartConfiguration;
}
```

## LabResultLoader
```typescript
interface ILabResultLoader {
  /**
   * Synchronously reads Artillery JSON results from the disk.
   * Validates structure against ArtilleryOutputSchema.
   */
  loadResults(): LabResult[];
}
```
