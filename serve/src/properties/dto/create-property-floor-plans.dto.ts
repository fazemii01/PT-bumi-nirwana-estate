import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePropertyFloorPlansDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sort_order?: number;
}
