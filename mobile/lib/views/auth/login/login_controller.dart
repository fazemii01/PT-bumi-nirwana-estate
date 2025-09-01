import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class LoginController extends GetxController {
  final AuthService _authService = AuthService();

  final formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final isLoading = false.obs;
  final isLoadingGoogle = false.obs;
  final obscurePassword = true.obs;

  @override
  void onInit() {
    super.onInit();
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  void clearAll() {
    emailController.clear();
    passwordController.clear();
  }

  Future<void> handleGoogleLogin() async {
    try {
      isLoadingGoogle.value = true;
      final message = await _authService.loginWithGoogle();
      if (message == null) {
        clearAll();
        isLoadingGoogle.value = false;
        Get.snackbar("Success", "Login successfully",
            backgroundColor: Colors.green, colorText: Colors.white);
        Get.offAllNamed(Routes.LAYOUT);
      } else if (message == 'batal') {
        isLoadingGoogle.value = false;
      } else {
        isLoadingGoogle.value = false;
        Get.snackbar('Error', '$message',
            backgroundColor: Colors.red, colorText: Colors.white);
        print("Error login dengan Google: $message");
      }
    } catch (error) {
      isLoadingGoogle.value = false;
      Get.snackbar('Error', '$error',
          backgroundColor: Colors.red, colorText: Colors.white);
      print("terjadi kesalahan: $error");
    }
  }

  Future<void> handleLogin() async {
    if (formKey.currentState!.validate()) {
      isLoading.value = true;

      final response = await _authService.login(
          emailController.text.trim(), passwordController.text.trim());
      if (response == null) {
        clearAll();
        isLoading.value = false;
        Get.snackbar("Success", "Login successfully",
            backgroundColor: Colors.green, colorText: Colors.white);
        Get.offAllNamed(Routes.LAYOUT);
      } else {
        isLoading.value = false;
        Get.snackbar('Error', '$response',
            backgroundColor: Colors.red, colorText: Colors.white);
        print("Error login dengan Google: $response");
      }
    }
  }
}
