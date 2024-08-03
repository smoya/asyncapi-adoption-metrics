import { AsyncAPIDocument } from '@asyncapi/multi-parser';

export enum MetricType {
  Counter = 'counter',
  Gauge = 'gauge'
}

export type MetricMetadata = Record<string, unknown>

export function MetadataFromDocument(doc: AsyncAPIDocument, metadata: MetricMetadata = {}): MetricMetadata {
  metadata['asyncapi_version'] = doc.version();
  metadata['asyncapi_servers'] = doc.allServers().all().length;
  metadata['asyncapi_channels'] = doc.allChannels().all().length;
  metadata['asyncapi_messages'] = doc.allMessages().all().length;
  metadata['asyncapi_operations_send'] = doc.allOperations().filterBySend().length;
  metadata['asyncapi_operations_receive'] = doc.allOperations().filterByReceive().length;
  metadata['asyncapi_schemas'] = doc.allSchemas().all().length;
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
