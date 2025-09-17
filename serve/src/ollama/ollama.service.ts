import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';

@Injectable()
export class OllamaService {
  private readonly ollama = new Ollama({ host: 'http://localhost:11434' });

  async generate(prompt: string, model: string, stream = false): Promise<any> {
    try {
      const response = await this.ollama.generate({
        model,
        prompt,
      });

      return response;
    } catch (error) {
      console.error('Failed to generate response from Ollama:', error.message);
      throw new Error('Gagal memproses permintaan ke Ollama.');
    }
  }

  async embeddings(prompt: string, model: string): Promise<number[]> {
    try {
      const response = await this.ollama.embeddings({
        model,
        prompt,
      });

      return response.embedding;
    } catch (error) {
      console.error('Failed to get embeddings from Ollama:', error.message);
      throw new Error('Gagal memproses permintaan embedding.');
    }
  }

  async rerank(
    query: string,
    candidateDocuments: string[],
    rerankModel: string,
  ): Promise<{ text: string; score: number }[]> {
    const rerankedResults: { text: string; score: number }[] = [];

    try {
      for (const doc of candidateDocuments) {
        const prompt = `query: ${query}\ndocument: ${doc}`;
        console.log('PROMT RERANK', prompt);

        const embeddingResult = await this.embeddings(prompt, rerankModel);

        const score = embeddingResult[0];

        rerankedResults.push({
          text: doc,
          score: score,
        });
      }

      rerankedResults.sort((a, b) => b.score - a.score);

      return rerankedResults;
    } catch (error) {
      console.error('Failed to rerank documents:', error.message);
      throw new Error('Gagal melakukan reranking dokumen.');
    }
  }
}
