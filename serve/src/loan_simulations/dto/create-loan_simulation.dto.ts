import { LoanStatus } from '@/loan_simulations/entities/loan_simulation.entity';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateLoanSimulationDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  bankId: string;

  @IsUUID()
  userId: string;

  @Transform(({ value }) =>
    value !== null && value !== undefined ? Number(value) : value,
  )
  @IsNumber()
  @IsOptional()
  down_payment: number;

  @Transform(({ value }) =>
    value !== null && value !== undefined ? Number(value) : value,
  )
  @IsNumber()
  tenure: number;

  @IsEnum(LoanStatus)
  status: LoanStatus;
}
