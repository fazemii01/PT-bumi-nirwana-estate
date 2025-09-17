import 'package:get_storage/get_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class Api {
<<<<<<< HEAD
  String baseUrl = "http://192.168.0.101:5000";
  // String baseUrl = "http://10.219.7.51:5000";
=======
  // String baseUrl = "http://192.168.0.109:5000";
  String baseUrl = "http://10.51.79.244:5000";
>>>>>>> d5752076390bb9520435439268686f62764608a6

  Map<String, String> getToken() {
    final box = GetStorage();
    String? token = box.read("access_token");

    if (token != null && !JwtDecoder.isExpired(token)) {
      return {"Authorization": "Bearer ${token}"};
    }
    return {
      "Authorization": "Bearer BadToken",
    };
  }
}

class Imgurl {
<<<<<<< HEAD
  static String baseUrl = "http://192.168.0.101:5000/uploads";
  // static String baseUrl = "http://10.219.7.51:5000/uploads";
=======
  // static String baseUrl = "http://192.168.0.109:5000/uploads";
  static String baseUrl = "http://10.51.79.244:5000/uploads";
>>>>>>> d5752076390bb9520435439268686f62764608a6

  static String get(String filename) {
    return "$baseUrl/$filename";
  }
}
