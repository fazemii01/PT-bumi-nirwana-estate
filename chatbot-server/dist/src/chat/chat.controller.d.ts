import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    uploadFile(file: Express.Multer.File): Promise<void>;
    ask(message: string): Promise<string>;
}
