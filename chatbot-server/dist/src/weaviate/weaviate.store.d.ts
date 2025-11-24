import { WeaviateStore } from '@langchain/weaviate';
import { OllamaEmbeddings } from '@langchain/ollama';
import { WeaviateClient } from 'weaviate-client';
export declare function createVectorStore(client: WeaviateClient, embeddings: OllamaEmbeddings): WeaviateStore;
