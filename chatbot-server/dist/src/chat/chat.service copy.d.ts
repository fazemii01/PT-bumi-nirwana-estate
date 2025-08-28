import { OnModuleInit } from '@nestjs/common';
export declare class ChatService implements OnModuleInit {
    private weaviateClient;
    private masterChain;
    private vectorStore;
    private embeddings;
    private visionModel;
    private chatHistory;
    onModuleInit(): Promise<void>;
    private rerankDocuments;
    private rerankInChunks;
    private rerankByTokenBudget;
    private truncateDoc;
    private initializeMasterChain;
    private isGreeting;
    ask(message: string): Promise<string>;
    clearHistory(): void;
    processFile(file: Express.Multer.File): Promise<void>;
}
