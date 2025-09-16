import 'package:mobile_nirwana/data/models/news/news_category.dart';
import 'package:mobile_nirwana/data/models/news/news_images.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';

class News {
  final String id;
  final String title;
  final String slug;
  final String description;
  final NewsCategory newsCategory;
  final Property? property;
  final List<NewsImages> newsImages;

  News({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    required this.newsCategory,
    this.property,
    this.newsImages = const [],
  });

  factory News.fromJson(Map<String, dynamic> json) {
    final List<NewsImages> images = (json['newsImages'] as List<dynamic>?)
            ?.map((imgJson) => NewsImages.fromJson(imgJson))
            .toList() ??
        [];

    return News(
      id: json['id'] as String,
      title: json['title'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      newsCategory: NewsCategory.fromJson(json['newsCategory']),
      property:
          json['property'] != null ? Property.fromJson(json['property']) : null,
      newsImages: images,
    );
  }
}
