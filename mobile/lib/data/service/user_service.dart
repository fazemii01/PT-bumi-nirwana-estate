import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/user.dart';

class UserService extends Api {
  Future<String?> updateName(
      String userId, String full_name, String phone) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/users/$userId'),
        headers: getToken()..addAll({"Content-Type": "application/json"}),
        body: jsonEncode({'full_name': full_name, 'phone_number': phone}),
      );

      if (response.statusCode == 200) {
        return null;
      } else {
        print("ERROR ${jsonDecode(response.body)}");
        return "Gagal memperbarui nama.";
      }
    } catch (e) {
      print("=== ERROR UPDATE NAME ===");
      print(e);
      return "Gagal memperbarui nama. Coba lagi!";
    }
  }

  Future<User> getUserById(String userId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/users/$userId'),
          headers: getToken()..addAll({'Content-Type': 'application/json'}));

      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Gagal mengambil data');
      }
    } catch (e) {
      print(e);
      throw Exception('Terjadi kesalahan jaringan: $e');
    }
  }
}
