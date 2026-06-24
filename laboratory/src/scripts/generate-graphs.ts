import { ResultsLoader } from '../metrics/loader';
import { GraphReporter } from '../reporters/graph-reporter';
import { Architecture } from '../metrics/types';
import * as path from 'path';

async function generate() {
  const resultsDir = path.join(__dirname, '../../results');
  const reportsDir = path.join(__dirname, '../../reports/graphs');
  
  const loader = new ResultsLoader(resultsDir);
  const reporter = new GraphReporter(reportsDir);

  console.log('Generating standalone benchmark graphs...');
  
  const results = loader.loadResults();
  if (results.length === 0) {
    console.warn('No results found in', resultsDir);
    return;
  }

  const scenarios = Array.from(new Set(results.map(r => r.scenario)));

  for (const scenario of scenarios) {
    const scenarioResults = results.filter(r => r.scenario === scenario);
    const monolith = scenarioResults.filter(r => r.architecture === Architecture.MONOLITH);
    const hybrid = scenarioResults.filter(r => r.architecture === Architecture.HYBRID);

    if (monolith.length > 0 && hybrid.length > 0) {
      const monoAvg = monolith[0].metrics; // Simplify for standalone
      const hybAvg = hybrid[0].metrics;

      await reporter.generateGraph(
        `${scenario}_throughput_standalone`,
        reporter.getComparisonConfig(scenario, 'Throughput (RPS)', monoAvg.throughput, hybAvg.throughput)
      );
      
      await reporter.generateGraph(
        `${scenario}_latency_standalone`,
        reporter.getComparisonConfig(scenario, 'Latency p95 (ms)', monoAvg.latency_p95, hybAvg.latency_p95)
      );
    }
  }

  console.log('Graphs generated successfully in', reportsDir);
}

generate().catch(console.error);
