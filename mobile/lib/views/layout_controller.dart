import 'package:get/get.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class LayoutController extends GetxController {
  final AuthService _authService = AuthService();

  var isLoggedIn = false.obs;

  @override
  void onInit() {
    super.onInit();
    loadUserStatus();
  }

  void loadUserStatus() async {
    bool logged = await _authService.isLoggedIn();
    isLoggedIn.value = logged;
  }
}
