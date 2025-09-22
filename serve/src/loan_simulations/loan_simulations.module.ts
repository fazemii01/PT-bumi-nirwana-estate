import { Module } from '@nestjs/common';
import { LoanSimulationsService } from './loan_simulations.service';
import { LoanSimulationsController } from './loan_simulations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
import { Bank } from '@/banks/entities/bank.entity';
import { User } from '@/users/entities/user.entity';
import { BuildingProperty } from '@/building_property/entities/building_property.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanSimulation, Bank, BuildingProperty, User]),
  ],
  controllers: [LoanSimulationsController],
  providers: [LoanSimulationsService],
})
export class LoanSimulationsModule {}
