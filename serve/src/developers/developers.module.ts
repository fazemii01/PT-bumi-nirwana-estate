import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';
import { Developer } from './developer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Developer])],
  controllers: [DevelopersController],
  providers: [DevelopersService],
})
export class DevelopersModule {}
