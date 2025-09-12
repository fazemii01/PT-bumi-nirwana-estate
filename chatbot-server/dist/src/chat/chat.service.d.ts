import { OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
export declare class ChatService implements OnModuleInit {
    private readonly httpService;
    private weaviateClient;
    private masterChain;
    private vectorStore;
    private embeddings;
    private visionModel;
    private chatHistories;
    constructor(httpService: HttpService);
    onModuleInit(): Promise<void>;
    private rerankDocuments;
    private rerankInChunks;
    private rerankByTokenBudget;
    private truncateDoc;
    private initializeMasterChain;
    private isGreeting;
    ask(message: string, sessionId: string): Promise<string>;
    clearHistory(sessionId: string): void;
    clearAllHistories(): void;
    private clearIndexData;
    processBatch(files: Express.Multer.File[]): Promise<void>;
    processFile(file: Express.Multer.File): Promise<void>;
}
