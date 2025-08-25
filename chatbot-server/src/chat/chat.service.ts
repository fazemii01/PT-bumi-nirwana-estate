import { Injectable, OnModuleInit } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { StringOutputParser } from '@langchain/core/output_parsers';
// import { MarkdownHeaderTextSplitter } from "@langchain/textsplitters"
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from '@langchain/core/prompts';
import { ChatOllama, Ollama, OllamaEmbeddings } from '@langchain/ollama';
import { LlamaCpp } from '@langchain/community/llms/llama_cpp';
import { LlamaCppEmbeddings } from '@langchain/community/embeddings/llama_cpp';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import {
  Runnable,
  RunnableSequence,
  RunnableBranch,
  RunnableLambda
} from '@langchain/core/runnables';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { MultiQueryRetriever } from 'langchain/retrievers/multi_query';

@Injectable()
export class ChatService implements OnModuleInit {
  private greetingChain: Runnable; // **New chain for greetings**
  private masterChain: Runnable; // **New master chain**
  private conversationalChain: Runnable;
  private directChain: Runnable;
  private vectorStore: FaissStore;
  private embeddings: OllamaEmbeddings;
  private visionModel: ChatOllama;
  private chatHistory: BaseMessage[] = [];
  private llamaVision: LlamaCpp;
  private llamaEmbeddings: LlamaCppEmbeddings


