import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/models/user.dart';
import 'package:mobile_nirwana/data/models/user_favorite.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';
import 'package:mobile_nirwana/data/service/user_favorite_service.dart';

class ProfileController extends GetxController {
  final AuthService _authService = AuthService();
  final UserFavoriteService _userFavoriteService = UserFavoriteService();
  final userFavorities = <UserFavorite>[].obs;
  final RxBool isLoggedIn = false.obs;
  final RxList<Property> favoriteProperties = <Property>[].obs;
  final RxBool isLoading = false.obs;

  var currentUser = User(
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
  }

  void checkLoginStatus() async {
    await _authService.isLoggedIn().then((loggedIn) {
      isLoggedIn.value = loggedIn;
      if (loggedIn) {
        loadUserData();
        loadFavoriteProperties();
      }
    });
  }

  void loadUserData() async {
    currentUser.value = await _authService.getCurrentUser();
  }

  void loadFavoriteProperties() async {
    if (!isLoggedIn.value) return;

    isLoading.value = true;
    try {
      userFavorities.value =
          await _userFavoriteService.getUserFavorities(currentUser.value.id!);
    } catch (e) {
      isLoading.value = false;
      GetSnackBar(
        title: "Error",
        message: "Gagal memuat properti favorit",
        duration: Duration(seconds: 3),
      );
    }
  }

  void logout() async {
    await _authService.logout();
  }

  void removeFavorite(String propertyId) {
    // favoriteProperties.removeWhere((property) => property.id == propertyId);
    // Get.snackbar(
    //   "Berhasil",
    //   "Properti dihapus dari favorit",
    //   backgroundColor: Color(0xFFDBB837),
    //   colorText: Colors.white,
    // );
  }

  // Edit profile
  void editProfile() {
    // Navigate to edit profile page
    // Get.toNamed('/edit-profile');
    print("Navigate to edit profile page");
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
