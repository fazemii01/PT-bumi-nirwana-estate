import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './agent.entity';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private agentsRepository: Repository<Agent>,
  ) {}

  findAll(): Promise<Agent[]> {
    return this.agentsRepository.find();
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentsRepository.findOneBy({ id });
    if (!agent) {
      throw new NotFoundException(`Agent with ID "${id}" not found`);
    }
    return agent;
  }

  async create(agentData: Partial<Agent>): Promise<Agent> {
    const newAgent = this.agentsRepository.create(agentData);
    return this.agentsRepository.save(newAgent);
  }

  async update(id: string, agentData: Partial<Agent>): Promise<Agent> {
    await this.agentsRepository.update(id, agentData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.agentsRepository.delete(id);
  }
}
