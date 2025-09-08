import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LoanSimulationsService } from './loan_simulations.service';
import { CreateLoanSimulationDto } from './dto/create-loan_simulation.dto';
import { UpdateLoanSimulationDto } from './dto/update-loan_simulation.dto';
import { Roles } from '@/auths/role.decorator';

@Controller('loan-simulations')
export class LoanSimulationsController {
  constructor(
    private readonly loanSimulationsService: LoanSimulationsService,
  ) {}

  @Roles('ADMIN', 'USER')
  @Post()
  async create(@Body() createLoanSimulationDto: CreateLoanSimulationDto) {
    return await this.loanSimulationsService.create(createLoanSimulationDto);
  }

  @Get()
  findAll() {
    return this.loanSimulationsService.findAll();
  }

  @Roles('ADMIN', 'USER')
  @Get('user/:email')
  async findUserEmail(@Param('email') email: string) {
    return await this.loanSimulationsService.findByUserEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanSimulationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoanSimulationDto: UpdateLoanSimulationDto,
  ) {
    return this.loanSimulationsService.update(+id, updateLoanSimulationDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'USER')
  remove(@Param('id') id: string) {
    return this.loanSimulationsService.remove(id);
  }
}
