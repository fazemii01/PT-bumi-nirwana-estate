import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    create(createChatbotDto: CreateChatbotDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateChatbotDto: UpdateChatbotDto): string;
    remove(id: string): string;
}
