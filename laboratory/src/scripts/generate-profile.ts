import * as fs from 'fs';
import * as path from 'path';

interface MetricPoint {
  load: number;
  throughput: number;
  p50: number;
  p95: number;
  p99: number;
  successRate: number;
}

interface AggregatedPoint extends MetricPoint {
  architecture: string;
  status: 'healthy' | 'degrading' | 'critical';
}

function computeStatus(p: MetricPoint): 'healthy' | 'degrading' | 'critical' {
  if (p.successRate < 0.95 || p.p95 > 5 * p.p50) return 'critical';
  if (p.successRate < 0.99 || p.p95 > 2 * p.p50) return 'degrading';
  return 'healthy';
}

async function run() {
  const resultsDir = path.join(__dirname, '../../results');
  const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json'));

  const dataset: Record<string, Record<number, MetricPoint[]>> = {
    'HYBRID': {},
    'MONOLITH': {}
  };

  const reqPerScenario: Record<string, number> = {
    'PRODUCT_CRUD': 4,
    'INVENTORY_SYNC': 5,
    'SALES_TRANSACTION': 5
  };

  for (const file of files) {
    const filePath = path.join(resultsDir, file);
    let content;
    try {
        content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) { continue; }
    
    const parts = file.replace('.json', '').split('-');
    const arch = parts[0].toUpperCase();
    if (arch !== 'HYBRID' && arch !== 'MONOLITH') continue;

    const scenario = parts.slice(1, -1).join('_').toUpperCase();
    const reqs = reqPerScenario[scenario] || 4;

    if (!content.intermediate) continue;

    for (const entry of content.intermediate) {
      const vusers = entry.counters['vusers.created'] || 0;
      if (vusers === 0) continue;

      const rawTargetRps = (vusers / 10) * reqs;
      const targetRps = Math.round(rawTargetRps / 5) * 5;
      if (targetRps === 0) continue;
      
      const summaries = entry.summaries || {};
      const responseTime = summaries['http.response_time'] || { p50: 0, p95: 0, p99: 0 };
      const counters = entry.counters || {};
      const okCount = (counters['http.codes.200'] || 0) + (counters['http.codes.201'] || 0);
      const totalCount = (counters['http.requests'] || 0);
      if (totalCount === 0) continue;
      
      const point: MetricPoint = {
        load: targetRps,
        throughput: totalCount / 10,
        p50: responseTime.p50 || 0,
        p95: responseTime.p95 || 0,
        p99: responseTime.p99 || 0,
        successRate: okCount / totalCount
      };

      if (!dataset[arch][targetRps]) dataset[arch][targetRps] = [];
      dataset[arch][targetRps].push(point);
    }
  }

  const finalized: AggregatedPoint[] = [];
  const loadPointsSet = new Set<number>();

  for (const arch of Object.keys(dataset)) {
    for (const loadStr of Object.keys(dataset[arch])) {
      const load = parseInt(loadStr);
      loadPointsSet.add(load);
      const points = dataset[arch][load];
      
      const avg: MetricPoint = {
        load,
        throughput: points.reduce((a, b) => a + b.throughput, 0) / points.length,
        p50: points.reduce((a, b) => a + b.p50, 0) / points.length,
        p95: points.reduce((a, b) => a + b.p95, 0) / points.length,
        p99: points.reduce((a, b) => a + b.p99, 0) / points.length,
        successRate: points.reduce((a, b) => a + b.successRate, 0) / points.length
      };

      finalized.push({
        ...avg,
        architecture: arch,
        status: computeStatus(avg)
      });
    }
  }

  const sortedLoadPoints = Array.from(loadPointsSet).sort((a, b) => a - b);
  const architectures = ['MONOLITH', 'HYBRID'];

  let output = '# Architectural Performance Profile\n\n';

  const initBlock = `%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'xyChartBackground': '#ffffff', 'plotColorPalette': '#4CAF50, #81C784, #A5D6A7, #2196F3, #64B5F6, #90CAF9' } } }%%\n`;

  // --- Latency Chart ---
  output += '## Latency vs Load (ms)\n\n';
  output += '```mermaid\n' + initBlock + 'xychart-beta\n';
  output += `    title "Latency vs Load (ms)"\n`;
  output += `    x-axis [${sortedLoadPoints.join(', ')}]\n`;
  output += `    y-axis "Latency (ms)"\n`;
  
  // Monolith Greens
  output += `    line "Mono P50" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'MONOLITH')?.p50 || 0).toFixed(0)).join(', ')}]\n`;
  output += `    line "Mono P95" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'MONOLITH')?.p95 || 0).toFixed(0)).join(', ')}]\n`;
  output += `    line "Mono P99" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'MONOLITH')?.p99 || 0).toFixed(0)).join(', ')}]\n`;
  
  // Hybrid Blues
  output += `    line "Hyb P50" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'HYBRID')?.p50 || 0).toFixed(0)).join(', ')}]\n`;
  output += `    line "Hyb P95" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'HYBRID')?.p95 || 0).toFixed(0)).join(', ')}]\n`;
  output += `    line "Hyb P99" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'HYBRID')?.p99 || 0).toFixed(0)).join(', ')}]\n`;
  output += '```\n\n';

  // --- Throughput Chart ---
  output += '## Throughput vs Load (RPS)\n\n';
  output += '```mermaid\n' + `%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'plotColorPalette': '#4CAF50, #2196F3' } } }%%\n` + 'xychart-beta\n';
  output += `    title "Throughput vs Load (RPS)"\n`;
  output += `    x-axis [${sortedLoadPoints.join(', ')}]\n`;
  output += `    y-axis "Throughput (RPS)"\n`;
  output += `    line "MONOLITH" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'MONOLITH')?.throughput || 0).toFixed(1)).join(', ')}]\n`;
  output += `    line "HYBRID" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'HYBRID')?.throughput || 0).toFixed(1)).join(', ')}]\n`;
  output += '```\n\n';

  // --- Success Rate Chart ---
  output += '## Success Rate vs Load\n\n';
  output += '```mermaid\n' + `%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'plotColorPalette': '#4CAF50, #2196F3' } } }%%\n` + 'xychart-beta\n';
  output += `    title "Success Rate vs Load"\n`;
  output += `    x-axis [${sortedLoadPoints.join(', ')}]\n`;
  output += `    y-axis "Rate (0-1)"\n`;
  output += `    line "MONOLITH" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'MONOLITH')?.successRate || 0).toFixed(3)).join(', ')}]\n`;
  output += `    line "HYBRID" [${sortedLoadPoints.map(l => (finalized.find(f => f.load === l && f.architecture === 'HYBRID')?.successRate || 0).toFixed(3)).join(', ')}]\n`;
  output += '```\n\n';

  output += '## Performance Metrics Detail\n\n';
  output += '| Load | Arch | Throughput | P50 | P95 | P99 | Success | Status |\n';
  output += '|------|------|------------|-----|-----|-----|---------|--------|\n';

  for (const load of sortedLoadPoints) {
    for (const arch of architectures) {
      const p = finalized.find(f => f.load === load && f.architecture === arch);
      if (p) {
        output += `| ${load} | ${arch} | ${p.throughput.toFixed(1)} | ${p.p50.toFixed(1)} | ${p.p95.toFixed(1)} | ${p.p99.toFixed(1)} | ${(p.successRate * 100).toFixed(1)}% | ${p.status} |\n`;
      }
    }
  }

  output += '\n## Degradation Analysis\n\n';
  for (const arch of architectures) {
    output += `### ${arch} Observations\n`;
    const archPoints = finalized.filter(f => f.architecture === arch).sort((a,b) => a.load - b.load);
    let found = false;
    for (let i = 1; i < archPoints.length; i++) {
        const prev = archPoints[i-1];
        const curr = archPoints[i];
        
        if (curr.p95 > prev.p95 * 2) {
            output += `- **Non-linear Latency Increase**: Jump at load ${curr.load} (P95: ${prev.p95.toFixed(1)}ms -> ${curr.p95.toFixed(1)}ms).\n`;
            found = true;
        }
        if (curr.throughput < prev.throughput * 0.9 && curr.load > prev.load) {
            output += `- **Throughput Degradation**: Dropped at load ${curr.load} despite higher target.\n`;
            found = true;
        }
        if (curr.successRate < 0.99 && prev.successRate >= 0.99) {
            output += `- **Reliability Threshold**: Success rate fell below 99% at load ${curr.load}.\n`;
            found = true;
        }
    }
    if (!found) output += '- No significant degradation detected in this range.\n';
  }

  process.stdout.write(output);
}

run().catch(console.error);
