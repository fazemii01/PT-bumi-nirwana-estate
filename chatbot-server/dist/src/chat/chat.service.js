"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const documents_1 = require("@langchain/core/documents");
const text_splitter_1 = require("langchain/text_splitter");
const output_parsers_1 = require("@langchain/core/output_parsers");
const prompts_1 = require("@langchain/core/prompts");
const ollama_1 = require("@langchain/ollama");
const messages_1 = require("@langchain/core/messages");
const runnables_1 = require("@langchain/core/runnables");
const faiss_1 = require("@langchain/community/vectorstores/faiss");
const combine_documents_1 = require("langchain/chains/combine_documents");
const history_aware_retriever_1 = require("langchain/chains/history_aware_retriever");
const retrieval_1 = require("langchain/chains/retrieval");
let ChatService = class ChatService {
    constructor() {
        this.chatHistory = [];
    }
    async onModuleInit() {
        this.embeddings = new ollama_1.OllamaEmbeddings({
            baseUrl: 'http://localhost:4600',
            model: 'nomic-embed-text-v1.5.f16',
        });
        this.visionModel = new ollama_1.ChatOllama({
            baseUrl: 'http://localhost:4600',
            model: 'llava-phi-3-mini-mmproj-f16',
        });
        try {
            console.log('Attempting to load Faiss index from disk...');
            this.vectorStore = await faiss_1.FaissStore.load('faiss-index', this.embeddings);
            this.initializeConversationalChain();
            console.log('Faiss index loaded successfully and chain initialized.');
        }
        catch (e) {
            console.log('No existing Faiss index found. A new one will be created upon file upload.');
        }
    }
    async initializeConversationalChain() {
        const ollama = new ollama_1.ChatOllama({
            baseUrl: 'http://localhost:4600',
            model: 'Phi-3-mini-4k-instruct-q4',
        });
        const greetingPrompt = prompts_1.ChatPromptTemplate.fromTemplate(`You are a helpful assistant named AskNirwana. You can handle basic greetings. Respond in Indonesian. Keep your response brief, friendly, and invite the user to ask about properties.
      User's input: {input}`);
        this.greetingChain = greetingPrompt.pipe(ollama).pipe(new output_parsers_1.StringOutputParser());
        const retriever = this.vectorStore.asRetriever({ k: 2 });
        const historyAwareAnswerPrompt = prompts_1.ChatPromptTemplate.fromMessages([
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
            new prompts_1.MessagesPlaceholder('chat_history'),
            ['user', '{input}'],
        ]);
        const historyAwareCombineDocsChain = await (0, combine_documents_1.createStuffDocumentsChain)({
            llm: ollama,
            prompt: historyAwareAnswerPrompt,
        });
        this.directChain = await (0, retrieval_1.createRetrievalChain)({
            retriever: retriever,
            combineDocsChain: historyAwareCombineDocsChain,
        });
        const historyAwarePrompt = prompts_1.ChatPromptTemplate.fromMessages([
            new prompts_1.MessagesPlaceholder('chat_history'),
            ['user', '{input}'],
            [
                'user',
                'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation...',
            ],
        ]);
        const historyAwareRetrieverChain = await (0, history_aware_retriever_1.createHistoryAwareRetriever)({
            llm: ollama,
            retriever: retriever,
            rephrasePrompt: historyAwarePrompt,
        });
        this.conversationalChain = await (0, retrieval_1.createRetrievalChain)({
            retriever: historyAwareRetrieverChain,
            combineDocsChain: historyAwareCombineDocsChain,
        });
        this.masterChain = new runnables_1.RunnableBranch({
            branches: [
                [
                    new runnables_1.RunnableLambda({
                        func: (input) => this.isGreeting(input.input),
                    }),
                    this.greetingChain,
                ],
                [
                    new runnables_1.RunnableLambda({
                        func: (input) => input.chat_history.length === 0,
                    }),
                    this.directChain,
                ],
            ],
            default: this.conversationalChain,
        });
    }
    isGreeting(message) {
        const greetings = ['halo', 'hi', 'hello', 'apa kabar', 'pagi', 'siang', 'sore', 'malam'];
        const lowerCaseMessage = message.toLowerCase().trim();
        return greetings.some(greeting => lowerCaseMessage.startsWith(greeting));
    }
    formatDocs(docs) {
        return docs.map((doc) => doc.pageContent).join('\n\n');
    }
    async ask(message) {
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
        let answer;
        if (typeof result === 'string') {
            answer = result;
        }
        else if (result && typeof result.answer === 'string') {
            answer = result.answer;
        }
        else {
            answer = "Maaf, terjadi kesalahan dalam memproses jawaban.";
        }
        this.chatHistory.push(new messages_1.HumanMessage(message));
        this.chatHistory.push(new messages_1.AIMessage(answer));
        console.log('AI Answer:', answer);
        return answer;
    }
    clearHistory() {
        this.chatHistory = [];
        console.log('Chat history cleared.');
    }
    async processFile(file) {
        console.log(`Processing file: ${file.originalname} (${file.mimetype})`);
        if (!file || !file.buffer) {
            throw new Error('No file buffer found. Make sure multer.memoryStorage() is used.');
        }
        let pageContent;
        if (file.mimetype.startsWith('image/')) {
            console.log('Image file detected, processing with Moondream for structured extraction...');
            const image_b64 = file.buffer.toString('base64');
            const newPrompt = `Analyze the content of this real estate image and extract the information into a structured JSON format. Identify the property name, location, developer, features, pricing, payment details, and any promotions. For pricing tables, list each property type with its corresponding price, down payment, and monthly installment plans for all available tenures (e.g., 10, 15, 20 years). If the image is a site plan or map, describe the layout, identify the property name, and list the available plot numbers or blocks shown. If a piece of information is not present in the image, use null as the value.`;
            const message = new messages_1.HumanMessage({
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
            pageContent = response.content;
            console.log('Structured Extraction Result:', pageContent);
        }
        else {
            console.log('Text file detected.');
            pageContent = file.buffer.toString();
        }
        const doc = new documents_1.Document({ pageContent });
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
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
                this.vectorStore = await faiss_1.FaissStore.fromDocuments(batch, this.embeddings);
            }
            else {
                await this.vectorStore.addDocuments(batch);
            }
        }
        await this.vectorStore.save('faiss-index');
        this.initializeConversationalChain();
        this.clearHistory();
        console.log('File processed and Faiss index saved.');
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service.js.map