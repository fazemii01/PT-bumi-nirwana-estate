import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
export declare class ChatbotService {
    create(createChatbotDto: CreateChatbotDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateChatbotDto: UpdateChatbotDto): string;
    remove(id: number): string;
}
