import { Injectable, OnModuleInit } from '@nestjs/common';
import { Settings, VectorStoreIndex } from 'llamaindex';
import { SupabaseVectorStore } from '@llamaindex/supabase';

import { createClient } from '@supabase/supabase-js';
import { OllamaService } from '@/ollama/ollama.service';
import {
  CustomOllamaEmbedding,
  CustomOllamaLLM,
  CustomOllamaReranker,
} from '@/ai/ai.wrappers';

export interface AiQueryResponse {
  result: string;
  sourceNodes: any[];
}

@Injectable()
export class AiService implements OnModuleInit {
  private index: VectorStoreIndex;

  constructor(private readonly ollamaService: OllamaService) {}
  async onModuleInit() {
    console.log('Menginisialisasi AI Service dengan Custom Ollama Service...');

    const llmModelName = 'qwen2:1.5b';
    const embeddingModelName = 'nomic-embed-text';

    Settings.llm = new CustomOllamaLLM(this.ollamaService, llmModelName);
    Settings.embedModel = new CustomOllamaEmbedding(
      this.ollamaService,
      embeddingModelName,
    );

    const supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    const vectorStore = new SupabaseVectorStore({
      client: supabaseClient,
      table: 'kpr_rules',
    });

    this.index = await VectorStoreIndex.fromVectorStore(vectorStore);

    console.log('✅ AI Service berhasil diinisialisasi.');
  }

  /**
   * Method utama untuk melakukan query RAG (Retrieval-Augmented Generation).
   * @param userQuestion Pertanyaan dari pengguna.
   * @param bankId ID bank untuk filtering (opsional).
   * @returns Hasil jawaban dari LLM beserta sumbernya.
   */
  async query(userQuestion: string, bankId?: string): Promise<AiQueryResponse> {
    const rerankModelName = 'dengcao/Qwen3-Reranker-0.6B:Q8_0';
    const topN = 3;

    const retriever = this.index.asRetriever({
      similarityTopK: 5,
      filters: bankId
        ? { filters: [{ key: 'bank_id', operator: '==', value: bankId }] }
        : undefined,
    });

    const queryEngine = this.index.asQueryEngine({
      retriever,
      nodePostprocessors: [
        new CustomOllamaReranker(this.ollamaService, rerankModelName, topN),
      ],
    });

    const response = await queryEngine.query({
      query: userQuestion,
    });

    return {
      result: response.toString(),
      sourceNodes: response.sourceNodes ?? [],
    };
  }

  public async embedText(text: string): Promise<number[]> {
    return Settings.embedModel.getTextEmbedding(text);
  }
}
