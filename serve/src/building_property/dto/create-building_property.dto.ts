import { CreateBuildingFloorPlansDto } from '@/building_property/dto/create-building-floor-plans';
import { CreateBuildingImageDto } from '@/building_property/dto/create-building-images';
import {
  BuildingStatus,
  PriceUnit,
} from '@/building_property/entities/building_property.entity';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateBuildingPropertyDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  name: string;

  @IsString()
  total_units: string;

  @IsString()
  description: string;

  @IsEnum(BuildingStatus)
  status: BuildingStatus;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @IsEnum(PriceUnit)
  price_unit: PriceUnit;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  land_size: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  building_size: number;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  specifications: object;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBuildingImageDto)
  images: CreateBuildingImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBuildingFloorPlansDto)
  floor_plans: CreateBuildingFloorPlansDto[];
}
