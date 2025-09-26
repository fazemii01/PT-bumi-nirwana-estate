import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUUID()
  categoryId: string;

  @Transform(({ value }) => {
    if (value === null || value === '' || value === 'null') {
      return null;
    }
    return value;
  })
  @ValidateIf((obj, value) => value !== null)
  @IsUUID()
  propertyId?: string | null;
}
