import { AsyncAPIDocument } from '@smoya/multi-parser';

export enum MetricType {
  Counter = 'counter',
  Gauge = 'gauge'
}

export type MetricMetadata = { [key: string]: any };

export function MetadataFromDocument(doc: AsyncAPIDocument, metadata: MetricMetadata = []): MetricMetadata {
  metadata['_asyncapi_version'] = doc.version();
  metadata['_asyncapi_servers'] = doc.allServers().all().length;
  metadata['_asyncapi_channels'] = doc.allChannels().all().length;
  metadata['_asyncapi_messages'] = doc.allMessages().all().length;
  metadata['_asyncapi_operations_send'] = doc.allOperations().filterBySend().length;
  metadata['_asyncapi_operations_receive'] = doc.allOperations().filterByReceive().length;
  metadata['_asyncapi_schemas'] = doc.allSchemas().all().length;
  return metadata;
}
  
export class Metric {
  name: string;
  type: MetricType;
  value: any;
  metadata: { [key: string]: any };

  constructor(name: string, type: MetricType, value: any, metadata: MetricMetadata) {
    this.name = name;
    this.type = type;
    this.value = value;
    this.metadata = metadata;
  }

  withMetadataField(name: string, value: any) {
    this.metadata[name] = value;
    return this;
  }
}

export type Metrics = Metric[];
