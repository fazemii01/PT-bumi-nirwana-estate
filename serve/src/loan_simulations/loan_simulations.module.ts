import { Module } from '@nestjs/common';
import { LoanSimulationsService } from './loan_simulations.service';
import { LoanSimulationsController } from './loan_simulations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
import { Bank } from '@/banks/entities/bank.entity';
import { Property } from '@/properties/entities/property.entity';
import { User } from '@/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoanSimulation, Bank, Property, User])],
  controllers: [LoanSimulationsController],
  providers: [LoanSimulationsService],
})
export class LoanSimulationsModule {}
