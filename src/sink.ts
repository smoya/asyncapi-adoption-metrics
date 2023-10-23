import { Metrics } from './metrics';

// Define the MetricSink interface
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
  
// Implement the MetricSink interface for the New Relic Metrics API
export class NewRelicSink implements Sink {
  async send(metrics: Metrics): Promise<void> {
    // TODO convert metrics to New Relic format
    const convertedMetrics = metrics;

    // Send the metric to the New Relic Metrics API
    const response = await fetch('https://metric-api.newrelic.com/metric/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-License-Key': 'YOUR_LICENSE_KEY_HERE'
      },
      body: JSON.stringify({
        metrics: convertedMetrics
      })
    });

    // Check the response status and throw an error if it's not successful
    if (!response.ok) {
      throw new Error(`Failed to send metric to New Relic Metrics API: ${response.status} ${response.statusText}`);
    }
  }
}
