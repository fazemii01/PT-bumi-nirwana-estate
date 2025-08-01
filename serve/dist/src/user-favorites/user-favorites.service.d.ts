import { CreateUserFavoriteDto } from './dto/create-user-favorite.dto';
import { UpdateUserFavoriteDto } from './dto/update-user-favorite.dto';
export declare class UserFavoritesService {
    create(createUserFavoriteDto: CreateUserFavoriteDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserFavoriteDto: UpdateUserFavoriteDto): string;
    remove(id: number): string;
}
