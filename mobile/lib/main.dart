import 'package:mobile_nirwana/core/routes/app_pages.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:flutter/services.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:mobile_nirwana/data/service/notification_service.dart';
import 'package:mobile_nirwana/data/service/push_notification_service.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp();
  await GetStorage.init();
  await NotificationService().initialize();

  await PushNotificationService().registerDeviceToken();
  setupForegroundNotificationListener();

  await setupNotificationClickListeners();

  final box = GetStorage();
  final token = box.read("access_token");

  bool isTokenExpired = token == null || JwtDecoder.isExpired(token);

  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);

  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    systemNavigationBarColor: Colors.transparent,
    systemNavigationBarIconBrightness: Brightness.dark,
  ));

  runApp(MyApp(initialRoute: isTokenExpired ? Routes.LOGIN : Routes.LAYOUT));
}

class MyApp extends StatelessWidget {
  final String initialRoute;

  const MyApp({super.key, required this.initialRoute});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: initialRoute,
      getPages: AppPages.pages,
    );
  }
}

void setupForegroundNotificationListener() {
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    print('Menerima pesan saat aplikasi terbuka!');

    if (message.notification != null) {
      print('Judul: ${message.notification!.title}');
      print('Isi: ${message.notification!.body}');

      NotificationService().showSimpleNotification(
        id: DateTime.now().millisecondsSinceEpoch.remainder(100000),
        title: message.notification!.title ?? 'Tanpa Judul',
        body: message.notification!.body ?? 'Tanpa Isi',
        payload: message.data['newsId'],
      );
    }
  });
}

Future<void> setupNotificationClickListeners() async {
  RemoteMessage? initialMessage =
      await FirebaseMessaging.instance.getInitialMessage();
  if (initialMessage != null) {
    _handleNotificationClick(initialMessage.data['newsId']);
  }

  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    _handleNotificationClick(message.data['newsId']);
  });
}

void _handleNotificationClick(String? payload) {
  if (payload != null && payload.isNotEmpty) {
    print('Navigasi ke detail berita dengan ID: $payload');
    Get.toNamed(Routes.DETAIL_PROPERTIES, arguments: payload);
  }
}
