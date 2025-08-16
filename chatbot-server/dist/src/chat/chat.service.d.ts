import { OnModuleInit } from '@nestjs/common';
export declare class ChatService implements OnModuleInit {
    private chain;
    private vectorStore;
    private embeddings;
    private visionModel;
    onModuleInit(): Promise<void>;
    private initializeChain;
    private formatDocs;
    ask(message: string): Promise<string>;
    processFile(file: Express.Multer.File): Promise<void>;
}
