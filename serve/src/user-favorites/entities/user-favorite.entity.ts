import { Property } from '@/properties/entities/property.entity';
import { User } from '@/users/entities/user.entity';
import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('user_favorites')
export class UserFavorite {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  propertyId: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  property: Property;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
