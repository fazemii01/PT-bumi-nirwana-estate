import { PartialType } from '@nestjs/mapped-types';
import { CreateBuildingPropertyDto } from './create-building_property.dto';

export class UpdateBuildingPropertyDto extends PartialType(CreateBuildingPropertyDto) {}
