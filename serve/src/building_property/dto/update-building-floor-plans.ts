import { CreateBuildingFloorPlansDto } from '@/building_property/dto/create-building-floor-plans';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBuildingFloorPlansDto extends PartialType(
  CreateBuildingFloorPlansDto,
) {}
