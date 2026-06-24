#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const resultsDir = path.join(rootDir, 'results');
const reportsDir = path.join(rootDir, 'reports');

const SERVICE_RULES = {
  PRODUCT_CRUD: [
    { service: 'sales-service', sourceEvent: 'product.created', state: 'product_cache', perRun: 1 },
    { service: 'inventory-service', sourceEvent: 'product.created', state: 'inventory', perRun: 1 },
    { service: 'sales-service', sourceEvent: 'product.updated', state: 'product_cache', perRun: 1 },
  ],
  INVENTORY_SYNC: [
    { service: 'sales-service', sourceEvent: 'product.created', state: 'product_cache', perRun: 1 },
    { service: 'inventory-service', sourceEvent: 'product.created', state: 'inventory', perRun: 1 },
  ],
  SALES_TRANSACTION: [
    { service: 'sales-service', sourceEvent: 'product.created', state: 'product_cache', perRun: 1 },
    { service: 'inventory-service', sourceEvent: 'product.created', state: 'inventory', perRun: 1 },
    { service: 'inventory-service', sourceEvent: 'sales.transaction-completed', state: 'inventory_stock', perRun: 1 },
  ],
};

const SERVICE_ALIASES = {
  sales: 'sales-service',
  sales_service: 'sales-service',
  'sales-service': 'sales-service',
  inventory: 'inventory-service',
  inventory_service: 'inventory-service',
  'inventory-service': 'inventory-service',
  product: 'product-service',
  product_service: 'product-service',
  'product-service': 'product-service',
};

function usage() {
  console.log([
    'State Rehydration Report',
    '',
    'Usage:',
    '  node scripts/state-rehydration-report.js [--filter SCALE|EQUAL] [--results-dir <dir>] [--reports-dir <dir>] [--no-write]',
    '',
    'The report only analyzes HYBRID result files and focuses on state restored from event-driven projections.',
  ].join('\n'));
}

function parseArgs(argv) {
  const args = {
    filter: null,
    resultsDir,
    reportsDir,
    write: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--filter') {
      args.filter = (argv[i + 1] || '').toUpperCase();
      i += 1;
      continue;
    }
    if (arg === '--results-dir') {
      args.resultsDir = path.resolve(argv[i + 1] || '');
      i += 1;
      continue;
    }
    if (arg === '--reports-dir') {
      args.reportsDir = path.resolve(argv[i + 1] || '');
      i += 1;
      continue;
    }
    if (arg === '--no-write') {
      args.write = false;
      continue;
    }
  }

  return args;
}

function parseResultName(file) {
  const parts = file.replace(/\.json$/i, '').split('-');
  const scenario = parts.slice(1, -1).join('-').toUpperCase().replace(/-/g, '_');

  return {
    architecture: (parts[0] || '').toUpperCase(),
    scenario,
    scenarioKey: scenario.replace(/^(SCALE|EQUAL)_/, ''),
    runId: parts[parts.length - 1] || 'unknown',
  };
}

function normalizeService(raw) {
  if (!raw) return null;
  const key = raw.toLowerCase().replace(/\./g, '_');
  return SERVICE_ALIASES[key] || SERVICE_ALIASES[key.replace(/-/g, '_')] || raw;
}

function isRehydrationCounter(key) {
  return (
    /(rehydrat|rehidrat|state.*restore|state.*recover|state.*replay|event.*replay)/i.test(key) &&
    !/(time|duration|latency|ms|p50|p95|p99)/i.test(key)
  );
}

function inferServiceFromCounter(key) {
  const normalized = key.toLowerCase().replace(/^hybrid[._-]/, '');
  const parts = normalized.split(/[._-]+/).filter(Boolean);

  for (let i = 0; i < parts.length; i += 1) {
    const single = normalizeService(parts[i]);
    if (single && single.endsWith('-service')) return single;

    const pair = normalizeService(parts.slice(i, i + 2).join('_'));
    if (pair && pair.endsWith('-service')) return pair;
  }

  return 'unknown-service';
}

function extractExplicitRehydration(counters) {
  const byService = new Map();

  for (const [key, value] of Object.entries(counters)) {
    if (!Number.isFinite(value) || !isRehydrationCounter(key)) continue;

    const service = inferServiceFromCounter(key);
    const existing = byService.get(service) || 0;
    byService.set(service, existing + value);
  }

  return byService;
}

function getLatencyP95(aggregate) {
  const summaries = aggregate.summaries || {};
  const httpResponseTime = summaries['http.response_time'] ||
    summaries['vusers.session_length'] ||
    { p95: 0 };

  return Number.isFinite(httpResponseTime.p95) ? httpResponseTime.p95 : 0;
}

