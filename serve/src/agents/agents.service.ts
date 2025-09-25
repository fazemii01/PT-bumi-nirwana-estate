import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from '@/agents/entities/agent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { DeletedAtStatus, nowUtc } from '@/types/deleted_at';

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
    const existing = await this.agentRepository.findOneBy({
      email: createAgentDto.email,
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

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
    const agents = await this.agentRepository.find({
      where: { status_delete: DeletedAtStatus.NOT_DELETED },
    });
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

    if (updateAgentDto.email && updateAgentDto.email !== agent.email) {
      const existing = await this.agentRepository.findOneBy({
        email: updateAgentDto.email,
      });
      if (existing) {
        throw new ConflictException('Email already exists');
      }
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
          console.error('Failed to delete old avatar:', fs.message);
        }
        agent.avatar_url = avatar_url?.filename;
      } else {
        agent.avatar_url = avatar_url?.filename;
      }
    }

    Object.assign(agent, updateAgentDto);
    return await this.agentRepository.save(agent);
  }

  async remove(id: string) {
    const agent = await this.agentRepository.findOneBy({ id });
    if (!agent) throw new NotFoundException();
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
      console.error('Failed to delete old avatar:', fs.message);
    }
    await this.agentRepository.update(
      { id },
      { status_delete: DeletedAtStatus.DELETED, deleted_at: nowUtc() },
    );

    return { message: 'delete successful' };
  }
}
