import { Injectable } from '@nestjs/common';
import { ChromaClient } from 'chromadb';
import { Ollama } from '@langchain/community/llms/ollama';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import { Chroma } from '@langchain/community/vectorstores/chroma';

@Injectable()
export class ChatService {
  private chain: RunnableSequence;
  private vectorStore: Chroma;

  constructor() {
    this.init();
  }

  async init() {
    const ollama = new Ollama({
      baseUrl: 'http://localhost:11434',
      model: 'llama3',
    });

    const embeddings = new OllamaEmbeddings({
      baseUrl: 'http://localhost:11434',
      model: 'all-minilm',
    });

    const client = new ChromaClient();

    this.vectorStore = new Chroma(embeddings, {
      collectionName: 'company-data',
      url: 'http://localhost:8000', // Default ChromaDB URL
    });

    const retriever = this.vectorStore.asRetriever();

    const template = `Answer the question based only on the following context:
{context}

Question: {question}`;

    const prompt = PromptTemplate.fromTemplate(template);

    this.chain = RunnableSequence.from([
      {
        context: retriever.pipe(this.formatDocs.bind(this)),
        question: new RunnablePassthrough(),
      },
      prompt,
      ollama,
      new StringOutputParser(),
    ]);
  }

  private formatDocs(docs: any[]): string {
    return docs.map((doc) => doc.pageContent).join('\n\n');
  }

  async ask(message: string): Promise<string> {
    if (!this.chain) {
      throw new Error('RAG chain not initialized');
    }
    return this.chain.invoke(message);
  }
}
