# asyncapi-adoption-metrics
Metrics library for measuring AsyncAPI tooling adoption.

It aids in comprehending how AsyncAPI tools are used and adopted, facilitating ongoing improvements to our specifications and tools. Currently is being used by @asyncapi/cli as a POC and next step will be making use of it on @asyncapi/studio as well.

## Installation
Requires NodeJS v18 or greater.
```
npm install @smoya/@asyncapi-adoption-metrics
yarn add @smoya/@asyncapi-adoption-metrics
```

## Usage






## Metrics collected
We are collecting the following metrics:

- `asyncapi_adoption.action.invoked`:
With this metric we are tracking any action started (but not finished) in a tool. For example, a command that got executed on the [CLI](https://github.com/asyncapi/cli/) but didn't finish yet. We just want to know which commands are used, regardless they have failed or succeeded.

- `asyncapi_adoption.action.finished`:
With this metric we are tracking the action executed once it has already finished, carrying the result of the execution and some metadata.

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

Even though metrics collection is enabled by default, you can always disable tracking if you wish. To disable tracking, please run the following command:
`asyncapi config analytics --disable`

Once disabled, if you want to enable tracking back again then run:
`asyncapi config analytics --enable`

## Contributing



