import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Roles } from '@/auths/role.decorator';
import { UseMultipleFileUploadInterceptor } from '@/file/multi-upload.interceptor';
import { News } from '@/news/entities/news.entity';
import { Public } from '@/auths/public.decorator';
import * as fs from 'fs';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles('ADMIN')
  @UseMultipleFileUploadInterceptor('news')
  @Post()
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFiles() files: { news_images: Express.Multer.File[] },
  ): Promise<News> {
    const newImages = files.news_images || [];
    try {
      return await this.newsService.create(createNewsDto, newImages);
    } catch (error) {
      for (const file of newImages) {
        try {
          await fs.promises.unlink(file.path);
        } catch (error) {
          console.log(error);
        }
      }
      throw error;
    }
  }

  @Get()
  @Public()
  async findAll(): Promise<News[]> {
    return await this.newsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<News | null> {
    return this.newsService.findOne(id);
  }

  @Get('category/:categoryName')
  @Public()
  async findAllByCategory(
    @Param('categoryName') categoryName: string,
  ): Promise<News[]> {
    return await this.newsService.findAllByCategory(categoryName);
  }
  // @Get('/category/:categoryId')
  // @Public()
  // async findOneBySlug(
  //   @Param('categoryId') categoryId: string,
  // ): Promise<News[]> {
  //   return await this.newsService.findOneByCatgoryId(categoryId);
  // }

  @Patch(':id')
  @Roles('ADMIN')
  @UseMultipleFileUploadInterceptor('news')
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFiles() files: { news_images: Express.Multer.File[] },
  ) {
    const newImages = files.news_images || [];
    try {
      return await this.newsService.update(id, updateNewsDto, newImages);
    } catch (error) {
      for (const file of newImages) {
        try {
          await fs.promises.unlink(file.path);
        } catch (error) {
          console.log(error);
        }
      }
      throw error;
    }
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.newsService.remove(id);
  }
}
