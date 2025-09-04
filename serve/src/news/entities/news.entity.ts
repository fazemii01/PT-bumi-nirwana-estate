import { Type } from 'class-transformer';
import { NewsCategory } from '@/news_category/entities/news_category.entity';
import { Property } from '@/properties/entities/property.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NewsImages } from '@/news/entities/news_images.entity';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 225, unique: true, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 225, unique: true, nullable: false })
  slug: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @ManyToOne(() => NewsCategory, (category) => category.news, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  newsCategory: NewsCategory;

  @ManyToOne(() => Property, (property) => property.news, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @OneToMany(() => NewsImages, (images) => images.news)
  newsImages: NewsImages[];
}
