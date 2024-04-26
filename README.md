# asyncapi-adoption-metrics
Metrics library for measuring AsyncAPI tooling adoption.

It aids in comprehending how AsyncAPI tools are used and adopted, facilitating ongoing improvements to our specifications and tools. Currently is being used by @asyncapi/cli as a POC and next step will be making use of it on @asyncapi/studio as well.

Requires NodeJS v18 or greater.

## Metrics collected
We are collecting the following metrics:

- `asyncapi_adoption.action.invoked`:
With this metric we are tracking the command executed on the CLI as soon as the command is invoked, so it hasn't been completely executed and not finished yet. We just want to know which commands are used, regardless they have failed or succeeded.

- `asyncapi_adoption.action.finished`:
This metric tracks the command executed once it has already finished, carrying the result of the execution and some metadata based on the AsyncAPI document in place.

## Examples
Example for `validate` command after being invoked:
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
We are making use of [New Relic API](https://docs.newrelic.com/docs/apis/intro-apis/introduction-new-relic-apis/#rest-api) to send the metrics collected to the _New Relic_ servers, where they are stored, and finally visualized on our own dashboards at the AsyncAPI website.

