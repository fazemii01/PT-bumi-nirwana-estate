import 'package:get/state_manager.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';

class PropertiesController extends GetxController {
  final PropertyService _propertyService = PropertyService();

  var properties = <Property>[].obs;
  var isLoading = false.obs;
  var errorMessage = ''.obs;
  var type = ''.obs;

  @override
  void onInit() {
    super.onInit();
    ever(type, (_) => loadProperty());
    type.value = 'All';
  }

  Future<void> loadProperty() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      List<Property> propertyList = [];
      if (type.value == 'All') {
        propertyList = await _propertyService.getAllProperty();
      } else {
        propertyList = await _propertyService.getPropertiesByType(type.value);
      }
      propertyList.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      properties.value = propertyList;
    } catch (e) {
      errorMessage.value = 'Failed to load property';
      print('Error loading rooms: $e');
    } finally {
      isLoading.value = false;
    }
  }
}
