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
}
