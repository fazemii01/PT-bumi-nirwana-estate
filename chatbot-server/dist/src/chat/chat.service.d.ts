import { OnModuleInit } from '@nestjs/common';
export declare class ChatService implements OnModuleInit {
    private conversationalChain;
    private vectorStore;
    private embeddings;
    private visionModel;
    private chatHistory;
    onModuleInit(): Promise<void>;
    private initializeConversationalChain;
    private formatDocs;
    ask(message: string): Promise<string>;
    clearHistory(): void;
    processFile(file: Express.Multer.File): Promise<void>;
}
