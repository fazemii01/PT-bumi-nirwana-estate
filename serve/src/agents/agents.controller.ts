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
import * as fs from 'fs';

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
    try {
      return await this.agentsService.create(createAgentDto, avatar_url);
    } catch (error) {
      try {
        await fs.promises.unlink(avatar_url.path);
      } catch (error) {
        console.log(error);
      }
      throw error;
    }
  }

  @Get()
  @Roles('ADMIN')
  async findAll() {
    return await this.agentsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param('id') id: string) {
    return await this.agentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseFileUploadInterceptor('avatar_url', 'agent')
  async update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
    @UploadedFile() avatar_url: Express.Multer.File,
  ) {
    try {
      return await this.agentsService.update(id, updateAgentDto, avatar_url);
    } catch (error) {
      try {
        await fs.promises.unlink(avatar_url.path);
      } catch (error) {
        console.log(error);
      }
      throw error;
    }
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return await this.agentsService.remove(id);
  }
}
