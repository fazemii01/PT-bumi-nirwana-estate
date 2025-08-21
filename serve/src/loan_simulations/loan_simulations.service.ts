import { Injectable } from '@nestjs/common';
import { CreateLoanSimulationDto } from './dto/create-loan_simulation.dto';
import { UpdateLoanSimulationDto } from './dto/update-loan_simulation.dto';

@Injectable()
export class LoanSimulationsService {
  create(createLoanSimulationDto: CreateLoanSimulationDto) {
    return 'This action adds a new loanSimulation';
  }

  findAll() {
    return `This action returns all loanSimulations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loanSimulation`;
  }

  update(id: number, updateLoanSimulationDto: UpdateLoanSimulationDto) {
    return `This action updates a #${id} loanSimulation`;
  }

  remove(id: number) {
    return `This action removes a #${id} loanSimulation`;
  }
}
