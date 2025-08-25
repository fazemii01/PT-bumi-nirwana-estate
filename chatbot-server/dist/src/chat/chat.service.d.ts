import { OnModuleInit } from '@nestjs/common';
export declare class ChatService implements OnModuleInit {
    private greetingChain;
    private masterChain;
    private conversationalChain;
    private directChain;
    private vectorStore;
    private embeddings;
    private visionModel;
    private chatHistory;
    private llamaVision;
    private llamaEmbeddings;
    onModuleInit(): Promise<void>;
    private initializeConversationalChain;
    private isGreeting;
    private formatDocs;
    ask(message: string): Promise<string>;
    clearHistory(): void;
    processFile(file: Express.Multer.File): Promise<void>;
}
