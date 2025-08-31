import { ChatService } from './chat.service';
declare class AskDto {
    message: string;
    sessionId: string;
}
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    uploadFile(file: Express.Multer.File): Promise<void>;
    ask(askDto: AskDto): Promise<string>;
}
export {};
