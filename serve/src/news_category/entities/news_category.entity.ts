import { News } from '@/news/entities/news.entity';
import { DeletedAtStatus } from '@/types/deleted_at';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('news_categories')
export class NewsCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => News, (news) => news.newsCategory, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  news: News[];

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: DeletedAtStatus,
    default: DeletedAtStatus.NOT_DELETED,
    nullable: true,
  })
  status_delete: DeletedAtStatus | null;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
