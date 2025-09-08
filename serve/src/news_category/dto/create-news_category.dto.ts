import { IsString } from 'class-validator';

export class CreateNewsCategoryDto {
  @IsString()
  name: string;
}
