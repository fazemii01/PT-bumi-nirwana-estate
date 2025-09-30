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
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        titleSpacing: 0,
        title: Padding(
          padding: const EdgeInsets.only(right: 20),
          child: SizedBox(
            height: 36,
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Cari berita...',
                hintStyle: const TextStyle(
                  fontStyle: FontStyle.italic,
                  color: Color(0xFF9E9E9E),
                ),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                  borderSide: const BorderSide(
                    color: Color.fromARGB(255, 227, 227, 227),
                    width: 0.5,
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Colors.black87, width: 1),
                ),
              ),
              style: const TextStyle(
                color: Color(0xFF1A1A1A),
                fontSize: 16,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
        ),
        // actions: [
        //   IconButton(
        //     icon: const Icon(Icons.search, color: Colors.black87),
        //     onPressed: () {
        //       print('Search button tapped: ${_searchController.text}');
        //     },
        //   ),
        // ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16.0),
              color: Colors.white,
              child: Column(
                children: [
                  SizedBox(
                    height: 30,
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
                      return GestureDetector(
                          onTap: () {
                            Get.toNamed(Routes.DETAIL_NEWS, arguments: news);
                          },
                          child: _buildNewsCard(news, primaryYellow));
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
      return GestureDetector(
        onTap: () => _newsController.changeCategory(label),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? primaryColor : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? primaryColor : Colors.grey.shade300,
              width: isSelected ? 0 : 0.5,
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.grey.shade700,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
              fontSize: 10,
            ),
          ),
        ),
      );
    });
  }

  Widget _buildLoadingState() {
    return ListView.separated(
      padding: const EdgeInsets.all(16.0),
      itemCount: 5,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) => const SkeletonHomeNews(),
    );
  }

  Widget _buildNewsCard(News news, Color primaryColor) {
    String getNewsImage(News news) {
      if (news.newsImages.isNotEmpty &&
          news.newsImages.first.imgUrl.isNotEmpty) {
        return news.newsImages.first.imgUrl;
      }
      return '';
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Stack(
        children: [
          // Main Content
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Image
                Container(
                  width: 100,
                  height: 100,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(
                      Imgurl.get('news/news_images/${getNewsImage(news)}'),
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            color: Colors.grey[200],
                          ),
                          child: Center(
                            child: Icon(
                              Icons.article_outlined,
                              size: 40,
                              color: Colors.grey[400],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),

                const SizedBox(width: 14),

                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title
                      Text(
                        news.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1a1a1a),
                          height: 1.3,
                          letterSpacing: -0.2,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),

                      SizedBox(height: 6),

                      // Description
                      Text(
                        news.description,
                        style: TextStyle(
                          fontSize: 13,
                          color: Color(0xFF6B7280),
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),

                      SizedBox(height: 8),

                      // Date - Bottom Right
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Text(
                            DateFormat('d MMM yyyy').format(news.createdAt),
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF9CA3AF),
                              letterSpacing: 0.2,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Category Badge - Nempel di Card pojok kiri atas
          Positioned(
            top: 0,
            left: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: primaryColor,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16),
                  bottomRight: Radius.circular(12),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Text(
                news.newsCategory.name,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 9,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
