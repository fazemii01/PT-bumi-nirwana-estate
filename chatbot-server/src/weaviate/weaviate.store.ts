import { WeaviateStore } from '@langchain/weaviate';
import { OllamaEmbeddings } from '@langchain/ollama';
import { WeaviateClient } from 'weaviate-client';

export function createVectorStore(
  client: WeaviateClient,
  embeddings: OllamaEmbeddings,
) {
  return new WeaviateStore(embeddings, {
    client: client as any,
    indexName: 'Chatbot',
  });
}
