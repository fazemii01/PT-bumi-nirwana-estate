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
import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
import { DeletedAtStatus } from '@/types/deleted_at';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  google_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => UserFavorite, (favorite) => favorite.user)
  favorites: UserFavorite[];

  @OneToMany(() => LoanSimulation, (loanSimulation) => loanSimulation.user)
  loan_simulations: LoanSimulation[];

  @Column({
    type: 'enum',
    enum: DeletedAtStatus,
    default: DeletedAtStatus.NOT_DELETED,
    nullable: true,
  })
  status_delete: DeletedAtStatus | null;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
