import { UserFavorite } from '@/user-favorites/entities/user-favorite.entity';
import { Role } from '@/users/entities/role.entity';
export declare class User {
    id: string;
    email: string;
    phone_number: string;
    password_hash: string;
    full_name: string;
    role: Role;
    favorites: UserFavorite[];
    created_at: Date;
    updated_at: Date;
}
