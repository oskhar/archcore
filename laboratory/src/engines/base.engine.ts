import { LabResult, Architecture, MetricSet } from '../metrics/types';

export abstract class LaboratoryEngine {
  protected abstract architecture: Architecture;

  constructor(protected readonly scenarioPath: string) {}

  public abstract run(): Promise<LabResult>;

  protected async executeScenario(path: string): Promise<any> {
    // In a real implementation, this would call artillery or a custom driver
    console.log(`Executing scenario ${path} for ${this.architecture}`);
    return {};
  }

  protected abstract collectMetrics(): Promise<MetricSet>;
}
