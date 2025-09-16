import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/models/user_favorite.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';
import 'package:mobile_nirwana/data/service/news_service.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';

class HomeController extends GetxController {
  final PropertyService _propertyService = PropertyService();
  final NewsService _newsService = NewsService();
  final AuthService _authService = AuthService();
  var properties = <Property>[].obs;
  var news = <News>[].obs;
  var isLoading = false.obs;
  var errorMessage = ''.obs;
  var userId = ''.obs;
  var favoriteIds = <String>[].obs;

  @override
  void onInit() {
    super.onInit();
    loadProperty();
    loadNews();
    getUserId();
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
      errorMessage.value = 'Failed to load home page';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> loadNews() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      List<News> newsList = await _newsService.getAllNews();
      news.value = newsList;

      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;
      errorMessage.value = 'Failed to load home page';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> refreshAllData() async {
    await loadProperty();
    await loadNews();
  }

  Future<void> getUserId() async {
    try {
      final id = await _authService.getUserId();
      userId.value = id;
    } catch (e) {
      userId.value = '';
    }
  }

  Future<void> refreshProperties() async {
    await loadProperty();
  }

  Future<void> toggleFavorite(String propertyId) async {
    if (userId.value.isEmpty) return;

    final fav = UserFavorite(userId: userId.value, propertyId: propertyId);

    try {
      await _propertyService.createOrRemove(fav);

      // toggle state di lokal
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
