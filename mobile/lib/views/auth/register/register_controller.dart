import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
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

  Future<void> handleGoogleRegister() async {
    try {
      isLoading.value = true;
      final message = await _authService.loginWithGoogle();
      if (message == null) {
        isLoading.value = false;
        Get.snackbar("Success", "Register successfully",
            backgroundColor: Colors.green, colorText: Colors.white);
        Get.offAllNamed(Routes.LAYOUT);
      } else {
        isLoading.value = false;
        Get.snackbar('Error', '$message',
            backgroundColor: Colors.red, colorText: Colors.white);
        print("Error register dengan Google: $message");
      }
    } catch (error) {
      isLoading.value = false;
      Get.snackbar('Error', '$error',
          backgroundColor: Colors.red, colorText: Colors.white);
      print("terjadi kesalahan: $error");
    }
  }

  Future<void> handleManualRegister() async {
    if (formKey.currentState!.validate() && agreeToTerms.value) {
      //   setState(() {
      //     isLoading = true;
      //   });

      //   // Simulasi register manual
      //   await Future.delayed(Duration(seconds: 2));

      //   setState(() {
      //     isLoading = false;
      //   });

      //   ScaffoldMessenger.of(context).showSnackBar(
      //     SnackBar(
      //       content: Text('Registrasi berhasil! Silakan login.'),
      //       backgroundColor: Colors.green,
      //       behavior: SnackBarBehavior.floating,
      //       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      //     ),
      //   );

      //   // Reset form
      //   formKey.currentState!.reset();
      //   fullNameController.clear();
      //   emailController.clear();
      //   phoneController.clear();
      //   passwordController.clear();
      //   confirmPasswordController.clear();
      //   setState(() {
      //     agreeToTerms = false;
      //   });
    } else if (!agreeToTerms.value) {
      // ScaffoldMessenger.of(context).showSnackBar(
      //   SnackBar(
      //     content: Text('Harap setujui syarat dan ketentuan'),
      //     backgroundColor: Colors.orange,
      //     behavior: SnackBarBehavior.floating,
      //     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      //   ),
      // );
    }
  }
}
