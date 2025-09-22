import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:local_auth/local_auth.dart';
import 'package:mobile_nirwana/data/models/user.dart';
import 'package:mobile_nirwana/data/models/user_favorite.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';
import 'package:mobile_nirwana/data/service/user_favorite_service.dart';
import 'package:mobile_nirwana/data/service/user_service.dart';

class ProfileController extends GetxController {
  final LocalAuthentication auth = LocalAuthentication();
  final AuthService _authService = AuthService();
  final UserFavoriteService _userFavoriteService = UserFavoriteService();
  final UserService _userService = UserService();
  final userFavorities = <UserFavorite>[].obs;
  final RxBool isLoggedIn = false.obs;
  final RxBool isLoading = false.obs;
  final RxBool isLoadUser = false.obs;
  final RxBool isProfileExpanded = false.obs;
  final RxBool isSecurityExpanded = false.obs;
  final RxBool isEditing = false.obs;
  final RxString errorMessage = ''.obs;
  final RxString errorLoadUser = ''.obs;
  final RxString userId = ''.obs;
  final RxBool isAuthenticated = false.obs;
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
      print('PHONE ${currentUser.value.phone_number}');
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

  void toggleSecurityExpansion() {
    isSecurityExpanded.value = !isSecurityExpanded.value;
  }

  void editProfile(String name, String phone, BuildContext context) async {
    isEditing.value = true;
    final response = await _userService.updateName(userId.value, name, phone);
    if (response == null) {
      await loadUserData();
      Navigator.pop(context);
      isEditing.value = false;
      Get.snackbar('Berhasil', 'Nama berhasil diperbarui',
          backgroundColor: Colors.green, colorText: Colors.white);
    } else {
      isEditing.value = false;
      Get.snackbar('Gagal', 'Gagal memperbarui nama: $response',
          backgroundColor: Colors.red, colorText: Colors.white);
    }
  }

  Future<void> authenticateAndChangePassword() async {
    bool didAuthenticate = false;
    try {
      final bool canCheckBiometrics = await auth.canCheckBiometrics;
      if (!canCheckBiometrics) {
        Get.snackbar('Gagal', 'Perangkat tidak mendukung biometrik.');
        return;
      }

      didAuthenticate = await auth.authenticate(
        localizedReason: 'Verifikasi sidik jari Anda untuk mengubah password',
        options: const AuthenticationOptions(
          stickyAuth:
              true, // Dialog akan tetap terbuka saat aplikasi ke background
          biometricOnly: true, // Hanya izinkan biometrik (bukan PIN/Pola)
        ),
      );
    } on PlatformException catch (e) {
      Get.snackbar('Gagal', 'Terjadi error: $e',
          backgroundColor: Colors.red, colorText: Colors.white);
      return;
    }

    if (isClosed) return;

    if (didAuthenticate) {
      isAuthenticated.value = true;

      toggleSecurityExpansion();
    }
  }
}
