import { IsString, IsUUID } from 'class-validator';

export class CreateUserFavoriteDto {
  @IsUUID()
  propertyId: string;
}