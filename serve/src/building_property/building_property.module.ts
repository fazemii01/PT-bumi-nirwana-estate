import { Module } from '@nestjs/common';
import { BuildingPropertyService } from './building_property.service';
import { BuildingPropertyController } from './building_property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingProperty } from '@/building_property/entities/building_property.entity';
import { BuildingImages } from '@/building_property/entities/building_images.entity';
import { BuildingFloorPlans } from '@/building_property/entities/building_floor_plans.entity';
import { Property } from '@/properties/entities/property.entity';
import { BuildingKprRules } from '@/building_property/entities/building_kpr_rules.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BuildingProperty,
      BuildingImages,
      BuildingFloorPlans,
      BuildingKprRules,
      Property,
    ]),
  ],
  controllers: [BuildingPropertyController],
  providers: [BuildingPropertyService],
})
export class BuildingPropertyModule {}
