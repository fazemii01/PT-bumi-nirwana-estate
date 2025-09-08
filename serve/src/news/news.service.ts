import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from '@/news/entities/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsCategory } from '@/news_category/entities/news_category.entity';
import { Property } from '@/properties/entities/property.entity';
import { NewsImages } from '@/news/entities/news_images.entity';
import slugify from 'slugify';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,

    @InjectRepository(NewsCategory)
    private readonly newsCategoryRepository: Repository<NewsCategory>,

    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

    @InjectRepository(NewsImages)
    private readonly newsImagesRepository: Repository<NewsImages>,
  ) {}

  async create(
    createNewsDto: CreateNewsDto,
    newsImages: Express.Multer.File[],
  ) {
    const slug = slugify(createNewsDto.title, { lower: true });
    const exitingSlug = await this.newsRepository.findOneBy({ slug });
    if (exitingSlug) {
      throw new ConflictException(
        `Judul berita ${createNewsDto.title} sudah ada`,
      );
    }

    const news = new News();
    const newsCategory = await this.newsCategoryRepository.findOne({
      where: { id: createNewsDto.categoryId },
    });

    if (!newsCategory) throw new NotFoundException();
    news.title = createNewsDto.title;
    news.slug = slug;
    news.description = createNewsDto.description;
    news.newsCategory = newsCategory;

    if (createNewsDto.propertyId) {
      const property = await this.propertyRepository.findOne({
        where: { id: createNewsDto.propertyId },
      });

      if (!property) throw new NotFoundException();
      news.property = property;
    }

    const saveNews = await this.newsRepository.save(news);
    if (newsImages) {
      const images = newsImages.map((img) => {
        return this.newsImagesRepository.create({
          img_url: img.filename,
          news: saveNews,
        });
      });
      await this.newsImagesRepository.save(images);
    }

    return saveNews;
  }

  async findAll() {
    return await this.newsRepository.find({
      relations: [
        'newsCategory',
        'newsImages',
        'property',
        'property.images',
        'property.floor_plans',
      ],
    });
  }

  async findOneBySlug(slug: string) {
    const news = await this.newsRepository.findOne({
      where: { slug: slug },
      relations: [
        'newsCategory',
        'newsImages',
        'property',
        'property.images',
        'property.floor_plans',
      ],
    });

    if (!news) throw new NotFoundException();

    return news;
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    newsImages: Express.Multer.File[],
  ) {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: [
        'newsCategory',
        'newsImages',
        'property',
        'property.images',
        'property.floor_plans',
      ],
    });

    if (!news) throw new NotFoundException();

    if (newsImages) {
      for (const images of news.newsImages) {
        this.deleteFileFromUploads('news_images', images.img_url);
      }
      await this.newsImagesRepository.remove(news.newsImages);
    }

    Object.assign(news, updateNewsDto);

    if (updateNewsDto.title) {
      const slug = slugify(updateNewsDto.title, { lower: true });
      if (slug !== news.slug) {
        const exitingSlug = await this.propertyRepository.findOne({
          where: { slug },
        });
        if (exitingSlug)
          throw new ConflictException(
            `Judul berita with ${updateNewsDto.title} sudah ada`,
          );
      }
      news.slug = slug;
      news.title = updateNewsDto.title;
    }

    if (newsImages) {
      const images = newsImages.map((img) => {
        return this.newsImagesRepository.create({
          img_url: img.filename,
          news: news,
        });
      });
      await this.newsImagesRepository.save(images);
    }

    return news;
  }

  async remove(id: string) {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: [
        'newsCategory',
        'newsImages',
        'property',
        'property.images',
        'property.floor_plans',
      ],
    });

    if (!news) throw new NotFoundException();

    if (news.newsImages.length > 0) {
      for (const newsImages of news.newsImages) {
        this.deleteFileFromUploads('news_images', newsImages.img_url);
      }
    }
    await this.newsRepository.remove(news);
    return { message: 'Delete successfull' };
  }

  private async deleteFileFromUploads(subFolder: string, filename: string) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      `uploads/news/${subFolder}`,
      filename,
    );
    try {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filename}`);
    } catch (err) {
      console.error(`Could not delete file ${filename}:`, err.message);
    }
  }
}
