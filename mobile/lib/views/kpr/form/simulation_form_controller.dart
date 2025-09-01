import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/models/bank.dart';
import 'package:mobile_nirwana/data/models/loan-simulation.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';
import 'package:mobile_nirwana/data/service/bank_service.dart';
import 'package:mobile_nirwana/data/service/loan_simulation_service.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';
import 'dart:math';

class SimulationFormController extends GetxController {
  final BankService _bankService = BankService();
  final PropertyService _propertyService = PropertyService();
  final AuthService _authService = AuthService();
  final LoanSimulationService _loanSimulationService = LoanSimulationService();

  final down_payment = TextEditingController();
  final interest_rate = TextEditingController();
  final propertyPriceController = TextEditingController();

  int? tenure;
  final bankId = ''.obs;
  final propertyId = ''.obs;
  var userId = ''.obs;
  Property? selectedProperty;
  Bank? selectedBank;

  final banks = <Bank>[].obs;
  final properties = <Property>[].obs;

  @override
  void onInit() {
    super.onInit();
    getBank();
    getProperty();
    loadUserId();
  }

  Future<void> loadUserId() async {
    try {
      final getUserId = await _authService.getUserId();
      userId.value = getUserId;
    } catch (e) {
      userId.value = '';
    }
  }

  void getProperty() async {
    try {
      List<Property> listProperty = [];
      listProperty = await _propertyService.getAllProperty();
      properties.value = listProperty;
    } catch (e) {
      print("ERROR FETCHING DATA PROPERTY $e");
    }
  }

  void getBank() async {
    try {
      List<Bank> listBank = [];
      listBank = await _bankService.getAllBank();
      banks.value = listBank;
    } catch (e) {
      print('error get bank $e');
    }
  }

  void handleCalculateKpr() {
    try {
      final rawprice = propertyPriceController.text.trim();
      final cleanedPrice = rawprice.replaceAll(RegExp(r'[^0-9]'), '');
      final propertyPrice =
          cleanedPrice.isEmpty ? 0.0 : double.parse(cleanedPrice);

      final raw = down_payment.text.trim();
      final cleaned = raw.replaceAll(RegExp(r'[^0-9]'), '');
      final payment = cleaned.isEmpty ? 0.0 : double.parse(cleaned);

      double interestRate = double.parse(interest_rate.text) / 100;

      double loanAmount = propertyPrice - payment;
      double monthlyRate = interestRate / 12;
      int totalMonths = tenure! * 12;

      double monthlyInstallment = loanAmount *
          (monthlyRate * pow(1 + monthlyRate, totalMonths)) /
          (pow(1 + monthlyRate, totalMonths) - 1);

      double totalPayment = monthlyInstallment * totalMonths;
      double totalInterest = totalPayment - loanAmount;
      double balance = loanAmount;
      List<Breakdown> breakdown = [];

      for (int month = 1; month <= totalMonths; month++) {
        double interest = balance * monthlyRate;
        double principal = monthlyInstallment - interest;
        balance -= principal;

        breakdown.add(
          Breakdown(
            month: month,
            principal: double.parse(principal.toStringAsFixed(2)),
            interest: double.parse(interest.toStringAsFixed(2)),
            installment: double.parse(monthlyInstallment.toStringAsFixed(2)),
            remainingBalance: double.parse(balance.toStringAsFixed(2)),
          ),
        );
      }
      final loanSimulation = LoanSimulation(
        userId: userId.value.trim(),
        bankId: bankId.value.trim(),
        propertyId: propertyId.value.trim(),
        bank: selectedBank,
        property: selectedProperty,
        loanAmount: loanAmount,
        downPayment: payment,
        tenure: tenure!,
        monthlyInstallment: double.parse(monthlyInstallment.toStringAsFixed(2)),
        interestRate: interestRate * 100,
        total_payment: double.parse(totalPayment.toStringAsFixed(2)),
        total_interest: double.parse(totalInterest.toStringAsFixed(2)),
        breakdown: breakdown,
      );
      print("Hasil simulasi: ${loanSimulation.toJson()}");
      Get.toNamed(
        Routes.HASIL_SIMULATION,
        arguments: {
          "breakdown": breakdown.take(12).toList(),
          "loanSimulation": loanSimulation,
        },
      );
    } catch (e) {
      print("ERROR handleCalculateKpr $e");
    }
  }

  void handleSubmit() async {
    Get.offAllNamed(Routes.HASIL_SIMULATION);
    final raw = down_payment.text.trim();
    final cleaned = raw.replaceAll(RegExp(r'[^0-9]'), '');
    final payment = cleaned.isEmpty ? 0.0 : double.parse(cleaned);
    final loanSimulation = LoanSimulation(
      userId: userId.value.trim(),
      bankId: bankId.value.trim(),
      propertyId: propertyId.value.trim(),
      tenure: tenure!,
      downPayment: payment,
    );
    final response =
        await _loanSimulationService.addLoanSimulation(loanSimulation);
  }
}

  // void _resetForm() {
  //   setState(() {
  //     _propertyPriceController.clear();
  //     _downPaymentController.clear();
  //     _selectedTenure = 15;
  //     // _selectedBank = _bankOptions.first['id'];
  //     // _interestRateController.text = _bankOptions.first['rate'].toString();
  //     _isCalculated = false;
  //     _monthlyInstallment = 0;
  //     _totalInterest = 0;
  //     _totalPayment = 0;
  //   });
  // }
