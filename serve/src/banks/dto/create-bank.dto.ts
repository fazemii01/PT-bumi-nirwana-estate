import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateBankDto {
  @IsString()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  interest_rate: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  min_tenure: number;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  max_tenure: number;
}
