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
const prompts_1 = require("@langchain/core/prompts");
const ollama_1 = require("@langchain/ollama");
const messages_1 = require("@langchain/core/messages");
const faiss_1 = require("@langchain/community/vectorstores/faiss");
const combine_documents_1 = require("langchain/chains/combine_documents");
const history_aware_retriever_1 = require("langchain/chains/history_aware_retriever");
const retrieval_1 = require("langchain/chains/retrieval");
const multi_query_1 = require("langchain/retrievers/multi_query");
let ChatService = class ChatService {
    constructor() {
        this.chatHistory = [];
    }
    async onModuleInit() {
        this.embeddings = new ollama_1.OllamaEmbeddings({
            baseUrl: 'http://localhost:4600',
            model: 'nomic-embed-text',
        });
        this.visionModel = new ollama_1.ChatOllama({
            baseUrl: 'http://localhost:4600',
            model: 'moondream',
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
            model: 'qwen2:1.5b',
        });
        const multiQueryRetriever = multi_query_1.MultiQueryRetriever.fromLLM({
            llm: ollama,
            retriever: this.vectorStore.asRetriever(),
            verbose: true,
        });
        const historyAwarePrompt = prompts_1.ChatPromptTemplate.fromMessages([
            new prompts_1.MessagesPlaceholder('chat_history'),
            ['user', '{input}'],
            [
                'user',
                'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Mengingat percakapan di atas, buatlah kueri pencarian untuk mencari informasi yang relevan dengan percakapan tersebut',
            ],
        ]);
        const historyAwareRetrieverChain = await (0, history_aware_retriever_1.createHistoryAwareRetriever)({
            llm: ollama,
            retriever: multiQueryRetriever,
            rephrasePrompt: historyAwarePrompt,
        });
        const baseRetriever = this.vectorStore.asRetriever(4);
        const historyAwareAnswerPrompt = prompts_1.ChatPromptTemplate.fromMessages([
            [
                'system',
                "You are AskNirwana, a helpful and friendly assistant. Answer the user's questions based on the context provided. You can synthesize information from different parts of the context to form a complete answer. If the answer is not explicitly stated, you can make a logical inference based on the information you have, but mention that it is an inference. Be conversational and proactive.\n\n{context}. Anda adalah AskNirwana, asisten yang ramah dan membantu. Jawab pertanyaan pengguna berdasarkan konteks yang diberikan. Anda dapat merangkum informasi dari berbagai bagian konteks untuk membentuk jawaban yang lengkap. Jika jawabannya tidak dinyatakan secara eksplisit, Anda dapat membuat kesimpulan logis berdasarkan informasi yang Anda miliki, tetapi sebutkan bahwa itu adalah kesimpulan. Bersikaplah komunikatif dan proaktif.\n\n{context}",
            ],
            new prompts_1.MessagesPlaceholder('chat_history'),
            ['user', '{input}'],
        ]);
        const historyAwareCombineDocsChain = await (0, combine_documents_1.createStuffDocumentsChain)({
            llm: ollama,
            prompt: historyAwareAnswerPrompt,
        });
        this.conversationalChain = await (0, retrieval_1.createRetrievalChain)({
            retriever: historyAwareRetrieverChain,
            combineDocsChain: historyAwareCombineDocsChain,
        });
    }
    formatDocs(docs) {
        return docs.map((doc) => doc.pageContent).join('\n\n');
    }
    async ask(message) {
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
        this.chatHistory.push(new messages_1.HumanMessage(message));
        this.chatHistory.push(new messages_1.AIMessage(result.answer));
        console.log('AI Answer:', result.answer);
        return result.answer;
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
        const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
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