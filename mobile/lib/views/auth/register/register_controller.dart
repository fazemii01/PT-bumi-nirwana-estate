import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class RegisterController extends GetxController {
  final AuthService _authService = AuthService();

  final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId:
        "490608507191-gra7sqkb3cr0m72r2cfvk56r9qmmhi19.apps.googleusercontent.com",
    scopes: ['email'],
  );

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
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

      if (googleUser == null) {
        isLoading.value = false;
        Get.snackbar('Error', 'Login dibatalkan',
            backgroundColor: Colors.red, colorText: Colors.white);
        return;
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      final idToken = googleAuth.idToken;

      if (idToken != null) {
        final errorMessage = await _authService.loginWithGoogle(idToken);

        if (errorMessage == null) {
          isLoading.value = false;
          Get.snackbar("Success", "Register successfully",
              backgroundColor: Colors.green, colorText: Colors.white);
          Get.offAllNamed(Routes.LAYOUT);
        } else {
          Get.snackbar('Error', '$errorMessage',
              backgroundColor: Colors.red, colorText: Colors.white);
          return;
        }
      }
    } catch (error) {
      print("Error login dengan Google: $error");
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
