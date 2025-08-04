import '../../presentation/pages/start/get_started.dart';
import 'package:get/get.dart';

class AppPages {
  static final pages = [
    GetPage(
        name: '/started',
        page: () => GetStartedScreen(),
        transition: Transition.leftToRight),
  ];
}
