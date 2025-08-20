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
const ollama_1 = require("@langchain/ollama");
const documents_1 = require("@langchain/core/documents");
const text_splitter_1 = require("langchain/text_splitter");
const output_parsers_1 = require("@langchain/core/output_parsers");
const prompts_1 = require("@langchain/core/prompts");
const ollama_2 = require("@langchain/ollama");
const messages_1 = require("@langchain/core/messages");
const runnables_1 = require("@langchain/core/runnables");
const faiss_1 = require("@langchain/community/vectorstores/faiss");
let ChatService = class ChatService {
    async onModuleInit() {
        this.embeddings = new ollama_1.OllamaEmbeddings({
            baseUrl: 'http://localhost:4600',
            model: 'nomic-embed-text',
        });
        this.visionModel = new ollama_2.ChatOllama({
            baseUrl: 'http://localhost:4600',
            model: 'moondream',
        });
        try {
            console.log('Attempting to load Faiss index from disk...');
            this.vectorStore = await faiss_1.FaissStore.load('faiss-index', this.embeddings);
            this.initializeChain();
            console.log('Faiss index loaded successfully and chain initialized.');
        }
        catch (e) {
            console.log('No existing Faiss index found. A new one will be created upon file upload.');
        }
    }
    initializeChain() {
        const ollama = new ollama_1.Ollama({
            baseUrl: 'http://localhost:4600',
            model: 'gemma:2b',
        });
        const retriever = this.vectorStore.asRetriever();
        const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const template = `Hari ini ${today}. Jawaban hanya dalam lingkup konteks yang sudah di sediakan
{context}

Question: {question}`;
        const prompt = prompts_1.PromptTemplate.fromTemplate(template);
        this.chain = runnables_1.RunnableSequence.from([
            {
                context: retriever.pipe(this.formatDocs),
                question: new runnables_1.RunnablePassthrough(),
            },
            prompt,
            ollama,
            new output_parsers_1.StringOutputParser(),
        ]);
    }
    formatDocs(docs) {
        return docs.map((doc) => doc.pageContent).join('\n\n');
    }
    async ask(message) {
        if (!this.vectorStore) {
            return "I am sorry, but I have no knowledge base to answer your question. Please upload a file first.";
        }
        if (!this.chain) {
            this.initializeChain();
        }
        console.log('Invoking chain with question...');
        const result = await this.chain.invoke(message);
        console.log('AI Answer:', result);
        return result;
    }
    async processFile(file) {
        console.log(`Processing file: ${file.originalname} (${file.mimetype})`);
        if (!file || !file.buffer) {
            throw new Error('No file buffer found. Make sure multer.memoryStorage() is used.');
        }
        let pageContent;
        if (file.mimetype.startsWith('image/')) {
            console.log('Image file detected, processing with Moondream...');
            const image_b64 = file.buffer.toString('base64');
            const message = new messages_1.HumanMessage({
                content: [
                    {
                        type: 'text',
                        text: 'Transcribe all text from this image. Be precise and include all details, including prices and contact information.',
                    },
                    {
                        type: 'image_url',
                        image_url: `data:image/jpeg;base64,${image_b64}`,
                    },
                ],
            });
            const response = await this.visionModel.invoke([message]);
            pageContent = response.content;
            console.log('Moondream Transcription:', pageContent);
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
        this.initializeChain();
        console.log('File processed and Faiss index saved.');
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service.js.map