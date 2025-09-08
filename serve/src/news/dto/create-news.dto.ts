import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  @IsOptional()
  propertyId: string;
}
