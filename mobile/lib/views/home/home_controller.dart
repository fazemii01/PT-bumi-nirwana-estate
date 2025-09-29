import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/models/user_favorite.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';
import 'package:mobile_nirwana/data/service/news_service.dart';
import 'package:mobile_nirwana/data/service/property_service.dart';
import 'package:mobile_nirwana/data/service/user_favorite_service.dart';

class HomeController extends GetxController {
  final PropertyService _propertyService = PropertyService();
  final UserFavoriteService _userFavoriteService = UserFavoriteService();
  final NewsService _newsService = NewsService();
  final AuthService _authService = AuthService();
  var properties = <Property>[].obs;
  var userFavorites = <UserFavorite>[].obs;
  var news = <News>[].obs;
  var isLoading = false.obs;
  var errorMessage = ''.obs;
  var userId = ''.obs;
  var favoriteIds = <String>[].obs;
  final loadingIds = <String>{}.obs;

  @override
  void onInit() {
    super.onInit();
    loadProperty();
    loadNews();
    getUserId().then((_) => loadFavorites());
  }

  Future<void> loadProperty() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      List<Property> propertyList = await _propertyService.getAllProperty();
      propertyList.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      properties.value = propertyList.take(5).toList();

      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;
      errorMessage.value = 'Failed to load home page';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> loadNews() async {
    // try {
    //   isLoading.value = true;
    //   errorMessage.value = '';

    //   List<News> newsList = await _newsService.getAllNews();

    //   newsList.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    //   news.value = newsList.take(5).toList();

    //   isLoading.value = false;
    // } catch (e) {
    //   isLoading.value = false;
    //   errorMessage.value = 'Failed to load home page';
    // } finally {
    //   isLoading.value = false;
    // }
  }

  Future<void> refreshAllData() async {
    await loadProperty();
    // await loadNews();
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

  Future<void> loadFavorites() async {
    // if (userId.value.isEmpty) return;
    // try {
    //   final favorites =
    //       await _userFavoriteService.getUserFavorities(userId.value);
    //   userFavorites.value = favorites;
    //   favoriteIds.value = favorites.map((e) => e.propertyId).toList();
    // } catch (e) {
    //   favoriteIds.clear();
    //   print("Error load favorites: $e");
    // }
  }

  Future<void> toggleFavorite(String propertyId) async {
    if (userId.value.isEmpty) return;
    if (loadingIds.contains(propertyId)) return;

    loadingIds.add(propertyId);
    final fav = UserFavorite(userId: userId.value, propertyId: propertyId);
    print(fav);

    try {
      if (favoriteIds.contains(propertyId)) {
        favoriteIds.remove(propertyId);
      } else {
        favoriteIds.add(propertyId);
      }

      await _propertyService.createOrRemove(fav);
    } catch (e) {
      print("Error toggle favorite: $e");
      if (favoriteIds.contains(propertyId)) {
        favoriteIds.remove(propertyId);
      } else {
        favoriteIds.add(propertyId);
      }
    } finally {
      loadingIds.remove(propertyId);
    }
  }
}
