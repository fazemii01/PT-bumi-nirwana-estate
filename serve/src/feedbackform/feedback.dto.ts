import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
