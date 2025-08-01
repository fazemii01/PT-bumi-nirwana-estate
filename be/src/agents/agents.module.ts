import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '@/agents/entities/agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
