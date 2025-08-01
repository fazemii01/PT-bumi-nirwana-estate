import { Property } from '@/properties/entities/property.entity';
import { User } from '@/users/entities/user.entity';
export declare class UserFavorite {
    userId: string;
    propertyId: string;
    user: User;
    property: Property;
    created_at: Date;
}
