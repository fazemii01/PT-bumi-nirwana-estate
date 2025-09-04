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
}
