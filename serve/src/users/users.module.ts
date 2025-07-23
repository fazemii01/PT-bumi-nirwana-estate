import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserFavorite } from './user-favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserFavorite])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
