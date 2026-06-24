import { ResultsLoader } from '../metrics/loader';
import { GraphReporter } from '../reporters/graph-reporter';
import { AutomatedReporter } from '../reporters/automated-reporter';
import { TraceabilityLogger } from '../reporters/traceability-logger';
import { MetricsAggregator } from '../metrics/aggregator';
import * as path from 'path';

async function generate() {
  const args = process.argv.slice(2);
  const highRes = args.includes('--high-res');
  const includeScs = !args.includes('--no-scs');

  const filterIndex = args.indexOf('--filter');
  const filter = filterIndex !== -1 ? args[filterIndex + 1].toUpperCase() : null;

  const resultsDir = path.join(__dirname, '../../results');
  const reportsDir = path.join(__dirname, '../../reports');
  const graphsDir = path.join(reportsDir, 'graphs');
  
  const loader = new ResultsLoader(resultsDir);
  const graphReporter = new GraphReporter(graphsDir);
  const reporter = new AutomatedReporter(reportsDir, graphReporter, { highRes, includeScs });
  const traceLogger = new TraceabilityLogger(reportsDir);
  const aggregator = new MetricsAggregator();

  console.log(`Generating refined comparative benchmark report (High-Res: ${highRes}, SCS/Complexity: ${includeScs}, Filter: ${filter || 'NONE'})...`);
  if (includeScs) {
    console.log(`Analyzing GitHub development type space and structural complexity...`);
  }
  
  let results = loader.loadResults();
  if (filter) {
    results = results.filter(r => r.scenario.includes(filter));
  }

  if (results.length === 0) {
    console.error('No results found in', resultsDir, filter ? `for filter ${filter}` : '');
    process.exit(1);
  }

  const reportPath = await reporter.generateReport(results, filter);
  const aggregated = aggregator.aggregate(results);
  traceLogger.logTraceability(aggregated);

  console.log(`Report generated successfully at ${reportPath}`);
}

generate().catch(console.error);
