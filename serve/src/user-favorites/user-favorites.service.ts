import { Injectable } from '@nestjs/common';
import { CreateUserFavoriteDto } from './dto/create-user-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFavorite } from '@/user-favorites/entities/user-favorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserFavoritesService {
  constructor(
    @InjectRepository(UserFavorite)
    private readonly userFavoRepo: Repository<UserFavorite>,
  ) {}

  async createOrRemove(createUserFavoriteDto: CreateUserFavoriteDto) {
    const existing = await this.userFavoRepo.findOneBy({
      userId: createUserFavoriteDto.userId,
      propertyId: createUserFavoriteDto.propertyId,
    });

    if (existing) {
      await this.userFavoRepo.remove(existing);
      return { status: 'removed' };
    } else {
      const fav = this.userFavoRepo.create({
        userId: createUserFavoriteDto.userId,
        propertyId: createUserFavoriteDto.propertyId,
      });
      await this.userFavoRepo.save(fav);
      return { status: 'added' };
    }
  }

  findAll() {
    return `This action returns all userFavorites`;
  }

  async findOneByUserId(userId: string): Promise<UserFavorite[]> {
    return await this.userFavoRepo.find({
      where: { userId },
      relations: [
        'user',
        'property',
        'property.images',
        'property.floor_plans',
      ],
    });
  }
}
