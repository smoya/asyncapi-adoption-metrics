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

    await recorder.record(metric);
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toEqual(metric);
    expect(sink.metrics).toHaveLength(0);

    await recorder.flush();
    expect(recorderMetricsSpy).toHaveLength(0);
    expect(sink.metrics).toHaveLength(1);
    expect(sink.metrics[0]).toEqual(metric);
  });

  it('count()', async function() {
    const recorderMetricsSpy = [];
    const recorder = new Recorder('test', new testSink(), recorderMetricsSpy);
    const expectedMetric = new Metric('test.test_metric', MetricType.Counter, 1, { foo: 'bar' });
        
    await recorder.count('test_metric', 1, { foo: 'bar' });
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toEqual(expectedMetric);
  });

  it('gauge()', async function() {
    const recorderMetricsSpy = [];
    const recorder = new Recorder('test', new testSink(), recorderMetricsSpy);
    const expectedMetric = new Metric('test.test_metric', MetricType.Gauge, 937.5551819, { foo: 'bar' });
        
    await recorder.gauge('test_metric', 937.5551819, { foo: 'bar' });
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toEqual(expectedMetric);
  });

  it('recordActionExecution()', async function() {
    const recorderMetricsSpy = [];
    const recorder = new Recorder('test', new testSink(), recorderMetricsSpy);
    const expectedMetric = new Metric('test.action.executed', MetricType.Counter, 1, { action: 'validate', success: true });
    
    await recorder.recordActionExecution('validate', { success: true });
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toEqual(expectedMetric);
  });

  it('WithPeriodicFlushRecorder()', async function() {
    jest.useFakeTimers(); // this mocks setTimeout global function
    const sink = new testSink();
    const recorderMetricsSpy = [];
    const {recorder, stop} = WithPeriodicFlushRecorder(new Recorder('test', sink, recorderMetricsSpy), 100);
    const expectedMetric = new Metric('test.action.executed', MetricType.Counter, 1, { action: 'validate', success: true });
    
    await recorder.recordActionExecution('validate', { success: true });
    expect(recorderMetricsSpy).toHaveLength(1);
    expect(recorderMetricsSpy[0]).toEqual(expectedMetric);

    jest.advanceTimersByTime(200);
    stop();

    expect(sink.calledTimes).toEqual(3);
  });
});
