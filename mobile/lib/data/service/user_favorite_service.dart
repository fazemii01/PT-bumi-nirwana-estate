import 'dart:convert';

import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/user_favorite.dart';
import 'package:http/http.dart' as http;

class UserFavoriteService extends Api {
  Future<List<UserFavorite>> getUserFavorities(String userId) async {
    print("Fetching favorites for userId: $userId");
    final response = await http
        .get(Uri.parse('$baseUrl/user-favorites/$userId'), headers: getToken());

    if (response.statusCode == 200 || response.statusCode == 201) {
      final List<dynamic> data = jsonDecode(response.body);
      List<UserFavorite> userFavorites =
          data.map((item) => UserFavorite.fromJson(item)).toList();

      return userFavorites;
    } else {
      throw Exception('Failed to load user favorites');
    }
  }
}
