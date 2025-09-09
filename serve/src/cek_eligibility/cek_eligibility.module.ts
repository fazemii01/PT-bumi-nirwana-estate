import { Module } from '@nestjs/common';
import { CekEligibilityService } from './cek_eligibility.service';
import { CekEligibilityController } from './cek_eligibility.controller';

@Module({
  controllers: [CekEligibilityController],
  providers: [CekEligibilityService],
})
export class CekEligibilityModule {}
