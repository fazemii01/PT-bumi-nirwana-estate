import { BuildingProperty } from '@/building_property/entities/building_property.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class BuildingKprRules {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => BuildingProperty,
    (buildingProperty) => buildingProperty.images,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'building_propertyId' })
  building_property: BuildingProperty;

  @Column({ type: 'text', nullable: true })
  file_url: string;
}
