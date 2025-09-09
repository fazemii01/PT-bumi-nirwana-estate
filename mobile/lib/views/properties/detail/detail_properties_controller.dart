import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';

class PropertyDetailController extends GetxController {
  final PropertyService _propertyService = PropertyService();

  final Rx<Property?> property = Rx<Property?>(null);

  var isLoading = true.obs;
  var errorMessage = ''.obs;

  Future<void> fetchDetail(String id) async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final result = await _propertyService.getPropertiesById(id);

      property.value = result;
    } catch (e) {
      errorMessage.value = e.toString();
    } finally {
      isLoading.value = false;
    }
  }
}