  async onModuleInit() {
    this.embeddings = new OllamaEmbeddings({
      baseUrl: 'http://localhost:4600',
      model: 'nomic-embed-text-v1.5.f16',
    });

    this.visionModel = new ChatOllama({
      baseUrl: 'http://localhost:4600',
      model: 'llava-phi-3-mini-mmproj-f16',
    });
    // this.llamaEmbeddings = new LlamaCppEmbeddings({
    //   modelPath: 'E:/vllm/model/nomic-embed-text-v1.5.f16.gguf',
    //   baseUrl: 'http://localhost:4600',
    // });

    // this.llamaVision = new LlamaCpp({
    //   modelPath: 'E:/vllm/model/llava-phi-3-mini-mmproj-f16.gguf',
    //   baseUrl: 'http://localhost:4700',
    // });

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
      model: 'Phi-3-mini-4k-instruct-q4',
    });
    const greetingPrompt = ChatPromptTemplate.fromTemplate(
      `You are a helpful assistant named AskNirwana. You can handle basic greetings. Respond in Indonesian. Keep your response brief, friendly, and invite the user to ask about properties.
      User's input: {input}`
    );
    this.greetingChain = greetingPrompt.pipe(ollama).pipe(new StringOutputParser());
    const retriever = this.vectorStore.asRetriever({ k: 2 });

    const historyAwareAnswerPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a helpful assistant named AskNirwana.
 - Answer the user's question STRICTLY based on the provided "Context" below.
 - Each project is described in its own section. DO NOT mix details between different projects.
 - Be concise, direct, humble and answer in Indonesian.
 - If the answer is not found in the context, you MUST reply with the exact phrase: "Informasi tidak ditemukan dalam konteks." and give the possible solution 

   Context:
   {context}`,
      ],
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
    ]);

    const historyAwareCombineDocsChain = await createStuffDocumentsChain({
      llm: ollama,
      prompt: historyAwareAnswerPrompt,
    });

    // Chain 1: first questions (no history)
    this.directChain = await createRetrievalChain({
      retriever: retriever,
      combineDocsChain: historyAwareCombineDocsChain,
    });

    // Chain 2: fllowup questions (with history)
    const historyAwarePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder('chat_history'),
      ['user', '{input}'],
      [
        'user',
        'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation...',
      ],
    ]);

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
      llm: ollama,
      retriever: retriever,
      rephrasePrompt: historyAwarePrompt,
    });

    this.conversationalChain = await createRetrievalChain({
      retriever: historyAwareRetrieverChain,
      combineDocsChain: historyAwareCombineDocsChain,
    });
    // conversation chain switcher
    this.masterChain = new RunnableBranch({
      branches: [
        [
          new RunnableLambda({
            func: (input: { input: string; chat_history: BaseMessage[] }) => this.isGreeting(input.input),
          }),
          this.greetingChain,
        ],
        [
          new RunnableLambda({
            func: (input: { input: string; chat_history: BaseMessage[] }) => input.chat_history.length === 0,
          }),
          this.directChain,
        ],
      ],

      default: this.conversationalChain,
    });
  }

  // private async initializeConversationalChain(): Promise<void> {
  //   const ollama = new ChatOllama({
  //     baseUrl: 'http://localhost:4600',
  //     model: 'qwen2:1.5b',
  //   });

  //   // const multiQueryRetriever = MultiQueryRetriever.fromLLM({
  //   //   llm: ollama,
  //   //   retriever: this.vectorStore.asRetriever(),
  //   //   verbose: true,
  //   // });
  //   const retriever = this.vectorStore.asRetriever({
  //     k: 2,
  //   });
  //   const historyAwarePrompt = ChatPromptTemplate.fromMessages([
  //     new MessagesPlaceholder('chat_history'),
  //     ['user', '{input}'],
  //     [
  //       'user',
  //       'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Mengingat percakapan di atas, buatlah kueri pencarian untuk mencari informasi yang relevan dengan percakapan tersebut',
  //     ],
  //   ]);

  //   const historyAwareRetrieverChain = await createHistoryAwareRetriever({
  //     llm: ollama,
  //     retriever: retriever,
  //     rephrasePrompt: historyAwarePrompt,
  //   });
  //   const baseRetriever = this.vectorStore.asRetriever(4);

  //   const historyAwareAnswerPrompt = ChatPromptTemplate.fromMessages([
  //     [
  //       'system',
  //       `You are a helpful assistant named AskNirwana.
  // - Answer the user's question STRICTLY based on the provided "Context" below.
  // - Each project is described in its own section. DO NOT mix details between different projects.
  // - Be concise, direct, humble and answer in Indonesian.
  // - If the answer is not found in the context, you MUST reply with the exact phrase: "Informasi tidak ditemukan dalam konteks." and give the possible solution instead of giving strict answer, be humble

  //   Context:
  //   {context}`,
  //     ],
  //     new MessagesPlaceholder('chat_history'),
  //     ['user', '{input}'],
  //   ]);

  //   const historyAwareCombineDocsChain = await createStuffDocumentsChain({
  //     llm: ollama,
  //     prompt: historyAwareAnswerPrompt,
  //   });

  //   // const conversationalRetriever = new RunnableBranch(
  //   //   (inputs) => inputs.chat_history.length === 0,
  //   //   RunnableSequence.from([(inputs) => inputs.input, retriever]),
  //   //   historyAwareRetrieverChain,
  //   // );
  //   const conversationalRetriever = new RunnableBranch(
  //     (inputs) => inputs.chat_history.length === 0,      
  //     RunnableSequence.from([(inputs) => inputs.input]).pipe(retriever),
  //     historyAwareRetrieverChain,
  //   );
  //   this.conversationalChain = await createRetrievalChain({
  //     retriever: conversationalRetriever,
  //     combineDocsChain: historyAwareCombineDocsChain,
  //   });

  //   // this.conversationalChain = await createRetrievalChain({
  //   //   retriever: historyAwareRetrieverChain,
  //   //   combineDocsChain: historyAwareCombineDocsChain,
  //   // });
  // }
  private isGreeting(message: string): boolean {
    const greetings = ['halo', 'hi', 'hello', 'apa kabar', 'pagi', 'siang', 'sore', 'malam'];
    const lowerCaseMessage = message.toLowerCase().trim();
    return greetings.some(greeting => lowerCaseMessage.startsWith(greeting));
  }
  private formatDocs(docs: Document[]): string {
    return docs.map((doc) => doc.pageContent).join('\n\n');
  }

  // async ask(message: string): Promise<string> {
  //   if (!this.vectorStore) {
  //     return 'I am sorry, but I have no knowledge base to answer your question. Please upload a file first.';
  //   }
  //   if (!this.masterChain) {
  //     this.initializeConversationalChain();
  //   }

  //   console.log('Invoking conversational chain with question...');

  //   const result = await this.conversationalChain.invoke({
  //     chat_history: this.chatHistory,
  //     input: message,
  //   });
  //   let answer: string;
  //   if (typeof result === 'string') {
  //     answer = result;
  //   } else {
  //     answer = result.answer;
  //   }
  //   this.chatHistory.push(new HumanMessage(message));
  //   this.chatHistory.push(new AIMessage(result.answer));

  //   console.log('AI Answer:', answer);
  //   return answer;
  // }
  async ask(message: string): Promise<string> {
  if (!this.vectorStore) {
    return 'I am sorry, but I have no knowledge base to answer your question. Please upload a file first.';
  }
  if (!this.masterChain) {
    await this.initializeConversationalChain();
  }

  console.log('Invoking master chain with question...');
  const result = await this.masterChain.invoke({
    chat_history: this.chatHistory,
    input: message,
  });

  
  let answer: string;
  if (typeof result === 'string') {
    answer = result;
  } else if (result && typeof result.answer === 'string') {
    answer = result.answer;
  } else {
    answer = "Maaf, terjadi kesalahan dalam memproses jawaban.";
  }

  this.chatHistory.push(new HumanMessage(message));
  this.chatHistory.push(new AIMessage(answer));

  console.log('AI Answer:', answer);
  return answer;
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

    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 512,
    //   chunkOverlap: 50,
    // });
    // const splits = await textSplitter.splitDocuments([doc]);
    // console.log(`Split document into ${splits.length} chunks.`);
    // const headersToSplitOn = [
    //     ['#', 'Header1'],
    //     ['##', 'Header2'],
    // ];
    // const markdownSplitter = new MarkdownHeaderTextSplitter({
    //     headersToSplitOn,
    //     returnIntermediateSteps: false, // Set to true for debugging if needed
    // });
    // const splits = await markdownSplitter.splitText(pageContent);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1024,
      chunkOverlap: 100,
      separators: ['\n\n## ', '\n## ', '\n\n# ', '\n# ', '\n\n', '\n', ' ', ''],
    });
    const splits = await splitter.createDocuments([pageContent]);

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
