import 'package:get/get.dart';
import 'package:mobile_nirwana/views/layout.dart';

class AppPages {
  static final pages = [
    GetPage(
        name: '/layout',
        page: () => Layout(),
        transition: Transition.leftToRight),
  ];
}
