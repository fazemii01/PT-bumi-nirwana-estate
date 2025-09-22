import { CreateBuildingImageDto } from '@/building_property/dto/create-building-images';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBuildingImagesDto extends PartialType(
  CreateBuildingImageDto,
) {}
