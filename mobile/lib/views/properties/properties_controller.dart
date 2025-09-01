import 'package:get/state_manager.dart';
import 'package:mobile_nirwana/data/models/property.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';

class PropertiesController extends GetxController {
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
      List<Property> propertyList = [];
      propertyList = await _propertyService.getAllProperty();
      properties.value = propertyList;
    } catch (e) {
      errorMessage.value = 'Failed to load property: $e';
      print('Error loading rooms: $e');
    } finally {
      isLoading.value = false;
    }
  }
}
