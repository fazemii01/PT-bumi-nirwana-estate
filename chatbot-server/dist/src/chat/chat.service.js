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
        const greetingPrompt = prompts_1.ChatPromptTemplate.fromTemplate(`You are a helpful assistant named AskNirwana. You can handle basic greetings.
   Your only task is to greet the user and invite them to ask a question about properties.
   Your response MUST be: "Halo! Ada yang bisa saya bantu terkait properti?"
   User's input: {input}`);
        const greetingFilter = new runnables_1.RunnableLambda({
            func: async ({ input }) => {
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
                let normalized = input.toLowerCase().trim();
                if (greetings.includes(normalized)) {
                    return {
                        specialGreeting: true,
                        text: 'Halo! Ada yang bisa saya bantu terkait properti?',
                    };
                }
                for (let g of greetings) {
                    if (normalized.startsWith(g)) {
                        normalized = normalized.replace(g, '').trim();
                        break;
                    }
                }
                return { specialGreeting: false, text: normalized };
            },
        });
        this.greetingChain = greetingFilter
            .pipe(new runnables_1.RunnableLambda({
            func: async (input) => {
                if (input.specialGreeting) {
                    return 'Halo! Ada yang bisa saya bantu terkait properti?';
                }
                return null;
            },
        }))
            .pipe(new output_parsers_1.StringOutputParser());
        const retriever = this.vectorStore.asRetriever({ k: 2 });
        const historyAwareAnswerPrompt = prompts_1.ChatPromptTemplate.fromMessages([
            [
                'system',
                `You are AskNirwana, a friendly and helpful assistant for property questions.
- Always answer in a warm and conversational tone, and you MUST answer in Indonesian.
- Use the provided "Context" as your main source of truth.

Here is an example of a good response:
User Question: Kalau saya gajinya UMR, bisa nggak ambil KPR?
Good Answer: Tentu bisa! Untuk Anda yang memiliki gaji UMR, kami merekomendasikan Perumahan Bumi Nirwana Sumberejo yang memiliki promo Tanpa DP. Ini bisa menjadi solusi yang bagus untuk Anda. Jika ada pertanyaan lebih lanjut tentang KPR, jangan ragu bertanya ya.
User Question: Apa ada perumahan dengan cicilan murah?
Good Answer: Tentu, saat ini perumahan dengan cicilan murah adalah Bumi Nirwana Sumberejo dengan Angsuran hanya 1 Juta per bulan!!, dengan promo tanpa DP, apakah anda tertarik?
User Question: Apa ada perumahan murah?
Good Answer: Tentu, Saat ini perumahan dengan harga paling murah adalah Bumi Nirwana Sumberejo dengan harga hanya Rp 166.000.000 dengan Tipe rumah yang ditawarkan adalah 30/60, Apakah anda tertarik? 

- If the context only contains partial information, give the part you found and add a gentle suggestion like:
  "Untuk detail lebih lengkap, mungkin Anda bisa menanyakan hal lain atau menghubungi sales kami."
- If there is no information at all in the context, say politely:
  "Maaf, saya belum menemukan info yang sesuai. Boleh coba jelaskan lagi apa yang dicari?"
- Keep answers concise and easy to read.
  
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
        else if (result?.answer) {
            answer = result.answer;
        }
        else {
            answer = 'Maaf, terjadi kesalahan dalam memproses jawaban.';
        }
        this.chatHistory.push(new messages_1.HumanMessage(message));
        this.chatHistory.push(new messages_1.AIMessage(answer));
        console.log('Final AI Answer:', answer);
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