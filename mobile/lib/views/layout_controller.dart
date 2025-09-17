import 'package:get/get.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class LayoutController extends GetxController {
  final AuthService _authService = AuthService();

  var tabIndex = 0.obs;

  void changeTabIndex(int index) {
    tabIndex.value = index;
  }

  var isLoggedIn = false.obs;

  @override
  void onInit() {
    super.onInit();
    loadUserStatus();
    if (Get.arguments != null && Get.arguments is int) {
      changeTabIndex(Get.arguments);
    }
  }

  void loadUserStatus() async {
    bool logged = await _authService.isLoggedIn();
    isLoggedIn.value = logged;
  }
}
