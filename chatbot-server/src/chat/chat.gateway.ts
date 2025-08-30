import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // This function ONLY handles the 'message' event
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const sessionId = client.id;
    const response = await this.chatService.ask(message, sessionId);
    client.emit('response', response);
  }

  // This function ONLY handles the 'clear history' event
  @SubscribeMessage('clear history')
  handleClearHistory(@ConnectedSocket() client: Socket): void {
    this.chatService.clearHistory(client.id);
    console.log(`Chat history for client ${client.id} cleared via event.`);
  }
  // This function handles the disconnect event
  handleDisconnect(client: Socket) {

    this.chatService.clearHistory(client.id);
    console.log(`Client disconnected: ${client.id}, history cleared.`);
  }
}
