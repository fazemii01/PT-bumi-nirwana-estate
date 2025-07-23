import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFavorite } from '../users/user-favorite.entity';
import { UserFavoritesController } from './user-favorites.controller';
import { UserFavoritesService } from './user-favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserFavorite])],
  controllers: [UserFavoritesController],
  providers: [UserFavoritesService],
})
export class UserFavoritesModule {}
