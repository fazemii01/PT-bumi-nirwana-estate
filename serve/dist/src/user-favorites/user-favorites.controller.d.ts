import { UserFavoritesService } from './user-favorites.service';
import { CreateUserFavoriteDto } from './dto/create-user-favorite.dto';
import { UpdateUserFavoriteDto } from './dto/update-user-favorite.dto';
export declare class UserFavoritesController {
    private readonly userFavoritesService;
    constructor(userFavoritesService: UserFavoritesService);
    create(createUserFavoriteDto: CreateUserFavoriteDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUserFavoriteDto: UpdateUserFavoriteDto): string;
    remove(id: string): string;
}
