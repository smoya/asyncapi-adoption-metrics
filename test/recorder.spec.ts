import { Metric, MetricType, Metrics } from '../src/metrics';
import { Recorder, WithPeriodicFlushRecorder } from '../src/recorder';
import { Sink } from '../src/sink';

class testSink implements Sink {
  constructor(
        public metrics: Metrics = [],
        public calledTimes: number = 0,
  ) {}
  async send(metrics: Metrics): Promise<void> {
    this.calledTimes++;
    this.metrics.push(...metrics);
  }
}

describe('Recorder', function() {
  it('record() + flush()', async function() {
    const sink = new testSink();
    const recorderMetricsSpy = [];
    const recorder = new Recorder('test', sink, recorderMetricsSpy);
    const metric = new Metric('test_metric', MetricType.Counter, 1, { foo: 'bar' });

    recorder.record(metric);
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toBe(metric);
    expect(sink.metrics).toHaveLength(0);

    await recorder.flush();
    expect(recorderMetricsSpy).toHaveLength(0);
    expect(sink.metrics).toHaveLength(1);
    expect(sink.metrics[0]).toBe(metric);
  });

  it('count()', async function() {
    const recorderMetricsSpy = [];
    const recorder = new Recorder('test', new testSink(), recorderMetricsSpy);
    const expectedMetric = new Metric('test.test_metric', MetricType.Counter, 1, { foo: 'bar' });
        
    recorder.count('test_metric', 1, { foo: 'bar' });
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toEqual(expectedMetric);
  });

  it('gauge()', async function() {
    const recorderMetricsSpy = [];
    const recorder = new Recorder('test', new testSink(), recorderMetricsSpy);
    const expectedMetric = new Metric('test.test_metric', MetricType.Gauge, 937.5551819, { foo: 'bar' });
        
    recorder.gauge('test_metric', 937.5551819, { foo: 'bar' });
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toEqual(expectedMetric);
  });

  it('recordActionExecution()', async function() {
    const recorderMetricsSpy = [];
    const recorder = new Recorder('test', new testSink(), recorderMetricsSpy);
    const expectedMetric = new Metric('test.action.executed', MetricType.Counter, 1, { action: 'validate', success: true });
    
    recorder.recordActionExecution('validate', { success: true });
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toEqual(expectedMetric);
  });

  it('WithPeriodicFlushRecorder()', async function() {
    const sink = new testSink();
    const recorderMetricsSpy = [];
    const {recorder, stop} = WithPeriodicFlushRecorder(new Recorder('test', sink, recorderMetricsSpy), 100);
    const expectedMetric = new Metric('test.action.executed', MetricType.Counter, 1, { action: 'validate', success: true });
    
    recorder.recordActionExecution('validate', { success: true });
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toEqual(expectedMetric);

    await new Promise(f => setTimeout(f, 700));
    stop();

    expect(sink.calledTimes).toBeGreaterThan(3); // Theory: 7 calls. Real: aprox 5 or 6 calls
    expect(sink.calledTimes).toBeLessThan(8); 
  });
});