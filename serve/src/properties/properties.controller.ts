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
    return await this.propertiesService.create(
      createPropertyDto,
      property_images,
      property_floor_plans,
    );
  }

  @Get()
  async findAll(): Promise<Property[]> {
    return await this.propertiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
