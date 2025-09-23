import { Type } from 'class-transformer';
import { BuildingFloorPlans } from '@/building_property/entities/building_floor_plans.entity';
import { BuildingImages } from '@/building_property/entities/building_images.entity';
import { BuildingKprRules } from '@/building_property/entities/building_kpr_rules.entity';
import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
import { Property } from '@/properties/entities/property.entity';
import { DeletedAtStatus } from '@/types/deleted_at';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BuildingStatus {
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

@Entity('building_property')
export class BuildingProperty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property, (property) => property.building_property, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 11, nullable: false })
  total_units: string;

  @Column({
    type: 'enum',
    enum: BuildingStatus,
    default: BuildingStatus.AVAILABLE,
  })
  status: BuildingStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: PriceUnit,
    default: PriceUnit.TOTAL,
  })
  price_unit: PriceUnit;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  land_size: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  building_size: number;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  specifications: object;

  @OneToMany(
    () => LoanSimulation,
    (loanSimulation) => loanSimulation.building_property,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  loan_simulations: LoanSimulation[];

  @OneToMany(() => BuildingKprRules, (rules) => rules.building_property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  building_kpr_rules: BuildingKprRules[];

  @OneToMany(() => BuildingImages, (images) => images.building_property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  images: BuildingImages[];

  @OneToMany(() => BuildingFloorPlans, (floor) => floor.building_property, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  floor_plans: BuildingFloorPlans[];

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
