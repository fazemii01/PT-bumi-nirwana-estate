import { Module } from '@nestjs/common';
import { UserFavoritesService } from './user-favorites.service';
import { UserFavoritesController } from './user-favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFavorite } from '@/user-favorites/entities/user-favorite.entity';
import { User } from '@/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFavorite])],
  controllers: [UserFavoritesController],
  providers: [UserFavoritesService],
})
export class UserFavoritesModule {}
