import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from '@/properties/entities/property.entity';
import { PropertyImage } from '@/properties/entities/property-image.entity';
import { PropertyFloorPlan } from '@/properties/entities/property-floor-plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, PropertyImage, PropertyFloorPlan]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
