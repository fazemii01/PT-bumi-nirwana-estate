import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBuildingImageDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sort_order?: number;
}
