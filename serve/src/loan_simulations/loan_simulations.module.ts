import { Module } from '@nestjs/common';
import { LoanSimulationsService } from './loan_simulations.service';
import { LoanSimulationsController } from './loan_simulations.controller';

@Module({
  controllers: [LoanSimulationsController],
  providers: [LoanSimulationsService],
})
export class LoanSimulationsModule {}
