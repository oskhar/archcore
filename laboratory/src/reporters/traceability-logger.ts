import * as fs from 'fs';
import * as path from 'path';
import { AggregatedResult } from '../metrics/types';

export class TraceabilityLogger {
  constructor(private readonly reportsDir: string) {}

  public logTraceability(results: AggregatedResult[]): string {
    const tracePath = path.join(this.reportsDir, 'BENCHMARK_REPORT_TRACE.md');
    let content = `# Benchmark Traceability Log\n\n`;
    content += `This log maps each aggregated graph node back to its raw Artillery JSON source file.\n\n`;

    for (const entry of results) {
      content += `## Scenario: ${entry.scenario}\n\n`;
      content += `- **Monolith Source**: \`monolith-${entry.scenario.toLowerCase()}-${entry.metadata.monolithRunId}.json\`\n`;
      content += `- **Hybrid Source**: \`hybrid-${entry.scenario.toLowerCase()}-${entry.metadata.hybridRunId}.json\`\n`;
      content += `- **Aggregation Time**: ${entry.metadata.timestamp}\n\n`;
    }

    fs.writeFileSync(tracePath, content);
    return tracePath;
  }
}
