import { Sink } from '../sink';
import { Metrics, MetricType } from '../metrics';

enum NRMetricType {
  Count = 'count',
  Distribution = 'distribution',
  Gauge = 'gauge',
  Summary = 'summary',
  UniqueCount = 'uniqueCount',
}
  
class NRMetric {
  'interval.ms': number;  
  constructor(
    protected readonly name: string,
    protected readonly type: NRMetricType,
    protected readonly value: any = 1,
    protected attributes = {},
    protected timestamp = Date.now(),
  ) {
    this['interval.ms'] = 1;
  }
}

export class NewRelicSink implements Sink {
  constructor(
    protected readonly licenseKey: string,
    protected readonly apiEndpoint = 'https://metric-api.eu.newrelic.com/metric/v1'
  ) {}
  
  async send(metrics: Metrics): Promise<void> {
    const nrMetrics = [];
    for (const metric of metrics) {
      switch (metric.type) {
      case MetricType.Counter:
        nrMetrics.push(new NRMetric(metric.name, NRMetricType.Count, metric.value, metric.metadata));
        break;
      case MetricType.Gauge:
        nrMetrics.push(new NRMetric(metric.name, NRMetricType.Gauge, metric.value, metric.metadata));
        break;
      default:
        console.log(`NewRelicSink does not have support for '${metric.type}' metrics yet`);
      }
    }
  
    // Send the metric to the New Relic Metrics API
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-License-Key': this.licenseKey
      },
      body: JSON.stringify([{ metrics: nrMetrics }])
    });
  
    // Check the response status and throw an error if it's not successful
    if (!response.ok) {
      throw new Error(`Failed to send metrics to New Relic Metrics API: ${response.status} ${response.statusText}`);
    }
  }
}
