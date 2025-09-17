import { Bank } from '@/banks/entities/bank.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface KprRuleMetadata {
  bank_id: string;
}

@Entity({ name: 'kpr_rules' })
export class CekEligibility {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Bank, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @Column({ type: 'uuid', nullable: true })
  bank_id: string | null;

  @Column('text')
  rule_text: string;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      from: (value: string) => (value ? JSON.parse(value) : null),
      to: (value: number[]) => (value ? `[${value.join(',')}]` : null),
    },
  })
  embedding: number[] | null;

  @Column({ type: 'jsonb', default: {} })
  metadata: KprRuleMetadata;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
  updated_at: Date;
}
