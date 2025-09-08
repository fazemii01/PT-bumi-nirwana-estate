import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  flatten,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Roles } from '@/auths/role.decorator';
import { UseMultipleFileUploadInterceptor } from '@/file/multi-upload.interceptor';
import { News } from '@/news/entities/news.entity';
import { Public } from '@/auths/public.decorator';

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
    return await this.newsService.create(createNewsDto, newImages);
  }

  @Get()
  @Public()
  async findAll(): Promise<News[]> {
    return await this.newsService.findAll();
  }

  @Get(':slug')
  @Public()
  async findOne(@Param('slug') slug: string): Promise<News | null> {
    return await this.newsService.findOneBySlug(slug);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseMultipleFileUploadInterceptor('news')
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFiles() files: { news_images: Express.Multer.File[] },
  ) {
    const newImages = files.news_images || [];
    return await this.newsService.update(id, updateNewsDto, newImages);
  }
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.newsService.remove(id);
  }
}
