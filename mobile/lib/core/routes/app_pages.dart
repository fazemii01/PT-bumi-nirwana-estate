import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/views/auth/login/login_page.dart';
import 'package:mobile_nirwana/views/auth/register/register_page.dart';
import 'package:mobile_nirwana/views/eligibilitas/eligibilitas_page.dart';
import 'package:mobile_nirwana/views/kpr/form/widgets/hasil_simulation.dart';
import 'package:mobile_nirwana/views/kpr/form/simulation_form.dart';
import 'package:mobile_nirwana/views/kpr/kpr_page.dart';
import 'package:mobile_nirwana/views/layout.dart';
import 'package:mobile_nirwana/views/news/detail/detail_news.dart';
import 'package:mobile_nirwana/views/news/news.dart';
import 'package:mobile_nirwana/views/properties/detail/detail_properties.dart';

class AppPages {
  static final pages = [
    GetPage(
      name: '/layout',
      page: () => Layout(),
      transition: Transition.fadeIn,
      transitionDuration: Duration(milliseconds: 200),
    ),
    GetPage(
      name: '/login',
      page: () => LoginPage(),
      transition: Transition.downToUp,
      transitionDuration: Duration(milliseconds: 400),
    ),
    GetPage(
        name: '/register',
        page: () => RegisterPage(),
        transition: Transition.leftToRight),
    GetPage(
      name: '/kpr',
      page: () => KprPage(),
      transition: Transition.leftToRight,
      transitionDuration: Duration(milliseconds: 400),
    ),
    GetPage(
      name: '/simulation-kpr',
      page: () => SimulationForm(),
      transition: Transition.downToUp,
      transitionDuration: Duration(milliseconds: 400),
    ),
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
      transition: Transition.rightToLeft,
      transitionDuration: Duration(milliseconds: 300),
    ),
    GetPage(
      name: '/cek-eligibilitas',
      page: () => EligibilitasKPRPage(),
      transition: Transition.leftToRight,
      transitionDuration: Duration(milliseconds: 500),
    ),
    GetPage(
      name: '/detail-properties',
      page: () {
        final Property property = Get.arguments as Property;
        return PropertyDetailPage(property: property);
      },
      transition: Transition.rightToLeft,
      transitionDuration: Duration(milliseconds: 300),
    ),
    GetPage(
      name: '/news',
      page: () => const NewsPage(),
      transition: Transition.rightToLeft,
      transitionDuration: Duration(milliseconds: 300),
    ),
    GetPage(
      name: '/detail-news',
      page: () {
        final News news = Get.arguments as News;
        return NewsDetailPage(news: news);
      },
      transition: Transition.rightToLeftWithFade,
      transitionDuration: Duration(milliseconds: 300),
    ),
  ];
}
