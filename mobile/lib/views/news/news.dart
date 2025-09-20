import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:mobile_nirwana/views/news/news_controller.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/widgets/skeleton_home_news.dart'; // Sesuaikan path

class NewsPage extends StatefulWidget {
  const NewsPage({super.key});

  @override
  State<NewsPage> createState() => _NewsPageState();
}

class _NewsPageState extends State<NewsPage> {
  final NewsController _newsController = Get.put(NewsController());
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      _newsController.updateSearchQuery(_searchController.text);
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryYellow = Color(0xFFDBB837);

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Berita & Artikel'),
        titleTextStyle: const TextStyle(
          fontFamily: 'Inter',
          color: Colors.black87,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16.0),
              color: Colors.white,
              child: Column(
                children: [
                  TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Cari berita...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12.0),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 40,
                    child: Obx(() => ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: _newsController.newsCategories.length + 1,
                          separatorBuilder: (context, index) =>
                              const SizedBox(width: 8),
                          itemBuilder: (context, index) {
                            if (index == 0) {
                              return _buildFilterChip('Semua', primaryYellow);
                            }
                            final category =
                                _newsController.newsCategories[index - 1];
                            return _buildFilterChip(
                                category.name, primaryYellow);
                          },
                        )),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Obx(() {
                if (_newsController.isLoading.value &&
                    _newsController.filteredNews.isEmpty) {
                  return _buildLoadingState();
                }
                if (_newsController.errorMessage.value.isNotEmpty) {
                  return Center(
                      child: Text(_newsController.errorMessage.value));
                }
                if (_newsController.filteredNews.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off_rounded,
                            size: 64, color: Colors.grey),
                        SizedBox(height: 16),
                        Text(
                          'Berita tidak ditemukan',
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Coba kata kunci atau filter lain.',
                          style: TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: () => _newsController.refreshData(),
                  backgroundColor: Colors.white,
                  color: primaryYellow,
                  child: ListView.separated(
                    physics: const BouncingScrollPhysics(
                        parent: AlwaysScrollableScrollPhysics()),
                    padding: const EdgeInsets.all(16.0),
                    itemCount: _newsController.filteredNews.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 16),
                    itemBuilder: (context, index) {
                      final news = _newsController.filteredNews[index];
                      return _buildNewsCard(news, primaryYellow);
                    },
                  ),
                );
              }),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, Color primaryColor) {
    return Obx(() {
      final isSelected = _newsController.selectedCategory.value == label;
      return ActionChip(
        label: Text(label),
        onPressed: () => _newsController.changeCategory(label),
        // FIX 2: Gunakan warna kuning lokal
        backgroundColor: isSelected ? primaryColor : Colors.grey[200],
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : Colors.black87,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      );
    });
  }

  Widget _buildLoadingState() {
    return ListView.separated(
      padding: const EdgeInsets.all(16.0),
      itemCount: 5,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) =>
          const SkeletonHomeNews(), // Sesuaikan dengan skeleton Anda
    );
  }

  Widget _buildNewsCard(News news, Color primaryColor) {
    String getNewsImage(News news) {
      if (news.newsImages.isNotEmpty && news.newsImages.first.imgUrl != null) {
        return news.newsImages.first.imgUrl!;
      }
      return '';
    }

    return InkWell(
      onTap: () {
        Get.toNamed(Routes.DETAIL_NEWS, arguments: news);
      },
      borderRadius: BorderRadius.circular(16.0),
      child: Container(
        padding: const EdgeInsets.all(12.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16.0),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12.0),
              child: Image.network(
                Imgurl.get('news/news_images/${getNewsImage(news)}'),
                width: 100,
                height: 100,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                    width: 100,
                    height: 100,
                    color: Colors.grey.shade200,
                    child: Icon(Icons.article_outlined,
                        color: Colors.grey.shade400, size: 40)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: SizedBox(
                height: 150,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        news.newsCategory.name,
                        style: TextStyle(
                          color: primaryColor,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      news.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 8),
                    Text(
                      news.description,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                        height: 1.4,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 8),
                    Text(
                      DateFormat('d MMMM yyyy').format(news.createdAt),
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
