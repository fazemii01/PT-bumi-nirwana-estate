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

@Entity('developers')
export class Developer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  logo_url: string;

  @Column({ type: 'text', nullable: true })
  website_url: string;

  @Column({
    type: 'enum',
    enum: DeletedAtStatus,
    default: DeletedAtStatus.NOT_DELETED,
    nullable: true,
  })
  status_delete: DeletedAtStatus | null;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => Property, (property) => property.developer)
  property: Property[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
