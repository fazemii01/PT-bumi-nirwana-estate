import 'package:get_storage/get_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class Api {
  String baseUrl = "http://192.168.1.244:5000";
  // String baseUrl = "http://10.186.253.244:5000";

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
  static String baseUrl = "http://192.168.1.244:5000/uploads";
  // static String baseUrl = "http://10.186.253.244:5000/uploads";

  static String get(String filename) {
    return "$baseUrl/$filename";
  }
}
