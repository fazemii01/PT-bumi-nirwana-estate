import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  full_name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsString()
  @IsOptional()
  avatar_url: string;
}
