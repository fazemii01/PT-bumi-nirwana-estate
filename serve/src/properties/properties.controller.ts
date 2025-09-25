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
import { CreatePropertyImageDto } from '@/properties/dto/create-property-image.dto';
import { PropertyImage } from '@/properties/entities/property_images.entity';
import { CreatePropertySitePlansDto } from '@/properties/dto/create-property-site-plans.dto';
import { PropertySitePlan } from '@/properties/entities/property_site_plans.entity';

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
      property_site_plans?: Express.Multer.File[];
    },
  ): Promise<Property> {
    const property_images = files.property_images || [];
    const property_site_plans = files.property_site_plans || [];
    try {
      return await this.propertiesService.create(
        createPropertyDto,
        property_images,
        property_site_plans,
      );
    } catch (error) {
      for (const images_file of property_images) {
        try {
          await fs.promises.unlink(images_file.path);
        } catch (error) {
          console.log(error);
        }
      }

      for (const site_file of property_site_plans) {
        try {
          await fs.promises.unlink(site_file.path);
        } catch (error) {
          console.log(error);
        }
      }
      throw error;
    }
  }

  @Roles('ADMIN')
  @Post('create-images/:id')
  @UseMultipleFileUploadInterceptor('property')
  async createImagesProperty(
    @Param('id') id: string,
    @Body('images') createPropertyImageDto: CreatePropertyImageDto[],
    @UploadedFiles()
    files: {
      property_images?: Express.Multer.File[];
    },
  ): Promise<PropertyImage[]> {
    const property_images = files.property_images || [];
    try {
      return await this.propertiesService.createImageProperty(
        id,
        property_images,
        createPropertyImageDto,
      );
    } catch (error) {
      for (const images_file of property_images) {
        try {
          await fs.promises.unlink(images_file.path);
        } catch (error) {
          console.log(error);
        }
      }
      throw error;
    }
  }

  @Roles('ADMIN')
  @Post('property-site-plan/:id')
  @UseMultipleFileUploadInterceptor('property')
  async createSitePlanProperty(
    @Param('id') id: string,
    @Body('site_plans')
    createPropertySitePlansDto: CreatePropertySitePlansDto[],
    @UploadedFiles()
    files: {
      property_site_plans?: Express.Multer.File[];
    },
  ): Promise<PropertySitePlan[]> {
    const property_site_plans = files.property_site_plans || [];
    try {
      return await this.propertiesService.createSitePlanProperty(
        id,
        property_site_plans,
        createPropertySitePlansDto,
      );
    } catch (error) {
      for (const site_plan of property_site_plans) {
        try {
          await fs.promises.unlink(site_plan.path);
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
      property_site_plans?: Express.Multer.File[];
    },
  ): Promise<Property | undefined> {
    const property_images = files?.property_images || [];
    const property_site_plans = files?.property_site_plans || [];
    try {
      return this.propertiesService.update(
        id,
        updatePropertyDto,
        property_images,
        property_site_plans,
      );
    } catch (error) {
      for (const images_file of property_images) {
        try {
          await fs.promises.unlink(images_file.path);
        } catch (error) {
          console.log(error);
        }
      }

      for (const site_file of property_site_plans) {
        try {
          await fs.promises.unlink(site_file.path);
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
    return this.propertiesService.remove(id);
  }

  @Roles('ADMIN')
  @Delete('property-images/:id')
  async removeImages(@Param('id') id: string) {
    return this.propertiesService.deleteImageProperty(id);
  }

  @Roles('ADMIN')
  @Delete('property-site-plan/:id')
  async removeSitePlan(@Param('id') id: string) {
    return this.propertiesService.deleteSiteProperty(id);
  }
}
