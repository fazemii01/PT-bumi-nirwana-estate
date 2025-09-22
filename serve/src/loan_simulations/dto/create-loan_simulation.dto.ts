import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateLoanSimulationDto {
  @IsUUID()
  buildingPropertyId: string;

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
}
