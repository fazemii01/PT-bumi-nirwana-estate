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
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UseMultipleFileUploadInterceptor } from '@/file/multi-upload.interceptor';
import { Roles } from '@/auths/role.decorator';
import { Property } from '@/properties/entities/property.entity';
import { Public } from '@/auths/public.decorator';
import * as fs from 'fs';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Roles('ADMIN')
  @Post()
  @UseMultipleFileUploadInterceptor('property')
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles()
    files: {
      property_images?: Express.Multer.File[];
      property_floor_plans?: Express.Multer.File[];
    },
  ): Promise<Property> {
    const property_images = files.property_images || [];
    const property_floor_plans = files.property_floor_plans || [];
    try {
      return await this.propertiesService.create(
        createPropertyDto,
        property_images,
        property_floor_plans,
      );
    } catch (error) {
      for (const images_file of property_images) {
        try {
          await fs.promises.unlink(images_file.path);
        } catch (error) {
          console.log(error);
        }
      }

      for (const floor_file of property_floor_plans) {
        try {
          await fs.promises.unlink(floor_file.path);
        } catch (error) {
          console.log(error);
        }
      }
      throw error;
    }
  }

  @Public()
  @Get()
  async findAll(): Promise<Property[]> {
    return await this.propertiesService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Property | null> {
    return this.propertiesService.findOne(id);
  }

  @Public()
  @Get('type/:type')
  async findOneByType(@Param('type') type: string): Promise<Property[]> {
    return this.propertiesService.findOneByType(type);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseMultipleFileUploadInterceptor('property')
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles()
    files?: {
      property_images?: Express.Multer.File[];
      property_floor_plans?: Express.Multer.File[];
    },
  ): Promise<Property | undefined> {
    const property_images = files?.property_images || [];
    const property_floor_plans = files?.property_floor_plans || [];
    try {
      return this.propertiesService.update(
        id,
        updatePropertyDto,
        property_images,
        property_floor_plans,
      );
    } catch (error) {
      for (const images_file of property_images) {
        try {
          await fs.promises.unlink(images_file.path);
        } catch (error) {
          console.log(error);
        }
      }

      for (const floor_file of property_floor_plans) {
        try {
          await fs.promises.unlink(floor_file.path);
        } catch (error) {
          console.log(error);
        }
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
