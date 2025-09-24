import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:mobile_nirwana/data/models/news/news_category.dart';

class NewsService extends Api {
  Future<List<News>> getAllNews() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/news'));

      if (res.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(res.body);
        List<News> news =
            jsonData.map((newsjson) => News.fromJson(newsjson)).toList();

        return news;
      } else {
        throw Exception('Failed to load news. Status code : ${res.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching properties $e');
    }
  }

  Future<News> getNewsById(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/news/$id'),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);

        return News.fromJson(data);
      } else {
        throw Exception(
            'Gagal memuat detail berita. Status: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Terjadi kesalahan jaringan: $e');
    }
  }

  Future<List<NewsCategory>> getAllNewsCategories() async {
    try {
      final uri = Uri.parse('$baseUrl/news-category');
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => NewsCategory.fromJson(json)).toList();
      } else {
        throw Exception('Gagal memuat kategori berita');
      }
    } catch (e) {
      print('Error di getAllNewsCategories: $e');
      throw Exception('Terjadi kesalahan: $e');
    }
  }

  Future<List<News>> getNewsByCategory(String categoryName) async {
    try {
      final String encodedCategory = Uri.encodeComponent(categoryName);
      final uri = Uri.parse('$baseUrl/news/category/$encodedCategory');
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => News.fromJson(json)).toList();
      } else {
        throw Exception('Gagal memuat berita berdasarkan kategori');
      }
    } catch (e) {
      print('Error di getNewsByCategory: $e');
      throw Exception('Terjadi kesalahan: $e');
    }
  }
}
