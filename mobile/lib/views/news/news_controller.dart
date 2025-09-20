import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:mobile_nirwana/data/models/news/news_category.dart';
import 'package:mobile_nirwana/data/service/news_service.dart';

class NewsController extends GetxController {
  final NewsService _newsService = NewsService();

  var isLoading = false.obs;
  var errorMessage = ''.obs;

  var allNews = <News>[].obs;
  var filteredNews = <News>[].obs;

  var newsCategories = <NewsCategory>[].obs;
  var selectedCategory = 'Semua'.obs;
  var searchQuery = ''.obs;

  @override
  void onInit() {
    super.onInit();
    fetchInitialData();
  }

  Future<void> fetchInitialData() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final results = await Future.wait([
        _newsService.getAllNews(),
        _newsService.getAllNewsCategories(),
      ]);

      allNews.assignAll(results[0] as List<News>);
      newsCategories.assignAll(results[1] as List<NewsCategory>);

      allNews.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      filteredNews.assignAll(allNews);
    } catch (e) {
      errorMessage.value = "Gagal memuat data berita.";
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> changeCategory(String category) async {
    selectedCategory.value = category;
    isLoading.value = true;

    try {
      List<News> result = [];
      if (category == 'Semua') {
        result = await _newsService.getAllNews();
        allNews.assignAll(result);
      } else {
        result = await _newsService.getNewsByCategory(category);
      }

      result.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      filteredNews.assignAll(result);

      if (searchQuery.value.isNotEmpty) {
        _runFilters();
      }
    } catch (e) {
      errorMessage.value = "Gagal memfilter berita";
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> refreshData() async {
    await changeCategory(selectedCategory.value);
  }

  void updateSearchQuery(String query) {
    searchQuery.value = query;
    _runFilters();
  }

  Future<void> _runFilters() async {
    isLoading.value = true;

    try {
      List<News> results;

      //Ambil data berdasarkan KATEGORI
      if (selectedCategory.value == 'Semua') {
        results = allNews;
      } else {
        // Panggil API hanya jika kategori bukan "Semua"
        results = await _newsService.getNewsByCategory(selectedCategory.value);
      }

      //Saring hasil dari Langkah 1 berdasarkan PENCARIAN
      if (searchQuery.value.isNotEmpty) {
        results = results
            .where((news) => news.title
                .toLowerCase()
                .contains(searchQuery.value.toLowerCase()))
            .toList();
      }

      //Urutkan hasil akhir
      results.sort((a, b) => b.createdAt.compareTo(a.createdAt));

      //Update UI
      filteredNews.assignAll(results);
    } catch (e) {
      errorMessage.value = "Gagal memfilter berita";
    } finally {
      isLoading.value = false;
    }
  }
}
