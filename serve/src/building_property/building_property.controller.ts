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
import { BuildingPropertyService } from './building_property.service';
import { CreateBuildingPropertyDto } from './dto/create-building_property.dto';
import { UpdateBuildingPropertyDto } from './dto/update-building_property.dto';
import { Roles } from '@/auths/role.decorator';
import { Public } from '@/auths/public.decorator';
import { UseMultipleFileUploadInterceptor } from '@/file/multi-upload.interceptor';

@Controller('building-property')
export class BuildingPropertyController {
  constructor(
    private readonly buildingPropertyService: BuildingPropertyService,
  ) {}

  @Roles('ADMIN')
  @Post()
  @UseMultipleFileUploadInterceptor('building_property')
  async create(
    @Body() createBuildingPropertyDto: CreateBuildingPropertyDto,
    @UploadedFiles()
    files: {
      building_images?: Express.Multer.File[];
      building_floor_plans?: Express.Multer.File[];
      building_kpr_rules?: Express.Multer.File[];
    },
  ) {
    const building_images = files.building_images || [];
    const building_floor_plans = files.building_floor_plans || [];
    const building_kpr_rules = files.building_kpr_rules || [];
    return await this.buildingPropertyService.create(
      createBuildingPropertyDto,
      building_images,
      building_floor_plans,
      building_kpr_rules,
    );
  }

  @Public()
  @Get()
  async findAll() {
    return await this.buildingPropertyService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.buildingPropertyService.findOne(id);
  }

  @Public()
  @Get('property/:id')
  async findByPropertyId(@Param('id') id: string) {
    return await this.buildingPropertyService.findByProperty(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @UseMultipleFileUploadInterceptor('building_property')
  async update(
    @Param('id') id: string,
    @Body() updateBuildingPropertyDto: UpdateBuildingPropertyDto,
    @UploadedFiles()
    files: {
      building_images?: Express.Multer.File[];
      building_floor_plans?: Express.Multer.File[];
      building_kpr_rules?: Express.Multer.File[];
    },
  ) {
    const building_images = files.building_images || [];
    const building_floor_plans = files.building_floor_plans || [];
    const building_kpr_rules = files.building_kpr_rules || [];
    return await this.buildingPropertyService.update(
      id,
      updateBuildingPropertyDto,
      building_images,
      building_floor_plans,
      building_kpr_rules,
    );
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.buildingPropertyService.remove(id);
  }
}
