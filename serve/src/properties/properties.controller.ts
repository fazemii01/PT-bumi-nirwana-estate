import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { Property } from './property.entity';
import { FileService } from '../file/file.service';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  findAll(): Promise<Property[]> {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Property> {
    return this.propertiesService.findOne(id);
  }

  @Post()
  create(@Body() propertyData: Partial<Property>): Promise<Property> {
    return this.propertiesService.create(propertyData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() propertyData: Partial<Property>): Promise<Property> {
    return this.propertiesService.update(id, propertyData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.propertiesService.remove(id);
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const property = await this.propertiesService.findOne(id);
    const imagePaths = await Promise.all(images.map(image => this.fileService.saveFile(image)));
    // Here you would typically save the image paths to the database
    // For now, we'll just return them
    return { imagePaths };
  }

  @Post(':id/floor-plans')
  @UseInterceptors(FileInterceptor('floorPlan'))
  async uploadFloorPlan(
    @Param('id') id: string,
    @UploadedFile() floorPlan: Express.Multer.File,
  ) {
    const property = await this.propertiesService.findOne(id);
    const floorPlanPath = await this.fileService.saveFile(floorPlan);
    // Here you would typically save the floor plan path to the database
    // For now, we'll just return it
    return { floorPlanPath };
  }
}
