import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/news/news.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

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

  Future<News?> getLatestNewsInfo() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/news/latest'));

      if (res.statusCode == 200) {
        return News.fromJson(jsonDecode(res.body));
      } else {
        print(
            'Failed to load latest news info. Status code : ${res.statusCode}');
        return null;
      }
    } catch (e) {
      print('Error fetching latest news info: $e');
      return null;
    }
  }
}
