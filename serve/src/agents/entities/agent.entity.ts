import { Property } from '@/properties/entities/property.entity';
import { DeletedAtStatus } from '@/types/deleted_at';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({
    type: 'enum',
    enum: DeletedAtStatus,
    default: DeletedAtStatus.NOT_DELETED,
    nullable: true,
  })
  status_delete: DeletedAtStatus | null;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => Property, (property) => property.agent)
  property: Property[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
