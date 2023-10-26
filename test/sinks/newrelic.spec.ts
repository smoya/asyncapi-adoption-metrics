import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { NewRelicSink } from '../../src/sinks/newrelic';
import { Metric, MetricType } from '../../src/metrics';

describe('Recorder', function() {
  it('Sends metrics to New Relic - Response OK', async function() {
    enableFetchMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01')); // 1672531200000
    
    fetchMock.mockResponseOnce(JSON.stringify({requestId: 'f0e7bfff-001a-b000-0000-01682bcf4565'}), {status: 202, headers: { 'Content-Type': 'application/json; charset=UTF-8' }});
    
    const sink = new NewRelicSink('FAKE_LICENSE_KEY', 'https://newrelic.fake');
    const metrics = [
      new Metric('test_metric_one', MetricType.Counter, 1, { test: 'one' }),
      new Metric('test_metric_two', MetricType.Counter, 5, { test: 'two' }),
      new Metric('test_metric_three', MetricType.Gauge, 2876176, { test: 'three' }),
    ];

    const expectedFetchCall = {
      body: JSON.stringify([{metrics: [
        { name: 'test_metric_one', type: 'count', value: 1, attributes: {test: 'one'}, timestamp: 1672531200000, 'interval.ms': 1 },
        { name: 'test_metric_two', type: 'count', value: 5, attributes: {test: 'two'}, timestamp: 1672531200000, 'interval.ms': 1 },
        { name: 'test_metric_three', type: 'gauge', value: 2876176, attributes: {test: 'three'}, timestamp: 1672531200000, 'interval.ms': 1 }
      ]}]),
      headers: {
        'Content-Type': 'application/json', 
        'X-License-Key': 'FAKE_LICENSE_KEY'
      },
      method: 'POST'
    };

    await sink.send(metrics);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual('https://newrelic.fake');
    expect(fetchMock.mock.calls[0][1]).toEqual(expectedFetchCall);
  });

  it('Sends metrics to New Relic - Response KO', async function() {
    enableFetchMocks();
    fetchMock.mockResponseOnce('', { status: 400 });
    const sink = new NewRelicSink('', 'https://newrelic.fake');
    expect(async () => {await sink.send([]);}).rejects.toThrowError('Failed to send metrics to New Relic Metrics API: 400 Bad Request');
  });
});
