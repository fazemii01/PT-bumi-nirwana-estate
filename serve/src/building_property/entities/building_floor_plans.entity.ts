import { BuildingProperty } from '@/building_property/entities/building_property.entity';
import { Property } from '@/properties/entities/property.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('building_floor_plans')
export class BuildingFloorPlans {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BuildingProperty, (building) => building.floor_plans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'building_propertyId' })
  building_property: BuildingProperty;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  file_url: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}
