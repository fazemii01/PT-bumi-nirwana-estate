import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatService } from './chat.service';

class AskDto {
  message: string;
  sessionId: string;
}


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.chatService.processFile(file);
  }

  @Post('ask')
  async ask(@Body() askDto: AskDto) {
    return this.chatService.ask(askDto.message, askDto.sessionId);
  }
}
