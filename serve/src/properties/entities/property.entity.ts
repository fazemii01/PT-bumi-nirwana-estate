import { Agent } from '@/agents/entities/agent.entity';
import { Developer } from '@/developers/entities/developer.entity';
import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
import { News } from '@/news/entities/news.entity';
import { PropertyFloorPlan } from '@/properties/entities/property-floor-plan.entity';
import { PropertyImage } from '@/properties/entities/property-image.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

export enum PropertyStatus {
  PRE_LAUNCH = 'PRE_LAUNCH',
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  RESERVED = 'RESERVED',
}

export enum PriceUnit {
  TOTAL = 'TOTAL',
  PER_MONTH = 'PER_MONTH',
  PER_SQM = 'PER_SQM',
}

export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  RUKO = 'RUKO',
  KAVLING = 'KAVLING',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Developer, (developer) => developer.property, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'developerId' })
  developer: Developer;

  @ManyToOne(() => Agent, (agent) => agent.property, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  slug: string;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: PriceUnit,
    default: PriceUnit.TOTAL,
  })
  price_unit: PriceUnit;

  @Column({ type: 'enum', enum: PropertyType, default: PropertyType.HOUSE })
  type: PropertyType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  land_size: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  building_size: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  detail_description: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Column({ type: 'jsonb', nullable: true })
  address: object;

  @Column({ type: 'jsonb', nullable: true })
  specifications: object;

  @OneToMany(() => PropertyImage, (image) => image.property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  images: PropertyImage[];

  @OneToMany(() => PropertyFloorPlan, (floorPlan) => floorPlan.property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  floor_plans: PropertyFloorPlan[];

  @OneToMany(
    () => LoanSimulation,
    (loanSimulation) => loanSimulation.property,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  loan_simulations: [];

  @OneToMany(() => News, (news) => news.property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  news: News[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
