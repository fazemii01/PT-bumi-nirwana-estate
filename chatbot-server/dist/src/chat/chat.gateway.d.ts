import { OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleMessage(message: string, client: Socket): Promise<void>;
    handleClearHistory(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
