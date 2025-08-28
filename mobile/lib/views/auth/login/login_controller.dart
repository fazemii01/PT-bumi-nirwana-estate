import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class LoginController extends GetxController {
  final AuthService _authService = AuthService();

  final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId:
        "490608507191-gra7sqkb3cr0m72r2cfvk56r9qmmhi19.apps.googleusercontent.com",
    scopes: ['email'],
  );

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
          Get.snackbar("Success", "Login successfully",
              backgroundColor: Colors.green, colorText: Colors.white);
          Get.offAllNamed(Routes.LAYOUT);
        } else {
          Get.snackbar('Error', '$errorMessage',
              backgroundColor: Colors.red, colorText: Colors.white);
          print("Error login dengan Google: $errorMessage");
          return;
        }
      }
    } catch (error) {
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
