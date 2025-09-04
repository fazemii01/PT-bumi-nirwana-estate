import { IsUUID } from 'class-validator';

export class CreateUserFavoriteDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  userId: string;
}
