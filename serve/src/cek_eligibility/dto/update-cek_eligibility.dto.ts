import { PartialType } from '@nestjs/mapped-types';
import { CreateCekEligibilityDto } from './create-cek_eligibility.dto';

export class UpdateCekEligibilityDto extends PartialType(CreateCekEligibilityDto) {}
