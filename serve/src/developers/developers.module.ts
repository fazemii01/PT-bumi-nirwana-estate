import { Module } from '@nestjs/common';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';

@Module({
  controllers: [DevelopersController],
  providers: [DevelopersService]
})
export class DevelopersModule {}
