import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/loan-simulation.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';
import 'package:mobile_nirwana/data/service/loan_simulation_service.dart';

class KprController extends GetxController {
  final LoanSimulationService _loanSimulationService = LoanSimulationService();
  final AuthService _authService = AuthService();
  final simulationByUser = <LoanSimulation>[].obs;
  final isLoading = false.obs;
  final errorMessage = ''.obs;
  final isDelete = false.obs;
  var userEmail = ''.obs;

  @override
  void onInit() {
    super.onInit();
    initController();
  }

  Future<void> loadData() async {
    initController();
  }

  void initController() async {
    await getEmailUser();
    await loadSimulasiByUser();
  }

  Future<void> getEmailUser() async {
    try {
      final emailUser = await _authService.getEmail();
      userEmail.value = emailUser;
    } catch (e) {
      userEmail.value = '';
    }
  }

  Future<void> loadSimulasiByUser() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      List<LoanSimulation> dataList = [];
      dataList = await _loanSimulationService.getByUserEmail(userEmail.value);
      simulationByUser.value = dataList;
      isLoading.value = false;
    } catch (e) {
      errorMessage.value = 'Failed to load simulasi: $e';
      isLoading.value = false;
      print("ERROR FETCHING DATA SIMULASI $e");
    }
  }

  Future<void> remove(String id, BuildContext context) async {
    isDelete.value = true;
    final message = await _loanSimulationService.deleteSimulation(id);
    if (message == null) {
      isDelete.value = false;
      Navigator.of(context).pop();
      Get.snackbar("Success", "Data berhasil dihapus",
          backgroundColor: Colors.green, colorText: Colors.white);
      await loadData();
    } else {
      isDelete.value = false;
      Get.snackbar("Error", "$message");
    }
  }
}
