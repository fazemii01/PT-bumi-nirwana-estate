import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Property } from '../properties/property.entity';

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