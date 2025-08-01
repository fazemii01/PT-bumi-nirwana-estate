import { Injectable } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  create(createAgentDto: CreateAgentDto) {
    return 'This action adds a new agent';
  }

  findAll() {
    return `This action returns all agents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agent`;
  }

  update(id: number, updateAgentDto: UpdateAgentDto) {
    return `This action updates a #${id} agent`;
  }

  remove(id: number) {
    return `This action removes a #${id} agent`;
  }
}
