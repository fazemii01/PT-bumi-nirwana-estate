import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Property } from './property.entity';
import { PropertyImage } from './property-image.entity';
import { PropertyFloorPlan } from './property-floor-plan.entity';
import { FileModule } from '../file/file.module';
import { FileService } from '../file/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, PropertyImage, PropertyFloorPlan]),
    FileModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, FileService],
})
export class PropertiesModule {}
