import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { Agent } from './agent.entity';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  findAll(): Promise<Agent[]> {
    return this.agentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Agent> {
    return this.agentsService.findOne(id);
  }

  @Post()
  create(@Body() agentData: Partial<Agent>): Promise<Agent> {
    return this.agentsService.create(agentData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() agentData: Partial<Agent>): Promise<Agent> {
    return this.agentsService.update(id, agentData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.agentsService.remove(id);
  }
}
