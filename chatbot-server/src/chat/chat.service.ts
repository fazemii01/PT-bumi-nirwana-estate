import { Injectable, OnModuleInit } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import {
  Runnable,
  RunnableSequence,
  RunnableBranch,
  RunnableLambda,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import { WeaviateStore } from '@langchain/weaviate';
import weaviate, { WeaviateClient } from 'weaviate-client';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { MultiQueryRetriever } from 'langchain/retrievers/multi_query';
import { encode } from 'gpt-tokenizer';
import { HttpService } from '@nestjs/axios';


type ScoredDoc = { doc: Document; score: number };

@Injectable()
export class ChatService implements OnModuleInit {
  private weaviateClient: WeaviateClient;
  private masterChain: Runnable;
  private vectorStore: WeaviateStore;
  private embeddings: OllamaEmbeddings;
  private visionModel: ChatOllama;
  // private chatHistory: BaseMessage[] = [];
  private chatHistories: Map<string, BaseMessage[]> = new Map();
  constructor(private readonly httpService: HttpService) {}
  async onModuleInit() {
    this.embeddings = new OllamaEmbeddings({
      baseUrl: 'http://localhost:4600',
      model: 'nomic-embed-text',
    });

    this.visionModel = new ChatOllama({
      baseUrl: 'http://localhost:4600',
      model: 'moondream',
    });

    this.weaviateClient = await weaviate.connectToLocal({
      host: 'localhost',
      port: 4900,
      grpcPort: 50051,
    });
    console.log(
      'Weaviate client in onModuleInit:',
      this.weaviateClient ? 'initialized' : 'undefined',
    );

    const meta = await this.weaviateClient.getMeta();
    console.log('Weaviate meta:', meta);

    const indexName = 'Chatbot';
    this.vectorStore = new WeaviateStore(this.embeddings, {
      client: this.weaviateClient as any,
      indexName,
    });

    this.initializeMasterChain();
  }

  private async rerankDocuments(
    originalQuery: string,
    documents?: Document[],
  ): Promise<ScoredDoc[]> {
    if (!documents || documents.length === 0) return [];

    const payload = {
      query: originalQuery,
      documents: documents.map((d) => d.pageContent),
    };

    try {
      const response = await fetch('http://localhost:8082/rerank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Reranker API failed with status ${response.status}`);
      }

      const data = await response.json();
      const results = data.results as {
        index: number;
        relevance_score: number;
      }[];

      return results.map((r) => ({
        doc: documents[r.index],
        score: r.relevance_score,
      })) as ScoredDoc[];
    } catch (err) {
      console.error('Reranker call failed:', err);

      return documents.map((d) => ({ doc: d, score: 0 }));
    }
  }

  private async rerankInChunks(
    query: string,
    documents: Document[],
    chunkSize = 64,
  ): Promise<ScoredDoc[]> {
    const all: ScoredDoc[] = [];
    for (let i = 0; i < documents.length; i += chunkSize) {
      const chunk = documents.slice(i, i + chunkSize);
      const scored = await this.rerankDocuments(query, chunk);
      all.push(...scored);
    }
    return all;
  }

  private async rerankByTokenBudget(
    query: string,
    documents: Document[],
    maxTokens = 128,
    maxDocTokens = 200,
  ): Promise<Document[]> {
    const results: ScoredDoc[] = [];
    let batch: Document[] = [];
    let batchTokens = 0;

    const safeDocs = documents.map((d) => this.truncateDoc(d, maxDocTokens));

    for (const doc of safeDocs) {
      const docTokens = encode(doc.pageContent).length;

      if (batchTokens + docTokens > maxTokens && batch.length > 0) {
        const scored = await this.rerankDocuments(query, batch);
        scored.forEach((r) => results.push(r));
        batch = [doc];
        batchTokens = docTokens;
      } else {
        batch.push(doc);
        batchTokens += docTokens;
      }
    }

    if (batch.length > 0) {
      const scored = await this.rerankDocuments(query, batch);
      scored.forEach((r) => results.push(r));
    }

    return results.sort((a, b) => b.score - a.score).map((r) => r.doc);
  }

  /**
   * Truncate a document to ~maxTokens worth of content.
   * We estimate chars ≈ 4 * tokens to avoid token->text decoding.
   */
  private truncateDoc(doc: Document, maxTokens: number): Document {
    const tokenCount = encode(doc.pageContent).length;
    if (tokenCount <= maxTokens) return doc;

    const approxChars = Math.max(
      1,
      Math.min(doc.pageContent.length, Math.floor(maxTokens * 4)),
    );
    const truncated = doc.pageContent.slice(0, approxChars);

    return new Document({
      pageContent: truncated,
      metadata: doc.metadata,
    });
  }

  private async initializeMasterChain(): Promise<void> {
    const llm = new ChatOllama({
      baseUrl: 'http://localhost:4600',
      model: 'qwen2:1.5b',
    });

    const baseRetriever = this.vectorStore.asRetriever({ k: 5 });

    const multiQueryRetriever = MultiQueryRetriever.fromLLM({
      llm,
      retriever: baseRetriever,
      verbose: true,
    });

    const historyAwarePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
      [
        'user',
        'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation.',
      ],
    ]);

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
      llm,
      retriever: multiQueryRetriever,
      rephrasePrompt: historyAwarePrompt,
    });

    const retrieverChain = RunnableSequence.from([
      historyAwareRetrieverChain,
      (docs) => docs,
    ]).withConfig({ runName: 'DocumentRetrieverChain' });

    const synthesisPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are AskNirwana, a helpful property assistant. Your task is to provide a single, clear answer in Indonesian based on the provided contexts.
