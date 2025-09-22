import { BuildingProperty } from '@/building_property/entities/building_property.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('building_images')
export class BuildingImages {
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

  @Column({ type: 'text', nullable: false })
  image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}
