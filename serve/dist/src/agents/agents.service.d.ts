import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsService {
    create(createAgentDto: CreateAgentDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAgentDto: UpdateAgentDto): string;
    remove(id: number): string;
}
