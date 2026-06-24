import { ResultsLoader } from '../metrics/loader';
import { TradeoffReporter } from '../reporters/tradeoff-reporter';
import * as path from 'path';

async function generate() {
  const args = process.argv.slice(2);
  const filterIndex = args.indexOf('--filter');
  const filter = filterIndex !== -1 ? args[filterIndex + 1].toUpperCase() : null;

  const resultsDir = path.join(__dirname, '../../results');
  const reportsDir = path.join(__dirname, '../../reports');
  
  const loader = new ResultsLoader(resultsDir);
  const reporter = new TradeoffReporter(reportsDir, { filter });

  console.log(`Generating Tradeoff & ROI Benchmark Report (Filter: ${filter || 'NONE'})...`);
  
  let results = loader.loadResults();
  if (filter) {
    results = results.filter(r => r.scenario.includes(filter));
  }

  if (results.length === 0) {
    console.error('No results found in', resultsDir, filter ? `for filter ${filter}` : '');
    process.exit(1);
  }

  const reportPath = await reporter.generateReport(results, filter);

  console.log(`Tradeoff Report generated successfully at ${reportPath}`);
}

generate().catch(console.error);
