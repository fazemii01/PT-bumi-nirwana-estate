import { CreatePropertySitePlansDto } from '@/properties/dto/create-property-site-plans.dto';
import { CreatePropertyImageDto } from '@/properties/dto/create-property-image.dto';

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PropertyType } from '@/properties/entities/property.entity';

export class CreatePropertyDto {
  @IsOptional()
  @IsUUID()
  developerId: string;

  @IsOptional()
  @IsUUID()
  agentId: string;

  @IsString()
  name: string;

  @IsEnum(PropertyType)
  type: PropertyType;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  detail_description: string;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @IsOptional()
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  address: object;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyImageDto)
  images: CreatePropertyImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertySitePlansDto)
  site_plans: CreatePropertySitePlansDto[];
}
