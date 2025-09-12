import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

  // @Post('upload')
  // @UseInterceptors(FilesInterceptor('file')) 
  // async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
  //   await this.chatService.processBatch(files);
  //   return { message: 'Batch upload complete' };
  // }

  @Post('ask')
  async ask(@Body() askDto: AskDto) {
    return this.chatService.ask(askDto.message, askDto.sessionId);
  }
}
