import weaviate, { WeaviateClient } from 'weaviate-client';

export async function createWeaviateClient(): Promise<WeaviateClient> {
  return weaviate.connectToLocal({
    host: 'localhost',
    port: 4900,
    grpcPort: 50051,
  });
}
