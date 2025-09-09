import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Roles } from '@/auths/role.decorator';
import { UseFileUploadInterceptor } from '@/file/upload.interceptor';
import * as fs from 'fs';
import { Developer } from '@/developers/entities/developer.entity';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Post()
  @Roles('ADMIN')
  @UseFileUploadInterceptor('logo_url', 'developer')
  async create(
    @Body() createDeveloperDto: CreateDeveloperDto,
    @UploadedFile() logo_url: Express.Multer.File,
  ): Promise<Developer> {
    try {
      return await this.developersService.create(createDeveloperDto, logo_url);
    } catch (error) {
      try {
        await fs.promises.unlink(logo_url.path);
      } catch (error) {
        console.log(error);
      }
      throw error;
    }
  }

  @Get()
  @Roles('ADMIN')
  async findAll(): Promise<Developer[]> {
    return await this.developersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param('id') id: string): Promise<Developer | null> {
    return await this.developersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseFileUploadInterceptor('logo_url', 'developer')
  async update(
    @Param('id') id: string,
    @Body() updateDeveloperDto: UpdateDeveloperDto,
    @UploadedFile() logo_url: Express.Multer.File,
  ): Promise<Developer> {
    try {
      return await this.developersService.update(
        id,
        updateDeveloperDto,
        logo_url,
      );
    } catch (error) {
      try {
        await fs.promises.unlink(logo_url.path);
      } catch (error) {
        console.log(error);
      }
      throw error;
    }
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return await this.developersService.remove(id);
  }
}
