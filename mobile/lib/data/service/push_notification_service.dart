import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_nirwana/core/utils/api.dart';

class PushNotificationService extends Api {
  Future<void> registerDeviceToken() async {
    final box = GetStorage();
    bool isTokenSaved = box.read('is_fcm_token_saved') ?? false;

    final messaging = FirebaseMessaging.instance;
    await messaging.requestPermission();
    final String? fcmToken = await messaging.getToken();

    if (fcmToken == null) return;

    if (!isTokenSaved) {
      print('[FCM] Mendaftarkan token perangkat baru: $fcmToken');
      try {
        final response = await http.post(
          Uri.parse('$baseUrl/device-token'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode({'token': fcmToken}),
        );

        if (response.statusCode == 201) {
          print('[FCM] Token berhasil disimpan di backend.');
          await box.write('is_fcm_token_saved', true);
        } else {
          print('[FCM] Gagal menyimpan token. Status: ${response.statusCode}');
        }
      } catch (e) {
        print('[FCM] Error mendaftarkan token: $e');
      }
    } else {
      print('[FCM] Token perangkat sudah terdaftar sebelumnya.');
    }
  }
}
