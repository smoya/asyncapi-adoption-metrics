export enum MetricType {
  Counter = 'counter',
  Gauge = 'gauge'
}

export type MetricMetadata = { [key: string]: any };
  
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