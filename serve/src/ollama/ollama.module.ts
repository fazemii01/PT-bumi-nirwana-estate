import { OllamaService } from '@/ollama/ollama.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [OllamaService],
  exports: [OllamaService],
})
export class OllamaModule {}
