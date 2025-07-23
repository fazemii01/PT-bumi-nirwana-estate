import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from './property.entity';

@Entity('property_floor_plans')
export class PropertyFloorPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property, (property) => property.floor_plans, { onDelete: 'CASCADE' })
  property: Property;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  file_url: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}