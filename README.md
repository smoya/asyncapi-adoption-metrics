# asyncapi-adoption-metrics
Metrics library for measuring AsyncAPI tooling adoption.

It aids in comprehending how AsyncAPI tools are used and adopted, facilitating ongoing improvements to our specifications and tools. Currently is being used by @asyncapi/cli as a POC and next step will be making use of it on @asyncapi/studio as well.

## Installation
Requires NodeJS v18 or greater.
```bash
npm install @smoya/asyncapi-adoption-metrics
yarn add @smoya/asyncapi-adoption-metrics
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

## Contributing
Read [CONTRIBUTING](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) guide.

## Contributors
Thanks go to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://github.com/smoya"><img src="https://avatars.githubusercontent.com/u/1083296?v=4?s=100" width="100px;" alt="Sergio Moya"/><br /><sub><b>Sergio Moya</b></sub></a><br /><a href="#question-smoya" title="Answering Questions">💬</a> <a href="https://github.com/smoya/asyncapi-adoption-metrics/issues?q=author%3Asmoya" title="Bug reports">🐛</a> <a href="https://github.com/smoya/asyncapi-adoption-metrics/commits?author=smoya" title="Code">💻</a> <a href="#ideas-smoya" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/smoya/asyncapi-adoption-metrics/pulls?q=is%3Apr+reviewed-by%3Asmoya" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/smoya/asyncapi-adoption-metrics/commits?author=fmvilas" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="25%"><a href="https://github.com/peter-rr"><img src="https://avatars.githubusercontent.com/u/81691177?v=4?s=100" width="100px;" alt="Pedro Ramos"/><br /><sub><b>Pedro Ramos</b></sub></a><br /><a href="#question-peter-rr" title="Answering Questions">💬</a> <a href="https://github.com/smoya/asyncapi-adoption-metrics/commits?author=peter-rr" title="Code">💻</a> <a href="https://github.com/smoya/asyncapi-adoption-metrics/commits?author=peter-rr" title="Documentation">📖</a> <a href="#ideas-peter-rr" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-peter-rr" title="Maintenance">🚧</a> <a href="https://github.com/smoya/asyncapi-adoption-metrics/pulls?q=is%3Apr+reviewed-by%3Apeter-rr" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="25%"><a href="https://github.com/Amzani"><img src="https://avatars.githubusercontent.com/u/554438?v=4?s=100" width="100px;" alt="Amzani"/><br /><sub><b>Amzani</b></sub></a><br /> <a href="#ideas-samz" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/smoya/asyncapi-adoption-metrics/issues?q=author%3Asamz" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="25%"><a href="https://github.com/KhudaDad414"><img src="https://avatars.githubusercontent.com/u/32505158?v=4?s=100" width="100px;" alt="Khuda Dad Nomani"/><br /><sub><b>Khuda Dad Nomani</b></sub></a><br /> <a href="https://github.com/smoya/asyncapi-adoption-metrics/issues?q=author%3AKhudaDad414" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
