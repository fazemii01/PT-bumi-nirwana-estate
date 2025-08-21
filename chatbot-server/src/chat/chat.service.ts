import { Injectable, OnModuleInit } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from '@langchain/core/prompts';
import { ChatOllama, Ollama, OllamaEmbeddings } from '@langchain/ollama';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { Runnable, RunnableSequence } from '@langchain/core/runnables';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { MultiQueryRetriever } from 'langchain/retrievers/multi_query';

@Injectable()
export class ChatService implements OnModuleInit {
  private conversationalChain: Runnable;
  private vectorStore: FaissStore;
  private embeddings: OllamaEmbeddings;
  private visionModel: ChatOllama;
  private chatHistory: BaseMessage[] = [];

  async onModuleInit() {
    this.embeddings = new OllamaEmbeddings({
      baseUrl: 'http://localhost:4600',
      model: 'nomic-embed-text',
    });

    this.visionModel = new ChatOllama({
      baseUrl: 'http://localhost:4600',
      model: 'moondream',
    });

    try {
      console.log('Attempting to load Faiss index from disk...');
      this.vectorStore = await FaissStore.load('faiss-index', this.embeddings);
      this.initializeConversationalChain();
      console.log('Faiss index loaded successfully and chain initialized.');
    } catch (e) {
      console.log(
        'No existing Faiss index found. A new one will be created upon file upload.',
      );
    }
  }

  private async initializeConversationalChain(): Promise<void> {
    const ollama = new ChatOllama({
      baseUrl: 'http://localhost:4600',
      model: 'qwen2:1.5b',
    });

    const multiQueryRetriever = MultiQueryRetriever.fromLLM({
      llm: ollama,
      retriever: this.vectorStore.asRetriever(),
      verbose: true,
    });


    const historyAwarePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
      [
        'user',
        'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Mengingat percakapan di atas, buatlah kueri pencarian untuk mencari informasi yang relevan dengan percakapan tersebut',
      ],
    ]);

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
      llm: ollama,
      retriever: multiQueryRetriever,
      rephrasePrompt: historyAwarePrompt,
    });
    const baseRetriever = this.vectorStore.asRetriever(4);


    const historyAwareAnswerPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        "You are AskNirwana, a helpful and friendly assistant. Answer the user's questions based on the context provided. You can synthesize information from different parts of the context to form a complete answer. If the answer is not explicitly stated, you can make a logical inference based on the information you have, but mention that it is an inference. Be conversational and proactive.\n\n{context}. Anda adalah AskNirwana, asisten yang ramah dan membantu. Jawab pertanyaan pengguna berdasarkan konteks yang diberikan. Anda dapat merangkum informasi dari berbagai bagian konteks untuk membentuk jawaban yang lengkap. Jika jawabannya tidak dinyatakan secara eksplisit, Anda dapat membuat kesimpulan logis berdasarkan informasi yang Anda miliki, tetapi sebutkan bahwa itu adalah kesimpulan. Bersikaplah komunikatif dan proaktif.\n\n{context}",
      ],
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
    ]);


    const historyAwareCombineDocsChain = await createStuffDocumentsChain({
      llm: ollama,
      prompt: historyAwareAnswerPrompt,
    });


    this.conversationalChain = await createRetrievalChain({
      retriever: historyAwareRetrieverChain,
      combineDocsChain: historyAwareCombineDocsChain,
    });
  }

  private formatDocs(docs: Document[]): string {
    return docs.map((doc) => doc.pageContent).join('\n\n');
  }


  async ask(message: string): Promise<string> {
    if (!this.vectorStore) {
      return 'I am sorry, but I have no knowledge base to answer your question. Please upload a file first.';
    }
    if (!this.conversationalChain) {
      this.initializeConversationalChain();
    }

    console.log('Invoking conversational chain with question...');

    const result = await this.conversationalChain.invoke({
      chat_history: this.chatHistory,
      input: message,
    });


    this.chatHistory.push(new HumanMessage(message));
    this.chatHistory.push(new AIMessage(result.answer));

    console.log('AI Answer:', result.answer);
    return result.answer;
  }


  clearHistory(): void {
    this.chatHistory = [];
    console.log('Chat history cleared.');
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

    const doc = new Document({ pageContent });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512,
      chunkOverlap: 50,
    });
    const splits = await textSplitter.splitDocuments([doc]);
    console.log(`Split document into ${splits.length} chunks.`);

    const batchSize = 32;
    for (let i = 0; i < splits.length; i += batchSize) {
      const batch = splits.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1}...`);

      if (!this.vectorStore) {
        this.vectorStore = await FaissStore.fromDocuments(
          batch,
          this.embeddings,
        );
      } else {
        await this.vectorStore.addDocuments(batch);
      }
    }

    await this.vectorStore.save('faiss-index');
    this.initializeConversationalChain();
    this.clearHistory();
    console.log('File processed and Faiss index saved.');
  }
}
