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
  create(@Body() createLoanSimulationDto: CreateLoanSimulationDto) {
    return this.loanSimulationsService.create(createLoanSimulationDto);
  }

  @Get()
  findAll() {
    return this.loanSimulationsService.findAll();
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
  remove(@Param('id') id: string) {
    return this.loanSimulationsService.remove(+id);
  }
}
