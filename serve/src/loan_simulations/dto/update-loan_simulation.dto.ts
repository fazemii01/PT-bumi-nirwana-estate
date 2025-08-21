import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanSimulationDto } from './create-loan_simulation.dto';

export class UpdateLoanSimulationDto extends PartialType(CreateLoanSimulationDto) {}
