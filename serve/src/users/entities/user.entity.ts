import { UserFavorite } from '@/user-favorites/entities/user-favorite.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password_hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => UserFavorite, (favorite) => favorite.user)
  favorites: UserFavorite[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
