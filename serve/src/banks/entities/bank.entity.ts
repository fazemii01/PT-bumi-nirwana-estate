import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
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
  max_tenure: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  logo: string;

  @OneToMany(() => LoanSimulation, (loanSimulation) => loanSimulation.bank)
  loan_simulations: LoanSimulation[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
