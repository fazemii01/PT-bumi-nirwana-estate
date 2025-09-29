import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanSimulationDto } from './dto/create-loan_simulation.dto';
import { UpdateLoanSimulationDto } from './dto/update-loan_simulation.dto';
import { Repository } from 'typeorm';
import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from '@/banks/entities/bank.entity';
import { User } from '@/users/entities/user.entity';
import { BuildingProperty } from '@/building_property/entities/building_property.entity';
import { PropertyType } from '@/properties/entities/property.entity';

type Installment = {
  month: number;
  principal: number;
  interest: number;
  installment: number;
  remainingBalance: number;
};

@Injectable()
export class LoanSimulationsService {
  constructor(
    @InjectRepository(LoanSimulation)
    private readonly loanSimulationRepository: Repository<LoanSimulation>,

    @InjectRepository(BuildingProperty)
    private readonly buildingPropertyRepository: Repository<BuildingProperty>,

    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createLoanSimulationDto: CreateLoanSimulationDto) {
    const user = await this.userRepository.findOneBy({
      id: createLoanSimulationDto.userId,
    });

    if (!user) throw new NotFoundException('User not found');

    const building = await this.buildingPropertyRepository.findOne({
      where: { id: createLoanSimulationDto.buildingPropertyId },
      relations: ['property'],
    });
    if (!building) throw new NotFoundException('Property not found');

    const bank = await this.bankRepository.findOneBy({
      id: createLoanSimulationDto.bankId,
    });
    if (!bank) throw new NotFoundException('Bank not found');

    let loanAmount = 0;

    if (
      createLoanSimulationDto.down_payment !== undefined &&
      createLoanSimulationDto.down_payment !== 0
    ) {
      loanAmount = building.price - createLoanSimulationDto.down_payment;
    } else {
      loanAmount = building.price;
    }

    const monthly_installment = this.calculateMonthlyInstallment(
      loanAmount,
      bank.interest_rate,
      createLoanSimulationDto.tenure,
      building.property.type,
    );

    const breakdown: Installment[] = this.getInstallmentBreakdown(
      loanAmount,
      bank.interest_rate,
      createLoanSimulationDto.tenure,
      12,
      building.property.type,
    );

    const totalMonths = createLoanSimulationDto.tenure * 12;
    const total_payment = monthly_installment * totalMonths;
    const total_interest = total_payment - loanAmount;

    const loanSimulation = new LoanSimulation();
    loanSimulation.user = user;
    loanSimulation.bank = bank;
    loanSimulation.building_property = building;
    loanSimulation.loan_amount = loanAmount;
    loanSimulation.down_payment = createLoanSimulationDto.down_payment;
    loanSimulation.total_payment = total_payment;
    loanSimulation.total_interest = total_interest;
    loanSimulation.tenure = createLoanSimulationDto.tenure;
    loanSimulation.monthly_installment = monthly_installment;
    loanSimulation.interest_rate = bank.interest_rate;
    loanSimulation.breakdown = breakdown;

    await this.loanSimulationRepository.save(loanSimulation);
    return loanSimulation;
  }

  findAll() {
    return `This action returns all loanSimulations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loanSimulation`;
  }

  async findByUserEmail(email: string): Promise<LoanSimulation[]> {
    const user = await this.userRepository.findOneBy({ email: email });

    if (!user) throw new NotFoundException('email not found');

    const simulation = await this.loanSimulationRepository.find({
      where: { user: { id: user.id } },
      relations: [
        'building_property',
        'building_property.images',
        'building_property.floor_plans',
        'building_property.property',
        'user',
        'bank',
      ],
    });
    return simulation;
  }

  update(id: number, updateLoanSimulationDto: UpdateLoanSimulationDto) {
    return `This action updates a #${id} loanSimulation`;
  }

  async remove(id: string) {
    const loan = await this.loanSimulationRepository.findOne({
      where: { id: id },
      relations: [
        'building_property',
        'building_property.images',
        'building_property.floor_plans',
        'user',
        'bank',
      ],
    });

    if (!loan) throw new NotFoundException();

    await this.loanSimulationRepository.remove(loan);
    return { message: 'Delete successs' };
  }

  private calculateMonthlyInstallment(
    loanAmount: number,
    interestRate: number,
    tenure: number,
    type: PropertyType,
  ): number {
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = tenure * 12;

    let monthlyInstallment = 0;

    if (type === PropertyType.KOMERSIL) {
      monthlyInstallment =
        (loanAmount * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    } else if (type === PropertyType.SUBSIDI) {
      const principalPerMonth = loanAmount / numberOfPayments;
      const interestPerMonth = (loanAmount * (interestRate / 100)) / 12;
      monthlyInstallment = principalPerMonth + interestPerMonth;
    }

    return monthlyInstallment;
  }

  private getInstallmentBreakdown(
    loanAmount: number,
    interestRate: number,
    tenure: number,
    monthsToShow: number,
    type: PropertyType,
  ): Installment[] {
    const monthlyInstallment = this.calculateMonthlyInstallment(
      loanAmount,
      interestRate,
      tenure,
      type,
    );

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = tenure * 12;

    let balance = loanAmount;
    const breakdown: Installment[] = [];

    if (type === PropertyType.KOMERSIL) {
      for (let month = 1; month <= monthsToShow; month++) {
        const interest = balance * monthlyInterestRate;
        const principal = monthlyInstallment - interest;
        balance -= principal;

        breakdown.push({
          month,
          principal: parseFloat(principal.toFixed(2)),
          interest: parseFloat(interest.toFixed(2)),
          installment: parseFloat(monthlyInstallment.toFixed(2)),
          remainingBalance: parseFloat(balance.toFixed(2)),
        });
      }
    } else if (type === PropertyType.SUBSIDI) {
      const principalPerMonth = loanAmount / numberOfPayments;
      const interestPerMonth = (loanAmount * (interestRate / 100)) / 12;

      for (let month = 1; month <= monthsToShow; month++) {
        const principal = principalPerMonth;
        const interest = interestPerMonth;
        balance -= principal;

        breakdown.push({
          month,
          principal: parseFloat(principal.toFixed(2)),
          interest: parseFloat(interest.toFixed(2)),
          installment: parseFloat(monthlyInstallment.toFixed(2)),
          remainingBalance: parseFloat(balance.toFixed(2)),
        });
      }
    }

    return breakdown;
  }
}
