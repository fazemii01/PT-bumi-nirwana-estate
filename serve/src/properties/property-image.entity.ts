import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from './property.entity';

@Entity('property_images')
export class PropertyImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property, (property) => property.images, { onDelete: 'CASCADE' })
  property: Property;

  @Column({ type: 'text', nullable: false })
  image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}