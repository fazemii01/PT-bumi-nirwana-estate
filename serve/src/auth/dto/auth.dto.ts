import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsString()
  email: string;

  passsword_hash: string;
}
