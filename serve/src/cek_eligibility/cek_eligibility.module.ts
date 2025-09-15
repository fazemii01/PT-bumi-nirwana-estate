import { Module } from '@nestjs/common';
import { CekEligibilityService } from './cek_eligibility.service';
import { CekEligibilityController } from './cek_eligibility.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CekEligibility } from '@/cek_eligibility/entities/cek_eligibility.entity';
import { Bank } from '@/banks/entities/bank.entity';
import { OllamaService } from '@/ollama/ollama.service';
import { AiModule } from '@/ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([CekEligibility, Bank]), AiModule],
  controllers: [CekEligibilityController],
  providers: [CekEligibilityService],
})
export class CekEligibilityModule {}
