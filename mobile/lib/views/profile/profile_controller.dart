import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:mobile_nirwana/data/models/user.dart';
import 'package:mobile_nirwana/data/models/user_favorite.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';
import 'package:mobile_nirwana/data/service/user_favorite_service.dart';
import 'package:mobile_nirwana/data/service/user_service.dart';

class ProfileController extends GetxController {
  final AuthService _authService = AuthService();
  final UserFavoriteService _userFavoriteService = UserFavoriteService();
  final UserService _userService = UserService();
  final userFavorities = <UserFavorite>[].obs;
  final RxBool isLoggedIn = false.obs;
  final RxBool isLoading = false.obs;
  final RxBool isLoadUser = false.obs;
  final RxBool isProfileExpanded = false.obs;
  final RxBool isEditing = false.obs;
  final RxString errorMessage = ''.obs;
  final RxString errorLoadUser = ''.obs;
  final RxString userId = ''.obs;
  final currentUser = User(
    id: '',
    full_name: 'Guest',
    email: '',
    phone_number: '',
    role: '',
  ).obs;

  @override
  void onInit() {
    super.onInit();
    checkLoginStatus();
    loadUserId();
  }

  void checkLoginStatus() async {
    bool loggedIn = await _authService.isLoggedIn();
    isLoggedIn.value = loggedIn;
    if (loggedIn) {
      await loadUserId();
      await loadUserData();
      await loadFavoriteProperties();
    }
  }

  Future<void> loadUserId() async {
    userId.value = await _authService.getUserId();
  }

  Future<void> loadFavoriteProperties() async {
    if (!isLoggedIn.value) return;
    errorMessage.value = '';
    isLoading.value = true;
    try {
      List<UserFavorite> favorites =
          await _userFavoriteService.getUserFavorities(userId.value);
      userFavorities.value = favorites;
      print("Fetched ${favorites.length} favorites");
    } catch (e) {
      errorMessage.value = e.toString();
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> loadUserData() async {
    try {
      errorLoadUser.value = '';
      isLoadUser.value = true;
      currentUser.value = await _userService.getUserById(userId.value);
    } catch (e) {
      errorLoadUser.value = e.toString();
    } finally {
      isLoadUser.value = false;
    }
  }

  Future<void> loadPage() async {
    await loadUserData();
    await loadFavoriteProperties();
  }

  void logout() async {
    await _authService.logout();
  }

  void toggleProfileExpansion() {
    isProfileExpanded.value = !isProfileExpanded.value;
  }

  void editProfile(String userId, String name) async {
    isEditing.value = true;
    final response = await _userService.updateName(userId, name);
    if (response == null) {
      isEditing.value = false;
      currentUser.value = User(
        id: currentUser.value.id,
        full_name: name,
        email: currentUser.value.email,
        phone_number: currentUser.value.phone_number,
        role: currentUser.value.role,
      );

      final box = GetStorage();
      box.write('user', currentUser.value.toJson());
      Get.snackbar('Berhasil', 'Nama berhasil diperbarui',
          backgroundColor: Colors.green, colorText: Colors.white);
    } else {
      isEditing.value = false;
      Get.snackbar('Gagal', 'Gagal memperbarui nama: $response',
          backgroundColor: Colors.red, colorText: Colors.white);
    }
  }

  // Show phone number dialog
  void showPhoneDialog() {
    Get.defaultDialog(
      title: "Nomor Telepon",
      middleText: currentUser.value.phone_number ?? 'Tidak ada nomor telepon',
      textConfirm: "OK",
      confirmTextColor: Colors.white,
      buttonColor: Color(0xFFDBB837),
    );
  }
}
