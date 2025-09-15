import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:mobile_nirwana/data/service/news_service.dart';

class NewsDetailController extends GetxController {
  final NewsService _newsService = NewsService();

  final Rx<News?> news = Rx<News?>(null);

  var isLoading = true.obs;
  var errorMessage = ''.obs;

  Future<void> fetchDetail(String id) async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final result = await _newsService.getNewsById(id);

      news.value = result;
    } catch (e) {
      errorMessage.value = e.toString();
    } finally {
      isLoading.value = false;
    }
  }
}
