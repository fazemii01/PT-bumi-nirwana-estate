import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:mobile_nirwana/data/service/news_service.dart';

class NewsController extends GetxController {
  final NewsService _newsService = NewsService();

  var newsList = <News>[].obs;
  var isLoading = true.obs;

  @override
  void onInit() {
    super.onInit();
    fetchAllNews();
  }

  void fetchAllNews() async {
    try {
      isLoading(true);
      var result = await _newsService.getAllNews();
      newsList.assignAll(result);
    } catch (e) {
      print(e);
    } finally {
      isLoading(false);
    }
  }
}
