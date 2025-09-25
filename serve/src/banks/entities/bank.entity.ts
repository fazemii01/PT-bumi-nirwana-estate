import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
import { DeletedAtStatus } from '@/types/deleted_at';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banks')
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  interest_rate: number;

  @Column({ type: 'integer', nullable: false })
  min_tenure: number;

  @Column({ type: 'integer', nullable: false })
  max_tenure: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  logo: string;

  @Column({
    type: 'enum',
    enum: DeletedAtStatus,
    default: DeletedAtStatus.NOT_DELETED,
    nullable: true,
  })
  status_delete: DeletedAtStatus | null;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => LoanSimulation, (loanSimulation) => loanSimulation.bank)
  loan_simulations: LoanSimulation[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
