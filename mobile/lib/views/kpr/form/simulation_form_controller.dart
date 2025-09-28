import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/models/bank.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:mobile_nirwana/data/models/loan-simulation.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';
import 'package:mobile_nirwana/data/service/bank_service.dart';
import 'package:mobile_nirwana/data/service/building_property_service.dart';
import 'package:mobile_nirwana/data/service/loan_simulation_service.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';
import 'dart:math';

import 'package:mobile_nirwana/views/layout.dart';
import 'package:mobile_nirwana/views/layout_controller.dart';

class SimulationFormController extends GetxController {
  final BankService _bankService = BankService();
  final PropertyService _propertyService = PropertyService();
  final AuthService _authService = AuthService();
  final LoanSimulationService _loanSimulationService = LoanSimulationService();
  final BuildingPropertyService _buildingPropertyService =
      BuildingPropertyService();

  final down_payment = TextEditingController();
  final interest_rate = TextEditingController();
  final buildingPriceController = TextEditingController();

  int? tenure;
  final bankId = ''.obs;
  final buildingId = ''.obs;
  var userId = ''.obs;
  BuildingProperty? selectedBuildingProperty;
  Bank? selectedBank;

  final isLoading = false.obs;
  final errorMessage = ''.obs;
  final errorMessageBuilding = ''.obs;

  final isLoadingBuilding = false.obs;

  final banks = <Bank>[].obs;
  final properties = <Property>[].obs;
  final building = <BuildingProperty>[].obs;

  @override
  void onInit() {
    super.onInit();
    getBank();
    getProperty();
    loadAllBuildings();
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

  Future<void> loadAllBuildings() async {
    try {
      isLoadingBuilding.value = true;
      List<BuildingProperty> listBuilding = [];
      listBuilding = await _buildingPropertyService.getAllBuildings();
      building.value = listBuilding;
    } catch (e) {
      errorMessageBuilding.value = e.toString();
    } finally {
      isLoadingBuilding.value = false;
    }
  }

  Future<void> loadBuildingsByProperty(Property property) async {
    try {
      isLoadingBuilding.value = true;
      List<BuildingProperty> listBuilding = [];
      listBuilding =
          await _buildingPropertyService.getBuildingsByProperty(property.id);
      building.value = listBuilding;
    } catch (e) {
      errorMessageBuilding.value = e.toString();
    } finally {
      isLoadingBuilding.value = false;
    }
  }

  void handleCalculateKpr() {
    // try {
    //   final rawprice = propertyPriceController.text.trim();
    //   final cleanedPrice = rawprice.replaceAll(RegExp(r'[^0-9]'), '');
    //   final propertyPrice =
    //       cleanedPrice.isEmpty ? 0.0 : double.parse(cleanedPrice);

    //   final raw = down_payment.text.trim();
    //   final cleaned = raw.replaceAll(RegExp(r'[^0-9]'), '');
    //   final payment = cleaned.isEmpty ? 0.0 : double.parse(cleaned);

    //   double interestRate = double.parse(interest_rate.text) / 100;

    //   double loanAmount = propertyPrice - payment;
    //   double monthlyRate = interestRate / 12;
    //   int totalMonths = tenure! * 12;

    //   double monthlyInstallment = loanAmount *
    //       (monthlyRate * pow(1 + monthlyRate, totalMonths)) /
    //       (pow(1 + monthlyRate, totalMonths) - 1);

    //   double totalPayment = monthlyInstallment * totalMonths;
    //   double totalInterest = totalPayment - loanAmount;
    //   double balance = loanAmount;
    //   List<Breakdown> breakdown = [];

    //   for (int month = 1; month <= totalMonths; month++) {
    //     double interest = balance * monthlyRate;
    //     double principal = monthlyInstallment - interest;
    //     balance -= principal;

    //     breakdown.add(
    //       Breakdown(
    //         month: month,
    //         principal: double.parse(principal.toStringAsFixed(2)),
    //         interest: double.parse(interest.toStringAsFixed(2)),
    //         installment: double.parse(monthlyInstallment.toStringAsFixed(2)),
    //         remainingBalance: double.parse(balance.toStringAsFixed(2)),
    //       ),
    //     );
    //   }
    //   final loanSimulation = LoanSimulation(
    //     bank: selectedBank,
    //     property: selectedProperty,
    //     loanAmount: loanAmount,
    //     downPayment: payment,
    //     tenure: tenure!,
    //     monthlyInstallment: double.parse(monthlyInstallment.toStringAsFixed(2)),
    //     interestRate: interestRate * 100,
    //     total_payment: double.parse(totalPayment.toStringAsFixed(2)),
    //     total_interest: double.parse(totalInterest.toStringAsFixed(2)),
    //     breakdown: breakdown,
    //   );
    //   Get.toNamed(
    //     Routes.HASIL_SIMULATION,
    //     arguments: {
    //       "breakdown": breakdown.take(12).toList(),
    //       "loanSimulation": loanSimulation,
    //       "hasil": true
    //     },
    //   );
    // } catch (e) {
    //   print("ERROR handleCalculateKpr $e");
    // }
  }

  void handleSubmit() async {
    // final raw = down_payment.text.trim();
    // final cleaned = raw.replaceAll(RegExp(r'[^0-9]'), '');
    // final payment = cleaned.isEmpty ? 0.0 : double.parse(cleaned);
    // final loanSimulation = LoanSimulation(
    //   userId: userId.value.trim(),
    //   bankId: bankId.value.trim(),
    //   propertyId: propertyId.value.trim(),
    //   tenure: tenure!,
    //   downPayment: payment,
    // );
    // try {
    //   isLoading.value = true;
    //   errorMessage.value = '';
    //   final response =
    //       await _loanSimulationService.addLoanSimulation(loanSimulation);
    //   if (response == null) {
    //     isLoading.value = false;
    //     Get.snackbar("Success", "Data simulasi berhasil disimpan.",
    //         backgroundColor: Colors.green, colorText: Colors.white);
    //     Get.offAll(() => const Layout(), arguments: 2);
    //   } else {
    //     isLoading.value = false;
    //     Get.snackbar('Error', '$response',
    //         backgroundColor: Colors.red, colorText: Colors.white);
    //     print("Error save simulation: $response");
    //   }
    // } catch (e) {
    //   Get.snackbar('Error', '$e',
    //       backgroundColor: Colors.red, colorText: Colors.white);
    //   print("Error save simulation: $e");
    // }
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
