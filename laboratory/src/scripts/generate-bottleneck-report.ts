import { ResultsLoader } from '../metrics/loader';
import { MetricsAggregator } from '../metrics/aggregator';
import { BottleneckReporter } from '../reporters/bottleneck-reporter';
import * as fs from 'fs';
import * as path from 'path';

// ─── Raw Counter Extraction ──────────────────────────────────────────────────
// Membaca langsung dari raw Artillery JSON untuk mendapatkan data ETIMEDOUT
// yang tidak tersedia di LabResult (karena loader.ts hanya mengambil metrics utama)

interface RawCounter {
  etimedout: number;
  totalRequests: number;
  vusersCreated: number;
  vusersCompleted: number;
  vusersFailured: number;
}

function loadRawCounters(resultsDir: string): Map<string, RawCounter> {
  const counters = new Map<string, RawCounter>();

  if (!fs.existsSync(resultsDir)) return counters;

  const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    try {
      const filePath = path.join(resultsDir, file);
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const agg = raw.aggregate || {};
      const rawCounters = (agg.counters || {}) as Record<string, number>;
      const rates = (agg.rates || {}) as Record<string, number>;
      const vusers = agg.vusers || {};

      // Derive key dari nama file: e.g. "hybrid-equal-product_crud-123.json"
      const parts = file.replace('.json', '').split('-');
      // Ambil semua bagian kecuali yang terakhir (runId numerik)
      const keyParts = parts.slice(0, -1); // e.g. ['hybrid', 'equal', 'product_crud']
      const key = keyParts.join('-');      // e.g. "hybrid-equal-product_crud"

      // Ekstrak counters yang dibutuhkan
      const etimedout = rawCounters['errors.ETIMEDOUT'] || 0;
      const totalRequests = rawCounters['http.requests'] || 0;
      const vusersCreated = vusers.created || rawCounters['vusers.created'] || 0;
      const vusersCompleted = vusers.completed || rawCounters['vusers.completed'] || 0;
      const vusersFailured = vusers.failed || rawCounters['vusers.failed'] || 0;

      // Jika ada beberapa file dengan key yang sama (multiple runs), ambil yang paling banyak error
      // sebagai worst-case reference
      const existing = counters.get(key);
      if (!existing || existing.etimedout < etimedout) {
        counters.set(key, {
          etimedout,
          totalRequests,
          vusersCreated,
          vusersCompleted,
          vusersFailured,
        });
      }

      console.log(`  Loaded raw counters: ${key} (ETIMEDOUT: ${etimedout}/${totalRequests})`);
    } catch (err) {
      console.warn(`  Failed to read raw counters from ${file}:`, (err as Error).message);
    }
  }

  return counters;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function generate() {
  const args = process.argv.slice(2);

  const filterIndex = args.indexOf('--filter');
  const filter = filterIndex !== -1 ? args[filterIndex + 1].toUpperCase() : null;

  const resultsDir = path.join(__dirname, '../../results');
  const reportsDir = path.join(__dirname, '../../reports');

  const loader = new ResultsLoader(resultsDir);
  const aggregator = new MetricsAggregator();
  const reporter = new BottleneckReporter(reportsDir);

  console.log(`\n🔬 Bottleneck Report Generator`);
  console.log(`   Results dir : ${resultsDir}`);
  console.log(`   Reports dir : ${reportsDir}`);
  console.log(`   Filter      : ${filter || 'NONE (semua skenario)'}`);
  console.log(`\n📂 Loading raw Artillery counters...`);

  // Load raw ETIMEDOUT counters langsung dari JSON
  const rawCounters = loadRawCounters(resultsDir);
  console.log(`   Loaded ${rawCounters.size} raw counter entries.\n`);

  console.log(`📊 Loading and aggregating LabResults...`);
  let results = loader.loadResults();

  if (filter) {
    results = results.filter(r => r.scenario.includes(filter));
    console.log(`   Filter applied: ${filter} → ${results.length} results`);
  }

  if (results.length === 0) {
    console.error(`\n❌ No results found in ${resultsDir}${filter ? ` for filter "${filter}"` : ''}`);
    process.exit(1);
  }

  console.log(`   Aggregating ${results.length} results...`);
  const aggregated = aggregator.aggregate(results);
  console.log(`   Aggregated into ${aggregated.length} scenario comparisons.\n`);

  console.log(`📝 Generating bottleneck report...`);
  const reportPath = reporter.generateReport(aggregated, rawCounters, filter);

  console.log(`\n✅ Bottleneck report generated successfully:`);
  console.log(`   ${reportPath}\n`);
}

generate().catch(err => {
  console.error('\n❌ Error generating bottleneck report:', err);
  process.exit(1);
});
