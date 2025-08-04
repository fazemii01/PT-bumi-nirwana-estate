import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { UserFavorite } from '@/user-favorites/entities/user-favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserFavorite])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
