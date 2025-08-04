import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from '@/properties/entities/property.entity';
import { PropertyImage } from '@/properties/entities/property-image.entity';
import { PropertyFloorPlan } from '@/properties/entities/property-floor-plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '@/agents/entities/agent.entity';
import { Developer } from '@/developers/entities/developer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      PropertyImage,
      PropertyFloorPlan,
      Agent,
      Developer,
    ]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
