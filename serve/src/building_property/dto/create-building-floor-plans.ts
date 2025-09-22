import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBuildingFloorPlansDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sort_order?: number;
}
