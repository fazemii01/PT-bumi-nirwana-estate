import 'dart:convert';

import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_nirwana/data/models/auth-response.dart';

class AuthService extends Api {
  Future<String?> loginWithGoogle(String idToken) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auths/google-login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"idToken": idToken}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final authResponse = AuthResponse.fromJson(data);

        final box = GetStorage();
        box.write('access_token', authResponse.accessToken);
        box.write('full_name', authResponse.user.full_name);
        box.write('email', authResponse.user.email);
        box.write('user_id', authResponse.user.id);

        return null;
      } else {
        return jsonDecode(response.body)['message'] ?? 'Login failed';
      }
    } catch (e) {
      print("[ERROR] Terjadi kesalahan saat login $e");
      return "Gagal terhubung ke server";
    }
  }

  Future<bool> isLoggedIn() async {
    try {
      final box = GetStorage();
      final token = box.read("access_token");

      if (token != null && token.isNotEmpty) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<String> getUserName() async {
    try {
      final box = GetStorage();
      final userName = box.read("full_name");
      return userName ?? 'User';
    } catch (e) {
      return 'User';
    }
  }

  Future<String> getEmail() async {
    try {
      final box = GetStorage();
      final userEmail = box.read("email");
      return userEmail ?? '';
    } catch (e) {
      return '';
    }
  }

  Future<String> getUserDisplayText() async {
    try {
      bool loggedIn = await isLoggedIn();
      if (loggedIn) {
        String userName = await getUserName();
        return "Halo $userName";
      } else {
        return "Halo Guest";
      }
    } catch (e) {
      return "Halo Guest";
    }
  }

  Future<void> logout() async {
    final box = GetStorage();
    box.erase();
    Get.offAllNamed(Routes.LAYOUT);
  }
}
