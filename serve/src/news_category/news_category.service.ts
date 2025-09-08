import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsCategoryDto } from './dto/create-news_category.dto';
import { UpdateNewsCategoryDto } from './dto/update-news_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsCategory } from '@/news_category/entities/news_category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsCategoryService {
  constructor(
    @InjectRepository(NewsCategory)
    private readonly newsCategoryRepository: Repository<NewsCategory>,
  ) {}

  async create(createNewsCategoryDto: CreateNewsCategoryDto) {
    const category = await this.newsCategoryRepository.create(
      createNewsCategoryDto,
    );
    return this.newsCategoryRepository.save(category);
  }

  async findAll() {
    return await this.newsCategoryRepository.find();
  }

  async findOne(id: string) {
    const category = await this.newsCategoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException('Categori berita tidak ditemukan');
    return category;
  }

  async update(id: string, updateNewsCategoryDto: UpdateNewsCategoryDto) {
    const category = await this.newsCategoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException('Categori berita tidak ditemukan');
    Object.assign(category, updateNewsCategoryDto);
    return await this.newsCategoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.newsCategoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException('Categori berita tidak ditemukan');
    await this.newsCategoryRepository.remove(category);
    return { message: 'Delete successfull' };
  }
}
