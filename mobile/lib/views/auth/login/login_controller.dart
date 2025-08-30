import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class LoginController extends GetxController {
  final AuthService _authService = AuthService();

  final formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final isLoading = false.obs;
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

  Future<void> handleGoogleLogin() async {
    try {
      isLoading.value = true;
      final message = await _authService.loginWithGoogle();
      if (message == null) {
        isLoading.value = false;
        Get.snackbar("Success", "Login successfully",
            backgroundColor: Colors.green, colorText: Colors.white);
        Get.offAllNamed(Routes.LAYOUT);
      } else {
        isLoading.value = false;
        Get.snackbar('Error', '$message',
            backgroundColor: Colors.red, colorText: Colors.white);
        print("Error login dengan Google: $message");
      }
    } catch (error) {
      isLoading.value = false;
      Get.snackbar('Error', '$error',
          backgroundColor: Colors.red, colorText: Colors.white);
      print("terjadi kesalahan: $error");
    }
  }

  Future<void> handleLogin() async {
    if (formKey.currentState!.validate()) {
      isLoading.value = true;

      // Simulasi login
      await Future.delayed(Duration(seconds: 2));

      isLoading.value = false;

      // ScaffoldMessenger.of(context).showSnackBar(
      //   SnackBar(
      //     content: Text('Login berhasil!'),
      //     backgroundColor: Colors.green,
      //   ),
      // );
    }
  }
}
