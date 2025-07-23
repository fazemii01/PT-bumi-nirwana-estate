import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserFavoritesService } from './user-favorites.service';
import { CreateUserFavoriteDto } from './dto/create-user-favorite.dto';

@Controller('user-favorites')
@UseGuards(JwtAuthGuard)
export class UserFavoritesController {
  constructor(private readonly userFavoritesService: UserFavoritesService) {}

  @Post()
  addFavorite(
    @Request() req,
    @Body() createUserFavoriteDto: CreateUserFavoriteDto,
  ) {
    const userId = req.user.userId;
    return this.userFavoritesService.addFavorite(userId, createUserFavoriteDto);
  }

  @Delete(':propertyId')
  removeFavorite(@Request() req, @Param('propertyId') propertyId: string) {
    const userId = req.user.userId;
    return this.userFavoritesService.removeFavorite(userId, propertyId);
  }

  @Get()
  getFavorites(@Request() req) {
    const userId = req.user.userId;
    return this.userFavoritesService.getFavorites(userId);
  }
}
