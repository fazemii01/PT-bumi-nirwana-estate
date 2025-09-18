import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserFavoritesService } from './user-favorites.service';
import { CreateUserFavoriteDto } from './dto/create-user-favorite.dto';
import { Roles } from '@/auths/role.decorator';

@Controller('user-favorites')
export class UserFavoritesController {
  constructor(private readonly userFavoritesService: UserFavoritesService) {}

  @Post()
  @Roles('USER', 'ADMIN')
  async create(@Body() createUserFavoriteDto: CreateUserFavoriteDto) {
    return await this.userFavoritesService.createOrRemove(
      createUserFavoriteDto,
    );
  }

  @Get()
  findAll() {
    return this.userFavoritesService.findAll();
  }
  @Roles('USER', 'ADMIN')
  @Get(':userId')
  async findOneByUser(@Param('userId') userId: string) {
    return await this.userFavoritesService.findOneByUserId(userId);
  }
}
