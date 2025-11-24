import { OllamaEmbeddings } from '@langchain/ollama';

export function createEmbeddingModel() {
  return new OllamaEmbeddings({
    baseUrl: 'http://localhost:4600',
    model: 'mxbai-embed-large',
  });
}
