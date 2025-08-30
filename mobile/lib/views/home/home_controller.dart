import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';

class HomeController extends GetxController {
  final PropertyService _propertyService = PropertyService();
  var properties = <Property>[].obs;
  var isLoading = false.obs;
  var errorMessage = ''.obs;

  @override
  void onInit() {
    super.onInit();
    loadProperty();
  }

  Future<void> loadProperty() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      List<Property> propertyList = await _propertyService.getAllProperty();
      properties.value = propertyList;

      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;
      errorMessage.value = 'Failed to load property';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> refreshProperties() async {
    await loadProperty();
  }
}