- The contexts are ranked by relevance. Give priority to the information in the first context if there are contradictions.
- Combine the information from the different contexts into one smooth, conversational answer.
- Do NOT mention that you are looking at multiple contexts. Just provide the final answer.
- If the contexts do not contain the answer, say "Maaf, saya tidak dapat menemukan informasi yang Anda cari."

---
CONTEXTS:
{context}
---`,
      ],
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm,
      prompt: synthesisPrompt,
    });

    const ragChain = RunnableSequence.from([
      RunnablePassthrough.assign({
        context: retrieverChain,
      }),
      RunnableLambda.from(
        async (input: {
          input: string;
          context: Document[];
          chat_history: BaseMessage[];
        }) => {
          const rerankedDocs = await this.rerankByTokenBudget(
            input.input,
            input.context,
            256,
          );
          return { ...input, context: rerankedDocs };
        },
      ).withConfig({ runName: 'RerankDocuments' }),
      combineDocsChain,
      new StringOutputParser(),
    ]).withConfig({ runName: 'FinalRagChain' });

    const greetingChain = new RunnableLambda({
      func: (_input) => 'Halo! Ada yang bisa saya bantu terkait properti?',
    }).withConfig({ runName: 'GreetingChain' });

    this.masterChain = new RunnableBranch({
      branches: [
        [
          new RunnableLambda({
            func: (input: { input: string; chat_history: BaseMessage[] }) =>
              this.isGreeting(input.input),
          }),
          greetingChain,
        ],
      ],
      default: ragChain,
    }).withConfig({ runName: 'MasterChain' });
  }

  private isGreeting(message: string): boolean {
    const greetings = [
      'halo',
      'helo',
      'hallo',
      'hi',
      'hai',
      'hello',
      'apa kabar',
      'pagi',
      'siang',
      'sore',
      'malam',
      'selamat pagi',
      'selamat siang',
      'selamat sore',
      'selamat malam',
    ];
    const lower = message.toLowerCase().trim();
    return greetings.includes(lower);
  }

  // async ask(message: string): Promise<string> {
  //   if (!this.vectorStore) {
  //     return 'I am sorry, but I have no knowledge base to answer your question.';
  //   }
  //   if (!this.masterChain) {
  //     await this.initializeMasterChain();
  //   }
  //   console.log('Invoking master chain with question...');

  //   const result = await this.masterChain.invoke({
  //     chat_history: this.chatHistory,
  //     input: message,
  //   });

  //   const answer = (result as any).answer ?? result;

  //   this.chatHistory.push(new HumanMessage(message));
  //   this.chatHistory.push(new AIMessage(answer as string));

  //   console.log('Final AI Answer:', answer);
  //   return answer as string;
  // }

   async ask(message: string, sessionId: string): Promise<string> {
    if (!this.vectorStore) {
      return 'I am sorry, but I have no knowledge base to answer your question.';
    }
    if (!this.masterChain) {
      await this.initializeMasterChain();
    }
    console.log(`Invoking master chain for session ${sessionId}...`);
    const userHistory = this.chatHistories.get(sessionId) || [];

    const result = await this.masterChain.invoke({
      chat_history: userHistory, 
      input: message,
    });

    const answer = (result as any).answer ?? result;
    userHistory.push(new HumanMessage(message));
    userHistory.push(new AIMessage(answer as string));
    this.chatHistories.set(sessionId, userHistory);

    console.log('Final AI Answer:', answer);
    return answer as string;
  }

  // clearHistory(): void {
  //   this.chatHistory = [];
  //   console.log('Chat history cleared.');
  // }

  clearHistory(sessionId: string): void {
    if (this.chatHistories.has(sessionId)) {
      this.chatHistories.delete(sessionId);
      console.log(`Chat history for session ${sessionId} cleared.`);
    } else {
      console.log(`No chat history found for session ${sessionId}.`);
    }
  }
  clearAllHistories(): void {
    this.chatHistories.clear();
    console.log('All chat histories cleared because a new file was processed.');
  }
  async processFile(file: Express.Multer.File): Promise<void> {
    console.log(`Processing file: ${file.originalname} (${file.mimetype})`);
    if (!file || !file.buffer) {
      throw new Error(
        'No file buffer found. Make sure multer.memoryStorage() is used.',
      );
    }
    let pageContent: string;
    if (file.mimetype.startsWith('image/')) {
      console.log(
        'Image file detected, processing with Moondream for structured extraction...',
      );
      const image_b64 = file.buffer.toString('base64');
      const newPrompt = `Analyze the content of this real estate image and extract the information into a structured JSON format. Identify the property name, location, developer, features, pricing, payment details, and any promotions. For pricing tables, list each property type with its corresponding price, down payment, and monthly installment plans for all available tenures (e.g., 10, 15, 20 years). If the image is a site plan or map, describe the layout, identify the property name, and list the available plot numbers or blocks shown. If a piece of information is not present in the image, use null as the value.`;
      const message = new HumanMessage({
        content: [
          {
            type: 'text',
            text: newPrompt,
          },
          {
            type: 'image_url',
            image_url: `data:image/jpeg;base64,${image_b64}`,
          },
        ],
      });
      const response = await this.visionModel.invoke([message]);
      pageContent = response.content as string;
      console.log('Structured Extraction Result:', pageContent);
    } else {
      console.log('Text file detected.');
      pageContent = file.buffer.toString();
    }

    const doc = new Document({
      pageContent,
      metadata: { source: 'uploaded_file' },
    });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512,
      chunkOverlap: 50,
      separators: ['\n\n## ', '\n## ', '\n\n# ', '\n# ', '\n\n', '\n', ' ', ''],
    });

    const splits = await splitter.splitDocuments([doc]);
    console.log(`Split document into ${splits.length} chunks.`);

    if (splits.length === 0) {
      console.warn('No splits were created — check if pageContent is empty!');
      return;
    }

    console.log('Example chunk:', splits[0].pageContent.slice(0, 200));

    const batchSize = 32;
    for (let i = 0; i < splits.length; i += batchSize) {
      const batch = splits.slice(i, i + batchSize);

      if (!batch.length) {
        console.warn(`Skipping empty batch at index ${i}`);
        continue;
      }

      console.log(`Processing batch ${i / batchSize + 1}...`);

      await this.vectorStore.addDocuments(batch);
    }

    this.initializeMasterChain();
    this.clearAllHistories();
    console.log(' File processed and Weaviate index updated.');
  }
}
