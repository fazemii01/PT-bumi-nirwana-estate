import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePropertyFloorPlansDto {
  @IsString()
  name: string;

  @IsInt()
  @IsOptional()
  sort_order?: number;
}
