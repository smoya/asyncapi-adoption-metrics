import exp from 'constants';
import { MetadataFromDocument } from '../src/metrics';
import { NewParser, AsyncAPIDocument } from '@smoya/multi-parser';

describe('Metrics', function() {
  const parser = NewParser();
  const doc = { asyncapi: '2.6.0', info: { title: 'test', version: '1.0.0' }, servers: { serverOne: { url: 'localhost', protocol: 'ws' } } ,channels: { '/test': { publish: { message: { payload: { type: 'object' } } } }, '/test_two': { subscribe: { message: { payload: { type: 'object' } } } } } };
  
  it('MetadataFromDocument with no previous metadata', async function() {
    const {document} = await parser.parse(doc);
    const metadata = MetadataFromDocument(document as AsyncAPIDocument);
    expect(metadata['_asyncapi_version']).toEqual('2.6.0');
    expect(metadata['_asyncapi_servers']).toEqual(1);
    expect(metadata['_asyncapi_channels']).toEqual(2);
    expect(metadata['_asyncapi_messages']).toEqual(2);
    expect(metadata['_asyncapi_operations_send']).toEqual(1);
    expect(metadata['_asyncapi_operations_receive']).toEqual(1);
    expect(metadata['_asyncapi_schemas']).toEqual(2);
  });
  it('MetadataFromDocument with previous metadata', async function() {
    const {document} = await parser.parse(doc);
    const metadata = MetadataFromDocument(document as AsyncAPIDocument, { test: true });
    expect(metadata['test']).toBeTruthy();
    expect(metadata['_asyncapi_version']).toEqual('2.6.0');
    expect(metadata['_asyncapi_servers']).toEqual(1);
    expect(metadata['_asyncapi_channels']).toEqual(2);
    expect(metadata['_asyncapi_messages']).toEqual(2);
    expect(metadata['_asyncapi_operations_send']).toEqual(1);
    expect(metadata['_asyncapi_operations_receive']).toEqual(1);
    expect(metadata['_asyncapi_schemas']).toEqual(2);
  });
});