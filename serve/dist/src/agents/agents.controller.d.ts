import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
    create(createAgentDto: CreateAgentDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAgentDto: UpdateAgentDto): string;
    remove(id: string): string;
}
