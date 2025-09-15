import 'package:get/get.dart';
import 'package:mobile_nirwana/data/service/eligibility_service.dart';

class EligibilityController extends GetxController {
  final EligibilityService _service = EligibilityService();

  var isLoading = false.obs;
  var result = "".obs;

  Future<void> askEligibility(String question) async {
    try {
      isLoading.value = true;
      final response = await _service.checkEligibility(question);
      print(response.result);
      result.value = response.result; // ambil string dari model
    } catch (e) {
      result.value = "Terjadi kesalhan";
    } finally {
      isLoading.value = false;
    }
  }
}
