import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFavorite } from '../users/user-favorite.entity';
import { CreateUserFavoriteDto } from './dto/create-user-favorite.dto';

@Injectable()
export class UserFavoritesService {
  constructor(
    @InjectRepository(UserFavorite)
    private userFavoritesRepository: Repository<UserFavorite>,
  ) {}

  async addFavorite(
    userId: string,
    createUserFavoriteDto: CreateUserFavoriteDto,
  ): Promise<UserFavorite> {
    const { propertyId } = createUserFavoriteDto;
    const newFavorite = this.userFavoritesRepository.create({
      user: { id: userId },
      property: { id: propertyId },
    });
    return this.userFavoritesRepository.save(newFavorite);
  }

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    await this.userFavoritesRepository.delete({
      user: { id: userId },
      property: { id: propertyId },
    });
  }

  async getFavorites(userId: string): Promise<UserFavorite[]> {
    return this.userFavoritesRepository.find({
      where: { user: { id: userId } },
      relations: ['property'],
    });
  }
}
