import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/bank.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/service/bank_service.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';

class SimulationFormController extends GetxController {
  final BankService _bankService = BankService();
  final PropertyService _propertyService = PropertyService();

  final formKey = GlobalKey<FormState>();
  final propoertyId = TextEditingController();
  final down_payment = TextEditingController();
  final tenure = TextEditingController();
  final status = TextEditingController();
  final interest_rate = TextEditingController();
  String? bankId;

  final banks = <Bank>[].obs;
  final properties = <Property>[].obs;

  @override
  void onInit() {
    super.onInit();
    getBank();
    getProperty();
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

  void getProperty() async {
    try {
      List<Property> listProperty = [];
      listProperty = await _propertyService.getAllProperty();
      properties.value = listProperty;
    } catch (e) {}
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
}
