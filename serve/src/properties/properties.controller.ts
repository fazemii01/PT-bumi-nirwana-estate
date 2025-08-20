import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UseMultipleFileUploadInterceptor } from '@/file/multi-upload.interceptor';
import { Roles } from '@/auths/role.decorator';
import { Property } from '@/properties/entities/property.entity';
import { Public } from '@/auths/public.decorator';
import { UpdatePropertyImagesDto } from '@/properties/dto/update-property-images.dto';
import { UseFileUploadInterceptor } from '@/file/upload.interceptor';
import { UpdatePropertyFloorPlansDto } from '@/properties/dto/update-property-floor-plans.dto';

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
    console.log(`api jalan`);

    const property_images = files.property_images || [];
    const property_floor_plans = files.property_floor_plans || [];
    return await this.propertiesService.create(
      createPropertyDto,
      property_images,
      property_floor_plans,
    );
  }

  @Public()
  @Get()
  async findAll(): Promise<Property[]> {
    return await this.propertiesService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`Finding property with id: ${id}`);
    return this.propertiesService.findOne(id);
  }

  // @Public()
  // @Get(':slug')
  // async findOneBySlug(@Param('slug') slug: string) {
  //   return this.propertiesService.findOneBySlug(slug);
  // }

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
  ) {
    const property_images = files?.property_images || [];
    const property_floor_plans = files?.property_floor_plans || [];
    return this.propertiesService.update(
      id,
      updatePropertyDto,
      property_images,
      property_floor_plans,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
