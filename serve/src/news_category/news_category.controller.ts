import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewsCategoryService } from './news_category.service';
import { CreateNewsCategoryDto } from './dto/create-news_category.dto';
import { UpdateNewsCategoryDto } from './dto/update-news_category.dto';
import { Roles } from '@/auths/role.decorator';

@Controller('news-category')
export class NewsCategoryController {
  constructor(private readonly newsCategoryService: NewsCategoryService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createNewsCategoryDto: CreateNewsCategoryDto) {
    return this.newsCategoryService.create(createNewsCategoryDto);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.newsCategoryService.findAll();
  }

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsCategoryService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsCategoryDto: UpdateNewsCategoryDto,
  ) {
    console.log(updateNewsCategoryDto);

    return this.newsCategoryService.update(id, updateNewsCategoryDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsCategoryService.remove(id);
  }
}
