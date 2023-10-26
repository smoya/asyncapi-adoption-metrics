import { Metrics } from './metrics';

export interface Sink {
    send(metrics: Metrics): Promise<void>;
}

export class StdOutSink implements Sink {
  async send(metrics: Metrics): Promise<void> {
    metrics.forEach(metric => {
      console.log('%s\t%s\t%O\t%s', metric.name, metric.type.toUpperCase(), metric.metadata, metric.value);
    });
  }
}
