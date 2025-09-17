import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/models/user_favorite.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class PropertyDetailController extends GetxController {
  final PropertyService _propertyService = PropertyService();
  final AuthService _authService = AuthService();

  final Rx<Property?> property = Rx<Property?>(null);

  var isLoading = true.obs;
  var errorMessage = ''.obs;
  var userId = ''.obs;
  var favoriteIds = <String>[].obs;

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
