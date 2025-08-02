import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from '@/agents/entities/agent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async create(
    createAgentDto: CreateAgentDto,
    avatar_url: Express.Multer.File,
  ): Promise<Agent> {
    const agent = new Agent();
    agent.full_name = createAgentDto.full_name;
    agent.email = createAgentDto.email;
    agent.phone_number = createAgentDto.phone_number;
    if (avatar_url) {
      agent.avatar_url = avatar_url?.filename;
    }
    return await this.agentRepository.save(agent);
  }

  async findAll(): Promise<Agent[]> {
    const agents = await this.agentRepository.find();
    return agents;
  }

  async findOne(id: string): Promise<Agent | null> {
    const agent = await this.agentRepository.findOneBy({ id });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    return agent;
  }

  async update(
    id: string,
    updateAgentDto: UpdateAgentDto,
    avatar_url: Express.Multer.File,
  ) {
    const agent = await this.agentRepository.findOneBy({ id });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    if (avatar_url) {
      if (agent.avatar_url !== null) {
        const filePath = path.join(
          __dirname,
          '..',
          '..',
          'uploads/agent',
          agent.avatar_url,
        );
        try {
          fs.unlinkSync(filePath);
        } catch (fs) {
          throw new Error(fs);
        }
        agent.avatar_url = avatar_url?.filename;
      } else {
        agent.avatar_url = avatar_url?.filename;
      }
    }

    Object.assign(agent, updateAgentDto);
    return this.agentRepository.save(agent);
  }

  async remove(id: string) {
    await this.agentRepository.delete({ id });
    return { message: 'delete successful' };
  }
}
