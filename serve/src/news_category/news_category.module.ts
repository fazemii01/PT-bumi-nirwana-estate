import { Module } from '@nestjs/common';
import { NewsCategoryService } from './news_category.service';
import { NewsCategoryController } from './news_category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsCategory } from '@/news_category/entities/news_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsCategory])],
  controllers: [NewsCategoryController],
  providers: [NewsCategoryService],
})
export class NewsCategoryModule {}
