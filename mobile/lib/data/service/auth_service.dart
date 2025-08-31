import 'dart:convert';

import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_nirwana/data/models/auth-response.dart';
import 'package:mobile_nirwana/data/models/user.dart';

class AuthService extends Api {
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId:
        "490608507191-gra7sqkb3cr0m72r2cfvk56r9qmmhi19.apps.googleusercontent.com",
    scopes: ['email'],
  );

  Future<String?> loginWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

      if (googleUser == null) {
        return 'batal';
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      final idToken = googleAuth.idToken;

      if (idToken != null) {
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
      }
      return "Terjadi kesalahan. silahkan coba lagi.";
    } catch (e) {
      print("[ERROR] Terjadi kesalahan saat login $e");
      return "Gagal terhubung ke server";
    }
  }

  Future<String?> login(String email, String password) async {
    try {
      final response = await http.post(Uri.parse('$baseUrl/auths/signin'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'email': email, 'password_hash': password}));

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
      print('ERROR login $e');
      return 'Login failed';
    }
  }

  Future<String?> register(User user) async {
    try {
      final response = await http.post(Uri.parse('$baseUrl/auths/signup'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(user.toJson()));

      if (response.statusCode == 200 || response.statusCode == 201) {
        return null;
      } else {
        print(jsonDecode(response.body)['message']);
        return jsonDecode(response.body)['message'].toString();
      }
    } catch (e) {
      print("USER ${user.toJson()}");
      print('ERROR register $e');
      return 'Register failed';
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
    await _googleSignIn.signOut();
    final box = GetStorage();
    box.erase();
    Get.offAllNamed(Routes.LAYOUT);
  }
}
