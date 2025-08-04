import { IsOptional, IsString } from 'class-validator';

export class CreateDeveloperDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  logo_url: string;

  @IsString()
  @IsOptional()
  website_url: string;
}
