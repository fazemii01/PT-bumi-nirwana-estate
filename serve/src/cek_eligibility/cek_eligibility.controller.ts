import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CekEligibilityService } from './cek_eligibility.service';
import { Roles } from '@/auths/role.decorator';

@Controller('cek-eligibility')
export class CekEligibilityController {
  constructor(private readonly cekEligibilityService: CekEligibilityService) {}

  @Roles('ADMIN', 'USER')
  @Post()
  async checkFromText(@Body('question') question: string) {
    return await this.cekEligibilityService.checkEligibilityFromText(question);
  }
}
