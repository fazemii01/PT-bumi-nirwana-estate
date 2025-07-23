import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Developer } from '../developers/developer.entity';
import { Agent } from '../agents/agent.entity';
import { PropertyImage } from './property-image.entity';
import { PropertyFloorPlan } from './property-floor-plan.entity';

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

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Developer, { nullable: true, onDelete: 'SET NULL' })
  developer: Developer;

  @ManyToOne(() => Agent, { nullable: true, onDelete: 'SET NULL' })
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

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: PriceUnit,
    default: PriceUnit.TOTAL,
  })
  price_unit: PriceUnit;

  @Column({ type: 'varchar', length: 3, nullable: false, default: 'IDR' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: string;

  @Column({ type: 'jsonb', nullable: true })
  address: object;

  @Column({ type: 'jsonb', nullable: true })
  specifications: object;

  @OneToMany(() => PropertyImage, (image) => image.property)
  images: PropertyImage[];

  @OneToMany(() => PropertyFloorPlan, (floorPlan) => floorPlan.property)
  floor_plans: PropertyFloorPlan[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}