import { AiService } from '@/ai/ai.service';
import { OllamaModule } from '@/ollama/ollama.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [OllamaModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
