import 'package:get/get.dart';
import 'package:mobile_nirwana/views/auth/login/login_page.dart';
import 'package:mobile_nirwana/views/auth/register/register_page.dart';
import 'package:mobile_nirwana/views/kpr/form/widgets/hasil_simulation.dart';
import 'package:mobile_nirwana/views/kpr/form/simulation_form.dart';
import 'package:mobile_nirwana/views/kpr/kpr_page.dart';
import 'package:mobile_nirwana/views/layout.dart';
import 'package:mobile_nirwana/views/news/detail/detail_news.dart';
import 'package:mobile_nirwana/views/properties/detail/detail_properties.dart';

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
    GetPage(
        name: '/hasil-simulations',
        page: () {
          final args = Get.arguments as Map<String, dynamic>;
          return HasilSimulation(
            breakdown: args['breakdown'],
            loanSimulation: args['loanSimulation'],
            hasil: args['hasil'],
          );
        },
        transition: Transition.leftToRight),
    GetPage(
      name: '/detail-properties',
      page: () => PropertyDetailPage(),
      transition: Transition.downToUp,
      transitionDuration: Duration(milliseconds: 500),
    ),
    GetPage(
      name: '/detail-news',
      page: () => NewsDetailPage(),
      transition: Transition.downToUp,
      transitionDuration: Duration(milliseconds: 500),
    ),
  ];
}
