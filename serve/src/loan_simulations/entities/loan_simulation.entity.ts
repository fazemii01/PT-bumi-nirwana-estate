import { Bank } from '@/banks/entities/bank.entity';
import { Property } from '@/properties/entities/property.entity';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LoanStatus {
  SIMULATED = 'SIMULATED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('loan_simulations')
export class LoanSimulation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.loan_simulations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Bank, (bank) => bank.loan_simulations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'bankId' })
  bank: Bank;

  @ManyToOne(() => Property, (property) => property.loan_simulations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  loan_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  down_payment: number;

  @Column({ type: 'integer', nullable: false })
  tenure: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  monthly_installment: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  interest_rate: number;

  @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.SIMULATED })
  status: LoanStatus;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
