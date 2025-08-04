import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Roles } from '@/auths/role.decorator';
import { Agent } from '@/agents/entities/agent.entity';
import { UseFileUploadInterceptor } from '@/file/upload.interceptor';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @Roles('ADMIN')
  @UseFileUploadInterceptor('avatar_url', 'agent')
  async create(
    @Body() createAgentDto: CreateAgentDto,
    @UploadedFile() avatar_url: Express.Multer.File,
  ): Promise<Agent> {
    return this.agentsService.create(createAgentDto, avatar_url);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseFileUploadInterceptor('avatar_url', 'agent')
  update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
    @UploadedFile() avatar_url: Express.Multer.File,
  ) {
    return this.agentsService.update(id, updateAgentDto, avatar_url);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }
}
