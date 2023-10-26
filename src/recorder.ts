import { Sink } from './sink';
import { Metric, MetricType, MetricMetadata } from './metrics';

export class Recorder {
  constructor(
    protected readonly prefix: string = 'asyncapi',
    protected readonly sink: Sink,
    protected metrics: Metric[] = []
  ) {}

  async count(name: string, value = 1, metadata: MetricMetadata = {}) {
    this.record(new Metric(name, MetricType.Counter, value, metadata));
  }

  async gauge(name: string, value: number, metadata: MetricMetadata = {}) {
    this.record(new Metric(name, MetricType.Gauge, value, metadata));
  }
  
  async recordValidateActionExecution(metadata: MetricMetadata = {}) {
    this.recordActionExecution('validate', metadata);
  }

  async recordGenerateActionExecution(metadata: MetricMetadata = {}) {
    this.recordActionExecution('generate', metadata);
  }

  async recordConvertActionExecution(metadata: MetricMetadata = {}) {
    this.recordActionExecution('convert', metadata);
  }

  async recordOptimizeActionExecution(metadata: MetricMetadata = {}) {
    this.recordActionExecution('optimize', metadata);
  }
  
  async recordBundleActionExecution(metadata: MetricMetadata = {}) {
    this.recordActionExecution('bundle', metadata);
  }

  async recordActionExecution(actionName: string, metadata: MetricMetadata = {}) {
    metadata['action'] = actionName;
    this.record(new Metric('action.executed', MetricType.Counter, 1, metadata));
  }

  async record(metric: Metric) {
    metric.name = this.prefix.endsWith('.') ? this.prefix + metric.name : `${ this.prefix }.${ metric.name }`;
    this.metrics.push(metric);
  }

  async flush() {
    await this.sink?.send(this.metrics);
    this.metrics.length = 0; // This way we empty the array without creating a new one. Useful for testing.
  }
}

export function WithPeriodicFlushRecorder(recorder: Recorder, intervalMs: number): {recorder: Recorder, stop: () => Promise<void>} {
  const interval = setInterval(async () => {
    await recorder.flush();
  }, intervalMs);
  
  const onExitFn = async () => {
    clearInterval(interval); 
    await recorder.flush();
  };

  process.on('exit', async () => {
    await onExitFn();
    process.exit(2);
  });
  process.on('SIGINT', async () => {
    await onExitFn();
    process.exit(2);
  });
  process.on('uncaughtException', async () => {
    await onExitFn();
    process.exit(99);
  });

  return {recorder, stop: onExitFn};
}
