import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/models/user.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class RegisterController extends GetxController {
  final AuthService _authService = AuthService();

  final formKey = GlobalKey<FormState>();
  final fullNameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  final obscurePassword = true.obs;
  final obscureConfirmPassword = true.obs;
  final isLoading = false.obs;
  final isLoadingGoogle = false.obs;

  final agreeToTerms = false.obs;

  late Animation<double> fadeAnimation;
  late Animation<Offset> slideAnimation;

  @override
  void onClose() {
    fullNameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }

  void clearAll() {
    fullNameController.clear();
    emailController.clear();
    phoneController.clear();
    passwordController.clear();
    confirmPasswordController.clear();
  }

  Future<void> handleGoogleRegister() async {
    try {
      isLoadingGoogle.value = true;
      final message = await _authService.loginWithGoogle();
      if (message == null) {
        clearAll();
        isLoadingGoogle.value = false;
        Get.snackbar("Success", "Register successfully",
            backgroundColor: Colors.green, colorText: Colors.white);
        Get.offAllNamed(Routes.LAYOUT);
      } else if (message == 'batal') {
        isLoadingGoogle.value = false;
      } else {
        isLoadingGoogle.value = false;
        Get.snackbar('Error', '$message',
            backgroundColor: Colors.red, colorText: Colors.white);
        print("Error register dengan Google: $message");
      }
    } catch (error) {
      isLoadingGoogle.value = false;
      Get.snackbar('Error', '$error',
          backgroundColor: Colors.red, colorText: Colors.white);
      print("terjadi kesalahan: $error");
    }
  }

  void handleManualRegister(BuildContext context) async {
    if (!formKey.currentState!.validate()) {
      return;
    }

    if (!agreeToTerms.value) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Harap setujui syarat dan ketentuan'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      );
      return;
    }

    final user = User(
        full_name: fullNameController.text.trim(),
        email: emailController.text.trim(),
        phone_number: phoneController.text,
        password_hash: confirmPasswordController.text.trim(),
        role: 'USER');

    isLoading.value = true;
    final response = await _authService.register(user);
    if (response == null) {
      clearAll();
      isLoading.value = false;
      Get.snackbar("Success", "Register successfully",
          backgroundColor: Colors.green, colorText: Colors.white);
      Get.offAllNamed(Routes.LOGIN);
    } else {
      isLoading.value = false;
      Get.snackbar('Error', '$response',
          backgroundColor: Colors.red, colorText: Colors.white);
      print("Error register manual: $response");
    }
  }
}
