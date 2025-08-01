import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password_hash: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
