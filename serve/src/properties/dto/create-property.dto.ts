import { CreatePropertyFloorPlansDto } from '@/properties/dto/create-property-floor-plans.dto';
import { CreatePropertyImageDto } from '@/properties/dto/create-property-image.dto';
import {
  PriceUnit,
  PropertyStatus,
} from '@/properties/entities/property.entity';
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

export class CreatePropertyDto {
  @IsOptional()
  @IsUUID()
  developerId: string;

  @IsOptional()
  @IsUUID()
  agentId: string;

  @IsString()
  name: string;

  @IsEnum(PropertyStatus)
  status: PropertyStatus;

  price: string;

  @IsEnum(PriceUnit)
  price_unit: PriceUnit;

  @IsString()
  luas: string;
  @IsString()
  jenis: string;

  @IsOptional()
  @IsString()
  description: string;

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
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  specifications: object;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyImageDto)
  images: CreatePropertyImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyFloorPlansDto)
  floor_plans: CreatePropertyFloorPlansDto[];
}
