import { News } from '@/news/entities/news.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('news_images')
export class NewsImages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => News, (news) => news.newsImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'newsId' })
  news: News;

  @Column({ type: 'varchar', length: 255, nullable: false })
  img_url: string;
}
