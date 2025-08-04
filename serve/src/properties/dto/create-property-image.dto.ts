import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePropertyImageDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsInt()
  @IsOptional()
  sort_order?: number;
}
