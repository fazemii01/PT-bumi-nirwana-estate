import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/bank.dart';
import 'package:mobile_nirwana/data/models/loan-simulation.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';
import 'package:mobile_nirwana/data/service/bank_service.dart';
import 'package:mobile_nirwana/data/service/loan_simulation_service.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';

class SimulationFormController extends GetxController {
  final BankService _bankService = BankService();
  final PropertyService _propertyService = PropertyService();
  final AuthService _authService = AuthService();
  final LoanSimulationService _loanSimulationService = LoanSimulationService();

  final formKey = GlobalKey<FormState>();
  final down_payment = TextEditingController();
  final tenure = TextEditingController();
  final interest_rate = TextEditingController();

  final bankId = ''.obs;
  final propertyId = ''.obs;
  var userId = ''.obs;

  final banks = <Bank>[].obs;
  final properties = <Property>[].obs;

  @override
  void onInit() {
    super.onInit();
    getBank();
    getProperty();
    loadUserId();
  }

  //   void _resetForm() {
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

  void handleSubmit() async {
    final loanSimulation = LoanSimulation(
        userId: userId.value.trim(),
        bankId: bankId.value.trim(),
        propertyId: propertyId.value.trim(),
        tenure: int.parse(tenure.text.trim()),
        downPayment: double.parse(down_payment.text.trim()));
    final response =
        await _loanSimulationService.addLoanSimulation(loanSimulation);
  }
}
