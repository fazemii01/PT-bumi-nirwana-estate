import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from '@/properties/entities/property.entity';
import { PropertyImage } from '@/properties/entities/property_images.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '@/agents/entities/agent.entity';
import { Developer } from '@/developers/entities/developer.entity';
import { PropertySitePlan } from '@/properties/entities/property_site_plans.entity';
import { BuildingProperty } from '@/building_property/entities/building_property.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      PropertyImage,
      PropertySitePlan,
      Agent,
      Developer,
    ]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
