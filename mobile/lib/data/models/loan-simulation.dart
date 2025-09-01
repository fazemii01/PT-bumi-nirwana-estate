import 'package:mobile_nirwana/data/models/bank.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/models/user.dart';

class LoanSimulation {
  final String? id;
  final String userId;
  final String bankId;
  final String propertyId;
  final double? loanAmount;
  final double downPayment;
  final int tenure;
  final double? total_payment;
  final double? total_interest;
  final double? monthlyInstallment;
  final double? interestRate;
  final List<Breakdown>? breakdown;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  final User? user;
  final Bank? bank;
  final Property? property;

  LoanSimulation({
    this.id,
    required this.userId,
    required this.bankId,
    required this.propertyId,
    this.loanAmount,
    required this.downPayment,
    required this.tenure,
    this.total_payment,
    this.total_interest,
    this.monthlyInstallment,
    this.interestRate,
    this.breakdown,
    this.createdAt,
    this.updatedAt,
    this.user,
    this.bank,
    this.property,
  });

  factory LoanSimulation.fromJson(Map<String, dynamic> json) {
    return LoanSimulation(
      id: json['id'],
      userId: json['userId'] ?? '',
      bankId: json['bankId'] ?? '',
      propertyId: json['propertyId'] ?? '',
      loanAmount: (json['loan_amount'] as num).toDouble(),
      downPayment: (json['down_payment'] as num).toDouble(),
      tenure: json['tenure'],
      total_payment: json['total_payment'],
      total_interest: json['total_interest'],
      monthlyInstallment: (json['monthly_installment'] as num).toDouble(),
      interestRate: (json['interest_rate'] as num).toDouble(),
      breakdown: json['breakdown'] != null
          ? (json['breakdown'] as List)
              .map((e) => Breakdown.fromJson(e))
              .toList()
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : null,
      user: json['user'] != null ? User.fromJson(json['user']) : null,
      bank: json['bank'] != null ? Bank.fromJson(json['bank']) : null,
      property:
          json['property'] != null ? Property.fromJson(json['property']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "userId": userId,
      "bankId": bankId,
      "propertyId": propertyId,
      "loan_amount": loanAmount,
      "down_payment": downPayment,
      "tenure": tenure,
      "total_payment": total_payment,
      "total_interest": total_interest,
      "monthly_installment": monthlyInstallment,
      "interest_rate": interestRate,
      "breakdown": breakdown?.map((e) => e.toJson()).toList(),
    };
  }
}

class Breakdown {
  final int month;
  final double principal;
  final double interest;
  final double installment;
  final double remainingBalance;

  Breakdown({
    required this.month,
    required this.principal,
    required this.interest,
    required this.installment,
    required this.remainingBalance,
  });

  factory Breakdown.fromJson(Map<String, dynamic> json) {
    return Breakdown(
      month: json['month'],
      principal: (json['principal'] as num).toDouble(),
      interest: (json['interest'] as num).toDouble(),
      installment: (json['installment'] as num).toDouble(),
      remainingBalance: (json['remainingBalance'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        "month": month,
        "principal": principal,
        "interest": interest,
        "installment": installment,
        "remainingBalance": remainingBalance,
      };
}
