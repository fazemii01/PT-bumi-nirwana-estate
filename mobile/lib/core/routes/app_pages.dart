import 'package:get/get.dart';
import 'package:mobile_nirwana/views/auth/login/login_page.dart';
import 'package:mobile_nirwana/views/auth/register/register_page.dart';
import 'package:mobile_nirwana/views/kpr/form/simulation_form.dart';
import 'package:mobile_nirwana/views/kpr/kpr_page.dart';
import 'package:mobile_nirwana/views/layout.dart';

class AppPages {
  static final pages = [
    GetPage(
        name: '/layout',
        page: () => Layout(),
        transition: Transition.leftToRight),
    GetPage(
        name: '/login',
        page: () => LoginPage(),
        transition: Transition.leftToRight),
    GetPage(
        name: '/register',
        page: () => RegisterPage(),
        transition: Transition.leftToRight),
    GetPage(
        name: '/kpr',
        page: () => KprPage(),
        transition: Transition.leftToRight),
    GetPage(
        name: '/simulation-kpr',
        page: () => SimulationForm(),
        transition: Transition.leftToRight),
  ];
}
