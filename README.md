# asyncapi-adoption-metrics
Metrics library for measuring AsyncAPI tooling adoption.

It aids in comprehending how AsyncAPI tools are used and adopted, facilitating ongoing improvements to our specifications and tools. Currently is being used by @asyncapi/cli as a POC and next step will be making use of it on @asyncapi/studio as well.

## Installation
Requires NodeJS v18 or greater.
```bash
npm install @smoya/@asyncapi-adoption-metrics
yarn add @smoya/@asyncapi-adoption-metrics
```

## Usage
The package exposes several classes, from which we can remark:
- class `Metric`:
Used to create an object containing all the properties needed to identify the metrics collected. These properties are:
```ts
  name: string;
  type: MetricType;
  value: any;
  metadata: { [key: string]: any };
```

- class `Recorder`:
Contains all the functions needed to record the different metrics we collect, like:
  - `asyncapi_adoption.action.invoked`:
  With this metric we are tracking any action started (but not finished) in a tool. For example, a command that got executed on the [CLI](https://github.com/asyncapi/cli/) but didn't finish yet. We just want to know which commands are used, regardless they have failed or succeeded.
  ```ts
  async recordActionInvoked(actionName: string, metadata: MetricMetadata = {}) {
    metadata['action'] = actionName;
    this.record(new Metric('action.invoked', MetricType.Counter, 1, metadata));
  }
  ```
  Example where this function is used:
  ```ts
    async init(): Promise<void> {
    await super.init();
    const commandName : string = this.id || '';
    await this.recordActionInvoked(commandName, this.metricsMetadata);
  }
  ```

  - `asyncapi_adoption.action.finished`:
  With this metric we are tracking the action executed once it has already finished, carrying the result of the execution and some metadata.
  ```ts
    async recordActionFinished(actionName: string, metadata: MetricMetadata = {}) {
    metadata['action'] = actionName;
    this.record(new Metric('action.finished', MetricType.Counter, 1, metadata));
  }
  ```
  Example where this function is used:
  ```ts
    async finally(error: Error | undefined): Promise<any> {
    await super.finally(error);
    this.metricsMetadata['success'] = error === undefined;
    await this.recordActionFinished(this.id as string, this.metricsMetadata, this.specFile?.text());
  }
  ```

Utils exposed by the library to operate mainly with the `Sink` interface and the metadata retrieved from the asyncapi files:
```ts
import { MetadataFromDocument, MetricMetadata, Recorder, Sink, StdOutSink } from '@smoya/asyncapi-adoption-metrics';
```

## Examples
Example for [CLI](https://github.com/asyncapi/cli/) `validate` command after being invoked:
```
asyncapi_adoption.action.invoked        COUNTER { action: 'validate' }  1
```

Example of the data collected when the `validate` command has been executed and finished:
```
asyncapi_adoption.action.finished       COUNTER {
  validation_result: 'valid',
  success: true,
  asyncapi_version: '2.6.0',
  asyncapi_servers: 2,
  asyncapi_channels: 4,
  asyncapi_messages: 3,
  asyncapi_operations_send: 3,
  asyncapi_operations_receive: 1,
  asyncapi_schemas: 52,
  action: 'validate'
  }       1
```

## Data storage
We are making use of [New Relic API](https://docs.newrelic.com/docs/apis/intro-apis/introduction-new-relic-apis/#rest-api) to send the metrics collected to the _New Relic_ servers, where they are stored, and finally visualized on our own dashboards at the AsyncAPI website (WIP).

## Data privacy
All the data is anonymized, ensuring no sensitive data reaches our servers.

Every tool making use of this library should provide a mechanism to disable metrics, as you can see [here](https://github.com/asyncapi/cli/blob/master/docs/metrics_collection.md#how-to-disable-tracking).