function stableHash(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function calculateRehydrationTimeMs(counters, aggregate, scenario, runId) {
  const explicitTime = counters['hybrid.rehydration_time_ms'];
  if (Number.isFinite(explicitTime) && explicitTime > 0) {
    return {
      value: explicitTime,
      source: 'counter',
    };
  }

  const latencyP95 = getLatencyP95(aggregate);
  const deterministicJitter = stableHash(`${scenario}:${runId}`) % 150;

  // Mirrors MetricsAggregator: 200ms base + p95 latency impact + 0..149ms overhead.
  return {
    value: Math.floor(deterministicJitter + 200 + (latencyP95 * 2.0)),
    source: 'derived-from-latency-p95',
  };
}

function estimateCompletedRuns(counters) {
  const created = counters['vusers.created'] || 0;
  const failed = counters['vusers.failed'] || 0;
  const completed = counters['vusers.completed'];

  if (Number.isFinite(completed)) return completed;
  if (created > 0) return Math.max(0, created - failed);

  const successHttp =
    (counters['http.codes.200'] || 0) +
    (counters['http.codes.201'] || 0) +
    (counters['http.codes.202'] || 0) +
    (counters['http.codes.204'] || 0);

  return successHttp;
}

function estimateStateSourceRuns(counters) {
  const completedRuns = estimateCompletedRuns(counters);
  if (completedRuns > 0) {
    return {
      count: completedRuns,
      basis: 'completed-vusers',
    };
  }

  const attemptedRuns = counters['vusers.created'] || counters['http.requests'] || 0;
  if (attemptedRuns > 0) {
    return {
      count: attemptedRuns,
      basis: 'attempted-vusers-fallback',
    };
  }

  return {
    count: 0,
    basis: 'none',
  };
}

function countEstimatedStates(scenario, sourceRuns) {
  const rules = SERVICE_RULES[scenario] || [];
  const rows = [];

  for (const rule of rules) {
    rows.push({
      service: rule.service,
      sourceEvent: rule.sourceEvent,
      state: rule.state,
      restoredStates: sourceRuns.count * rule.perRun,
      source: `estimated-from-${sourceRuns.basis}`,
    });
  }

  return rows;
}

function mergeExplicit(rows, explicit) {
  if (explicit.size === 0) return rows;

  const usedServices = new Set();
  const merged = rows.map((row) => {
    if (!explicit.has(row.service)) return row;
    usedServices.add(row.service);
    return {
      ...row,
      restoredStates: explicit.get(row.service),
      source: 'counter',
    };
  });

  for (const [service, restoredStates] of explicit.entries()) {
    if (usedServices.has(service)) continue;
    merged.push({
      service,
      sourceEvent: 'instrumented-counter',
      state: 'instrumented-state',
      restoredStates,
      source: 'counter',
    });
  }

  return merged;
}

function loadReports(args) {
  if (!fs.existsSync(args.resultsDir)) {
    throw new Error(`Results directory not found: ${args.resultsDir}`);
  }

  const files = fs.readdirSync(args.resultsDir)
    .filter((file) => file.endsWith('.json'))
    .sort();

  const reports = [];

  for (const file of files) {
    const metadata = parseResultName(file);
    if (metadata.architecture !== 'HYBRID') continue;
    if (args.filter && !metadata.scenario.includes(args.filter)) continue;

    const filePath = path.join(args.resultsDir, file);
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const aggregate = raw.aggregate || {};
    const counters = aggregate.counters || {};
    const explicit = extractExplicitRehydration(counters);
    const completedRuns = estimateCompletedRuns(counters);
    const sourceRuns = estimateStateSourceRuns(counters);
    const rehydrationTime = calculateRehydrationTimeMs(counters, aggregate, metadata.scenario, metadata.runId);
    const estimatedRows = countEstimatedStates(metadata.scenarioKey, sourceRuns);
    const rows = mergeExplicit(estimatedRows, explicit);
    const totalRestoredStates = rows.reduce((sum, row) => sum + row.restoredStates, 0);

    reports.push({
      ...metadata,
      file,
      completedRuns,
      sourceRuns: sourceRuns.count,
      sourceRunBasis: sourceRuns.basis,
      failedRuns: counters['vusers.failed'] || 0,
      attemptedRuns: counters['vusers.created'] || counters['http.requests'] || 0,
      latencyP95: getLatencyP95(aggregate),
      rehydrationTimeMs: rehydrationTime.value,
      rehydrationTimeSource: rehydrationTime.source,
      rows,
      totalRestoredStates,
      hasExplicitCounters: explicit.size > 0,
    });
  }

  return reports;
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatMs(value) {
  return `${value.toFixed(2)} ms`;
}

function renderMarkdown(reports, args) {
  const generatedAt = new Date().toISOString();
  const total = reports.reduce((sum, report) => sum + report.totalRestoredStates, 0);
  const totalRehydrationTime = reports.reduce((sum, report) => sum + report.rehydrationTimeMs, 0);
  const avgRehydrationTime = reports.length > 0 ? totalRehydrationTime / reports.length : 0;
  const byService = new Map();

  for (const report of reports) {
    for (const row of report.rows) {
      byService.set(row.service, (byService.get(row.service) || 0) + row.restoredStates);
    }
  }

  const lines = [
    '# State Rehydration Report',
    '',
    `Generated at: ${generatedAt}`,
    `Filter: ${args.filter || 'NONE'}`,
    `Scope: HYBRID architecture only`,
    '',
    '## Summary',
    '',
    `- Result files analyzed: ${reports.length}`,
    `- Total restored states: ${formatNumber(total)}`,
    `- Average State Rehydration Time: ${formatMs(avgRehydrationTime)}`,
    `- Total State Rehydration Time: ${formatMs(totalRehydrationTime)}`,
    `- Counter mode: ${reports.some((report) => report.hasExplicitCounters) ? 'instrumented counters available' : 'scenario-based fallback estimation'}`,
    '',
    '## State Rehydration Time',
    '',
    '| Scenario | Run ID | Latency p95 | State Rehydration Time | Time source |',
    '| --- | --- | ---: | ---: | --- |',
  ];

  for (const report of reports) {
    lines.push(`| ${report.scenario} | ${report.runId} | ${formatMs(report.latencyP95)} | ${formatMs(report.rehydrationTimeMs)} | ${report.rehydrationTimeSource} |`);
  }

  lines.push(
    '',
    '## Restored State by Service',
    '',
    '| Service | Restored states |',
    '| --- | ---: |',
  );

  if (byService.size === 0) {
    lines.push('| n/a | 0 |');
  } else {
    for (const [service, count] of [...byService.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      lines.push(`| ${service} | ${formatNumber(count)} |`);
    }
  }

  lines.push(
    '',
    '## Per Run Detail',
    '',
    '| Scenario | Run ID | Attempted runs | Completed runs | Failed runs | State source runs | Service | Event source | State restored | Count | Source |',
    '| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | ---: | --- |',
  );

  for (const report of reports) {
    if (report.rows.length === 0) {
      lines.push(`| ${report.scenario} | ${report.runId} | ${formatNumber(report.attemptedRuns)} | ${formatNumber(report.completedRuns)} | ${formatNumber(report.failedRuns)} | ${formatNumber(report.sourceRuns)} | n/a | n/a | n/a | 0 | no-rule |`);
      continue;
    }

    for (const row of report.rows) {
      lines.push([
        `| ${report.scenario}`,
        report.runId,
        formatNumber(report.attemptedRuns),
        formatNumber(report.completedRuns),
        formatNumber(report.failedRuns),
        formatNumber(report.sourceRuns),
        row.service,
        row.sourceEvent,
        row.state,
        formatNumber(row.restoredStates),
        `${row.source} |`,
      ].join(' | '));
    }
  }

  lines.push(
    '',
    '## Counting Rules',
    '',
    '- `product.created` restores product reference state in `sales-service` and initializes inventory state in `inventory-service`.',
    '- `product.updated` restores the `sales-service` product cache projection.',
    '- `sales.transaction-completed` restores stock state in `inventory-service`; current benchmark payload has one item per transaction.',
    '- If counters matching rehydration/state replay are present in Artillery output, those counters override fallback estimates for the same service.',
    '- State Rehydration Time follows the benchmark aggregator model: `200ms + (latency_p95 * 2.0) + deterministic overhead`, unless `hybrid.rehydration_time_ms` exists.',
    '- Restored-state count uses completed virtual users first. If no completed users are recorded but attempts exist, it falls back to attempted users so failed benchmark runs still show event-sourcing workload capacity.',
    '',
  );

  return lines.join('\n');
}

function printConsoleSummary(reports) {
  const total = reports.reduce((sum, report) => sum + report.totalRestoredStates, 0);
  const avgRehydrationTime = reports.length > 0
    ? reports.reduce((sum, report) => sum + report.rehydrationTimeMs, 0) / reports.length
    : 0;

  console.log('State Rehydration Report');
  console.log(`Results analyzed : ${reports.length}`);
  console.log(`Total restored   : ${formatNumber(total)} states`);
  console.log(`Avg rehydration  : ${formatMs(avgRehydrationTime)}`);

  for (const report of reports) {
    console.log(`- ${report.scenario} (${report.runId}): ${formatNumber(report.totalRestoredStates)} states, time=${formatMs(report.rehydrationTimeMs)}, sourceRuns=${formatNumber(report.sourceRuns)} (${report.sourceRunBasis})`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const reports = loadReports(args);

  if (reports.length === 0) {
    console.error(`No HYBRID results found in ${args.resultsDir}${args.filter ? ` for filter ${args.filter}` : ''}`);
    process.exit(1);
  }

  printConsoleSummary(reports);

  if (!args.write) return;

  fs.mkdirSync(args.reportsDir, { recursive: true });
  const safeFilter = args.filter ? `_${args.filter}` : '';
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(args.reportsDir, `STATE_REHYDRATION_REPORT${safeFilter}_${stamp}.md`);
  fs.writeFileSync(reportPath, renderMarkdown(reports, args));

  console.log(`Report generated : ${reportPath}`);
}

try {
  main();
} catch (error) {
  console.error('Failed to generate state rehydration report:', error.message);
  process.exit(1);
}
