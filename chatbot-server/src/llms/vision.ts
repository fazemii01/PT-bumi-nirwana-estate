import { ChatOllama } from '@langchain/ollama';

export function createVisionModel() {
  return new ChatOllama({
    baseUrl: 'http://localhost:4600',
    model: 'moondream',
  });
}
