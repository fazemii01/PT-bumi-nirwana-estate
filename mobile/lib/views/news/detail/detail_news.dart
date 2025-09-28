import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_nirwana/core/routes/app_routes.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/helper/address.dart';
import 'package:mobile_nirwana/helper/price.dart';
import 'package:mobile_nirwana/views/news/detail/detail_news_controller.dart';
import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:get/get.dart';

class NewsDetailPage extends StatefulWidget {
  final News news;
  const NewsDetailPage({super.key, required this.news});

  @override
  State<NewsDetailPage> createState() => _NewsDetailPageState();
}

class _NewsDetailPageState extends State<NewsDetailPage> {
  final NewsDetailController _newsDetailController =
      Get.put(NewsDetailController());
  final PageController _pageController = PageController();
  int _currentImageIndex = 0;
  double _textSize = 16.0;
  final double _minTextSize = 14.0;
  final double _maxTextSize = 20.0;

  @override
  void initState() {
    super.initState();
    _newsDetailController.news.value = widget.news;
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _increaseTextSize() {
    if (_textSize < _maxTextSize) {
      setState(() {
        _textSize += 2.0;
      });
    }
  }

  void _decreaseTextSize() {
    if (_textSize > _minTextSize) {
      setState(() {
        _textSize -= 2.0;
      });
    }
  }

  void _jumpToImage(int index) {
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Obx(() {
        if (_newsDetailController.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }
        if (_newsDetailController.errorMessage.value.isNotEmpty) {
          return Center(
              child:
                  Text('Error: ${_newsDetailController.errorMessage.value}'));
        }
        final news = _newsDetailController.news.value;
        if (news == null) {
          return const Center(child: Text('Berita tidak ditemukan.'));
        }
        return _buildNewsScaffold(news);
      }),
    );
  }

  Widget _buildNewsScaffold(News news) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.text_decrease, color: Colors.black87),
            onPressed: _decreaseTextSize,
          ),
          IconButton(
            icon: const Icon(Icons.text_increase, color: Colors.black87),
            onPressed: _increaseTextSize,
          ),
        ],
      ),
      body: SafeArea(
        top: false,
        bottom: true,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero Image Carousel
              _buildImageCarousel(news),

              // Image Thumbnails
              if (news.newsImages.length > 1) _buildImageThumbnails(news),

              // Newws Content
              _buildNewsContent(news),

              if (news.property != null) _buildPropertyCard(news),

              // Recommended Newws
              // if (widget.recommendedNews.isNotEmpty) _buildRecommendedNews(),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildImageCarousel(News news) {
    if (news.newsImages.isEmpty) {
      return Container(
        height: 250,
        color: Colors.grey[300],
        child:
            Icon(Icons.image_not_supported, color: Colors.grey[600], size: 64),
      );
    }
    return SizedBox(
      height: 250,
      child: PageView.builder(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() {
            _currentImageIndex = index;
          });
        },
        itemCount: news.newsImages.length,
        itemBuilder: (context, index) {
          final String filename = news.newsImages[index].imgUrl;
          final String fullUrl = Imgurl.get('news/news_images/$filename');
          return Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(fullUrl),
                fit: BoxFit.cover,
              ),
            ),
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.3),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildImageThumbnails(News news) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        children: [
          // Dots Indicator (tidak ada perubahan)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              news.newsImages.length,
              (index) => Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _currentImageIndex == index
                      ? const Color(0xFFDBB837)
                      : Colors.grey.shade300,
                ),
              ),
            ),
          ),

          const SizedBox(height: 12),

          // Thumbnail Row (struktur tetap, hanya pemanggilan gambar diubah)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: List.generate(
                news.newsImages.length,
                (index) {
                  // Ubah menjadi blok body agar bisa deklarasi variabel

                  // FIX: Logika pembuatan URL lengkap diletakkan di dalam sini
                  final String filename = news.newsImages[index].imgUrl;
                  final String fullUrl =
                      Imgurl.get('news/news_images/$filename');

                  return GestureDetector(
                    onTap: () => _jumpToImage(index),
                    child: Container(
                      margin: const EdgeInsets.only(right: 8),
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: _currentImageIndex == index
                              ? const Color(0xFFDBB837)
                              : Colors.grey.shade300,
                          width: 2,
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: Image.network(
                          fullUrl, // <-- Gunakan URL yang sudah benar
                          fit: BoxFit.cover,
                          // (Opsional) Tambahkan error/loading builder agar lebih baik
                          errorBuilder: (context, error, stackTrace) =>
                              Container(color: Colors.grey.shade200),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNewsContent(News news) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Category Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFDBB837).withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: const Color(0xFFDBB837).withOpacity(0.3),
              ),
            ),
            child: Text(
              news.newsCategory.name,
              style: const TextStyle(
                color: Color(0xFFDBB837),
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Title
          Text(
            news.title,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            DateFormat('d MMMM yyyy').format(news.createdAt),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.black54,
            ),
          ),

          const SizedBox(height: 16),

          // Description with adjustable text size
          AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 200),
            style: TextStyle(
              fontSize: _textSize,
              color: Colors.black54,
              height: 1.6,
              letterSpacing: 0.3,
            ),
            child: Text(news.description),
          ),
        ],
      ),
    );
  }

  Widget _buildPropertyCard(News news) {
    final property = news.property!;

    String getPropertyImage(Property property) {
      if (property.images.isNotEmpty &&
          property.images.first.image_url != null) {
        return property.images.first.image_url!;
      }
      return '';
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.shade200,
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.home_work,
                  color: const Color(0xFFDBB837),
                  size: 20,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Properti Terkait',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            InkWell(
              onTap: () {
                Get.toNamed(
                  Routes.DETAIL_PROPERTIES,
                  arguments: property,
                );
              },
              borderRadius:
                  BorderRadius.circular(12), // Efek klik mengikuti bentuk kartu
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade200),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.shade200,
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    // Property Image
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        Imgurl.get(
                            'property/property_images/${getPropertyImage(property)}'),
                        width: 80,
                        height: 80,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          width: 80,
                          height: 80,
                          color: Colors.grey.shade200,
                          child: Icon(Icons.home_work_outlined,
                              color: Colors.grey.shade400),
                        ),
                      ),
                    ),

                    const SizedBox(width: 12),

                    // Property Details
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            property.name,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(
                                Icons.location_on,
                                size: 14,
                                color: Colors.grey.shade600,
                              ),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  AreaHelper.formatSingleLine(property.address),
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey.shade600,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          // Text(
                          //   formatPrice(property.price),
                          //   style: const TextStyle(
                          //     fontSize: 16,
                          //     fontWeight: FontWeight.bold,
                          //     color: Color(0xFFDBB837),
                          //   ),
                          // ),
                        ],
                      ),
                    ),

                    // Arrow Icon
                    Icon(
                      Icons.arrow_forward_ios,
                      size: 16,
                      color: Colors.grey.shade400,
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
