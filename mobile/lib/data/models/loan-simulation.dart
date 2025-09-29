import 'package:mobile_nirwana/data/models/bank.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:mobile_nirwana/data/models/user.dart';
import 'package:mobile_nirwana/helper/parse-int-double.dart';

class LoanSimulation {
  final String? id;
  final String? userId;
  final String? bankId;
  final String? buildingPropertyId;
  final double? loanAmount;
  final double? downPayment;
  final int? tenure;
  final double? total_payment;
  final double? total_interest;
  final double? monthlyInstallment;
  final double? interestRate;
  final List<Breakdown>? breakdown;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  final User? user;
  final Bank? bank;
  final BuildingProperty? buildingProperty;

  LoanSimulation({
    this.id,
    this.userId,
    this.bankId,
    this.buildingPropertyId,
    this.loanAmount,
    this.downPayment,
    this.tenure,
    this.total_payment,
    this.total_interest,
    this.monthlyInstallment,
    this.interestRate,
    this.breakdown,
    this.createdAt,
    this.updatedAt,
    this.user,
    this.bank,
    this.buildingProperty,
  });

  factory LoanSimulation.fromJson(Map<String, dynamic> json) {
    return LoanSimulation(
      id: json['id'],
      userId: json['userId'] ?? '',
      bankId: json['bankId'] ?? '',
      buildingPropertyId: json['buildingPropertyId'] ?? '',
      loanAmount: parseDouble(json['loan_amount']),
      downPayment: parseDouble(json['down_payment']),
      tenure: parseInt(json['tenure']),
      total_payment: parseDouble(json['total_payment']),
      total_interest: parseDouble(json['total_interest']),
      monthlyInstallment: parseDouble(json['monthly_installment']),
      interestRate: parseDouble(json['interest_rate']),
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
      buildingProperty: json['building_property'] != null
          ? BuildingProperty.fromJson(json['building_property'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "userId": userId,
      "bankId": bankId,
      "buildingPropertyId": buildingPropertyId,
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
