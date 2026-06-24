import { MetricsAggregator } from '../src/metrics/aggregator';
import { Architecture } from '../src/metrics/types';

describe('MetricsAggregator', () => {
  let aggregator: MetricsAggregator;

  beforeEach(() => {
    aggregator = new MetricsAggregator();
  });

  it('should aggregate monolith and hybrid results for the same scenario', () => {
    const results = [
      {
        runId: '1',
        architecture: Architecture.MONOLITH,
        scenario: 'PRODUCT_CRUD',
        startTime: '2026-03-31T00:00:00Z',
        endTime: '2026-03-31T00:01:00Z',
        metrics: {
          throughput: 100,
          latency_p50: 50,
          latency_p95: 100,
          latency_p99: 150,
          success_rate: 1,
          failure_rate: 0
        },
        devMetrics: { lead_time_min: 0, commit_count: 0, lines_changed: 0, churn_ratio: 0 }
      },
      {
        runId: '2',
        architecture: Architecture.HYBRID,
        scenario: 'PRODUCT_CRUD',
        startTime: '2026-03-31T00:02:00Z',
        endTime: '2026-03-31T00:03:00Z',
        metrics: {
          throughput: 80,
          latency_p50: 100,
          latency_p95: 200,
          latency_p99: 300,
          success_rate: 0.9,
          failure_rate: 10
        },
        devMetrics: { lead_time_min: 0, commit_count: 0, lines_changed: 0, churn_ratio: 0 }
      }
    ];

    const aggregated = aggregator.aggregate(results as any);
    expect(aggregated.length).toBe(1);
    expect(aggregated[0].scenario).toBe('PRODUCT_CRUD');
    expect(aggregated[0].monolith.throughput).toBe(100);
    expect(aggregated[0].hybrid.throughput).toBe(80);
    expect(aggregated[0].hybrid.failure_rate).toBe(10);
  });

  it('should keep raw performance metrics deterministic without synthetic scaling', () => {
    const results = [
      {
        runId: '1',
        architecture: Architecture.MONOLITH,
        scenario: 'SCALE-PRODUCT_CRUD',
        startTime: '2026-03-31T00:00:00Z',
        endTime: '2026-03-31T00:01:00Z',
        metrics: {
          throughput: 12.5,
          latency_p50: 80,
          latency_p95: 400,
          latency_p99: 900,
          success_rate: 0.72,
          failure_rate: 28
        },
        devMetrics: { lead_time_min: 0, commit_count: 0, lines_changed: 0, churn_ratio: 0 }
      },
      {
        runId: '2',
        architecture: Architecture.HYBRID,
        scenario: 'SCALE-PRODUCT_CRUD',
        startTime: '2026-03-31T00:02:00Z',
        endTime: '2026-03-31T00:03:00Z',
        metrics: {
          throughput: 180.2,
          latency_p50: 18,
          latency_p95: 55,
          latency_p99: 120,
          success_rate: 0.998,
          failure_rate: 0.2
        },
        devMetrics: { lead_time_min: 0, commit_count: 0, lines_changed: 0, churn_ratio: 0 }
      }
    ];

    const first = aggregator.aggregate(results as any)[0];
    const second = aggregator.aggregate(results as any)[0];

    expect(first.monolith.throughput).toBe(12.5);
    expect(first.monolith.latency_p95).toBe(400);
    expect(first.monolith.success_rate).toBe(0.72);
    expect(first.hybrid.throughput).toBe(180.2);
    expect(first.hybrid.latency_p95).toBe(55);
    expect(first.hybrid.success_rate).toBe(0.998);
    expect(second).toEqual(first);
  });
});
