import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanSimulationDto } from './dto/create-loan_simulation.dto';
import { UpdateLoanSimulationDto } from './dto/update-loan_simulation.dto';
import { Repository } from 'typeorm';
import { LoanSimulation } from '@/loan_simulations/entities/loan_simulation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '@/properties/entities/property.entity';
import { Bank } from '@/banks/entities/bank.entity';
import { User } from '@/users/entities/user.entity';

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

    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

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

    const property = await this.propertyRepository.findOneBy({
      id: createLoanSimulationDto.propertyId,
    });
    if (!property) throw new NotFoundException('Property not found');

    const bank = await this.bankRepository.findOneBy({
      id: createLoanSimulationDto.bankId,
    });
    if (!bank) throw new NotFoundException('Bank not found');

    let loanAmount = 0;

    if (
      createLoanSimulationDto.down_payment !== undefined &&
      createLoanSimulationDto.down_payment !== 0
    ) {
      loanAmount = property.price - createLoanSimulationDto.down_payment;
    } else {
      loanAmount = property.price;
    }

    const breakdown: Installment[] = this.getInstallmentBreakdown(
      loanAmount,
      bank.interest_rate,
      createLoanSimulationDto.tenure,
      12,
    );

    const monthly_installment = this.calculateMonthlyInstallment(
      loanAmount,
      bank.interest_rate,
      createLoanSimulationDto.tenure,
    );

    const totalMonths = createLoanSimulationDto.tenure * 12;
    const total_payment = monthly_installment * totalMonths;
    const total_interest = total_payment - loanAmount;

    const loanSimulation = new LoanSimulation();
    loanSimulation.user = user;
    loanSimulation.bank = bank;
    loanSimulation.property = property;
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
      relations: ['property', 'user', 'bank'],
    });
    return simulation;
  }

  update(id: number, updateLoanSimulationDto: UpdateLoanSimulationDto) {
    return `This action updates a #${id} loanSimulation`;
  }

  remove(id: number) {
    return `This action removes a #${id} loanSimulation`;
  }

  private calculateMonthlyInstallment(
    loanAmount: number,
    interestRate: number,
    tenure: number,
  ): number {
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = tenure * 12;
    const monthlyInstallment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    return monthlyInstallment;
  }

  private getInstallmentBreakdown(
    loanAmount: number,
    interestRate: number,
    tenure: number,
    monthsToShow: number,
  ): Installment[] {
    const monthlyInstallment = this.calculateMonthlyInstallment(
      loanAmount,
      interestRate,
      tenure,
    );
    const monthlyInterestRate = interestRate / 100 / 12;
    let balance = loanAmount;

    const breakdown: Installment[] = [];

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

    return breakdown;
  }
}
