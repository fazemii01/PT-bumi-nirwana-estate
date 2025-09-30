import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/models/user_favorite.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class PropertyDetailController extends GetxController {
  final PropertyService _propertyService = PropertyService();
  final AuthService _authService = AuthService();

  final Rx<Property?> property = Rx<Property?>(null);

  final RxList<BuildingProperty> buildingProperty = <BuildingProperty>[].obs;

  final isLoading = false.obs;
  final errorMessage = ''.obs;
  final userId = ''.obs;
  final favoriteIds = <String>[].obs;

  @override
  void onInit() {
    super.onInit();
    getUserId();
    ever(property, _processBuildingProperties);
  }

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

  void _processBuildingProperties(Property? prop) {
    if (prop == null || prop.building_property.isEmpty) {
      buildingProperty.clear();
      return;
    }
    final List<BuildingProperty> allUnits = List.from(prop.building_property);
    allUnits.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    final List<BuildingProperty> limitedUnits = allUnits.take(3).toList();
    buildingProperty.assignAll(limitedUnits);
  }

  Future<void> getUserId() async {
    try {
      final id = await _authService.getUserId();
      userId.value = id;
    } catch (e) {
      userId.value = '';
    }
  }

  Future<void> toggleFavorite(String propertyId) async {
    if (userId.value.isEmpty) return;

    final fav = UserFavorite(userId: userId.value, propertyId: propertyId);

    try {
      await _propertyService.createOrRemove(fav);

      if (favoriteIds.contains(propertyId)) {
        favoriteIds.remove(propertyId);
      } else {
        favoriteIds.add(propertyId);
      }
    } catch (e) {
      print("Error toggle favorite: $e");
    }
  }
}
