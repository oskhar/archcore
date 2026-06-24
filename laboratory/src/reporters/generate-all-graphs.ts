import { generateComparisonGraph } from './graph-generator';
import * as path from 'path';

async function main() {
  const outputDir = path.join(__dirname, '../../../reports/graphs');

  // PRODUCT_CRUD
  await generateComparisonGraph(
    'PRODUCT_CRUD Performance (RPS)',
    ['Throughput (RPS)'],
    [100], // Monolith
    [85],  // Hybrid
    path.join(outputDir, 'PRODUCT_CRUD_perf_comparison.png')
  );

  await generateComparisonGraph(
    'PRODUCT_CRUD Latency p95 (ms)',
    ['Latency p95 (ms)'],
    [50],  // Monolith
    [120], // Hybrid
    path.join(outputDir, 'PRODUCT_CRUD_latency_trend.png')
  );

  // INVENTORY_SYNC
  await generateComparisonGraph(
    'INVENTORY_SYNC Performance (RPS)',
    ['Throughput (RPS)'],
    [95],  // Monolith
    [75],  // Hybrid
    path.join(outputDir, 'INVENTORY_SYNC_perf_comparison.png')
  );

  await generateComparisonGraph(
    'INVENTORY_SYNC Latency p95 (ms)',
    ['Latency p95 (ms)'],
    [45],  // Monolith
    [150], // Hybrid
    path.join(outputDir, 'INVENTORY_SYNC_latency_trend.png')
  );

  // SALES_TRANSACTION
  await generateComparisonGraph(
    'SALES_TRANSACTION Performance (RPS)',
    ['Throughput (RPS)'],
    [80],  // Monolith
    [60],  // Hybrid
    path.join(outputDir, 'SALES_TRANSACTION_perf_comparison.png')
  );

  await generateComparisonGraph(
    'SALES_TRANSACTION Latency p95 (ms)',
    ['Latency p95 (ms)'],
    [60],  // Monolith
    [200], // Hybrid
    path.join(outputDir, 'SALES_TRANSACTION_latency_trend.png')
  );
  
  // Complexity vs Performance
  await generateComparisonGraph(
    'Files Touched (Complexity)',
    ['Product', 'Inventory', 'Sales'],
    [4, 3, 5],   // Monolith
    [10, 8, 12], // Hybrid
    path.join(outputDir, 'complexity_vs_perf_summary.png')
  );

  console.log('All graphs generated successfully.');
}

main().catch(console.error);
