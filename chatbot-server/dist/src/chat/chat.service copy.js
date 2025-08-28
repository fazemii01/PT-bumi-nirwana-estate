"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const weaviate_1 = require("@langchain/weaviate");
const weaviate_client_1 = __importDefault(require("weaviate-client"));
const combine_documents_1 = require("langchain/chains/combine_documents");
const history_aware_retriever_1 = require("langchain/chains/history_aware_retriever");
const multi_query_1 = require("langchain/retrievers/multi_query");
const gpt_tokenizer_1 = require("gpt-tokenizer");
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
        this.weaviateClient = await weaviate_client_1.default.connectToLocal({
            host: 'localhost',
            port: 4900,
            grpcPort: 50051,
        });
        console.log('Weaviate client in onModuleInit:', this.weaviateClient ? 'initialized' : 'undefined');
        const meta = await this.weaviateClient.getMeta();
        console.log('Weaviate meta:', meta);
        const indexName = 'Chatbot';
        this.vectorStore = new weaviate_1.WeaviateStore(this.embeddings, {
            client: this.weaviateClient,
            indexName,
        });
        this.initializeMasterChain();
    }
    async rerankDocuments(originalQuery, documents) {
        if (!documents || documents.length === 0)
            return [];
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
            const results = data.results;
            return results.map((r) => ({
                doc: documents[r.index],
                score: r.relevance_score,
            }));
        }
        catch (err) {
            console.error('Reranker call failed:', err);
            return documents.map((d) => ({ doc: d, score: 0 }));
        }
    }
    async rerankInChunks(query, documents, chunkSize = 64) {
        const all = [];
        for (let i = 0; i < documents.length; i += chunkSize) {
            const chunk = documents.slice(i, i + chunkSize);
            const scored = await this.rerankDocuments(query, chunk);
            all.push(...scored);
        }
        return all;
    }
    async rerankByTokenBudget(query, documents, maxTokens = 128, maxDocTokens = 200) {
        const results = [];
        let batch = [];
        let batchTokens = 0;
        const safeDocs = documents.map((d) => this.truncateDoc(d, maxDocTokens));
        for (const doc of safeDocs) {
            const docTokens = (0, gpt_tokenizer_1.encode)(doc.pageContent).length;
            if (batchTokens + docTokens > maxTokens && batch.length > 0) {
                const scored = await this.rerankDocuments(query, batch);
                scored.forEach((r) => results.push(r));
                batch = [doc];
                batchTokens = docTokens;
            }
            else {
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
    truncateDoc(doc, maxTokens) {
        const tokenCount = (0, gpt_tokenizer_1.encode)(doc.pageContent).length;
        if (tokenCount <= maxTokens)
            return doc;
        const approxChars = Math.max(1, Math.min(doc.pageContent.length, Math.floor(maxTokens * 4)));
        const truncated = doc.pageContent.slice(0, approxChars);
        return new documents_1.Document({
            pageContent: truncated,
            metadata: doc.metadata,
        });
    }
    async initializeMasterChain() {
        const llm = new ollama_1.ChatOllama({
            baseUrl: 'http://localhost:4600',
            model: 'qwen2:1.5b',
        });
        const baseRetriever = this.vectorStore.asRetriever({ k: 5 });
        const multiQueryRetriever = multi_query_1.MultiQueryRetriever.fromLLM({
            llm,
            retriever: baseRetriever,
            verbose: true,
        });
        const historyAwarePrompt = prompts_1.ChatPromptTemplate.fromMessages([
            new prompts_1.MessagesPlaceholder('chat_history'),
            ['user', '{input}'],
            [
                'user',
                'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation.',
            ],
        ]);
        const historyAwareRetrieverChain = await (0, history_aware_retriever_1.createHistoryAwareRetriever)({
            llm,
            retriever: multiQueryRetriever,
            rephrasePrompt: historyAwarePrompt,
        });
        const retrieverChain = runnables_1.RunnableSequence.from([
            historyAwareRetrieverChain,
            (docs) => docs,
        ]).withConfig({ runName: 'DocumentRetrieverChain' });
        const synthesisPrompt = prompts_1.ChatPromptTemplate.fromMessages([
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
            new prompts_1.MessagesPlaceholder('chat_history'),
            ['user', '{input}'],
        ]);
        const combineDocsChain = await (0, combine_documents_1.createStuffDocumentsChain)({
            llm,
            prompt: synthesisPrompt,
        });
        const ragChain = runnables_1.RunnableSequence.from([
            runnables_1.RunnablePassthrough.assign({
                context: retrieverChain,
            }),
            runnables_1.RunnableLambda.from(async (input) => {
                const rerankedDocs = await this.rerankByTokenBudget(input.input, input.context, 256);
                return { ...input, context: rerankedDocs };
            }).withConfig({ runName: 'RerankDocuments' }),
            combineDocsChain,
            new output_parsers_1.StringOutputParser(),
        ]).withConfig({ runName: 'FinalRagChain' });
        const greetingChain = new runnables_1.RunnableLambda({
            func: (_input) => 'Halo! Ada yang bisa saya bantu terkait properti?',
        }).withConfig({ runName: 'GreetingChain' });
        this.masterChain = new runnables_1.RunnableBranch({
            branches: [
                [
                    new runnables_1.RunnableLambda({
                        func: (input) => this.isGreeting(input.input),
                    }),
                    greetingChain,
                ],
            ],
            default: ragChain,
        }).withConfig({ runName: 'MasterChain' });
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
    async ask(message) {
        if (!this.vectorStore) {
            return 'I am sorry, but I have no knowledge base to answer your question.';
        }
        if (!this.masterChain) {
            await this.initializeMasterChain();
        }
        console.log('Invoking master chain with question...');
        const result = await this.masterChain.invoke({
            chat_history: this.chatHistory,
            input: message,
        });
        const answer = result.answer ?? result;
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
        const doc = new documents_1.Document({
            pageContent,
            metadata: { source: 'uploaded_file' },
        });
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
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
        this.clearHistory();
        console.log(' File processed and Weaviate index updated.');
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service%20copy.js.map