import 'dart:convert';
import 'dart:developer';

import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_nirwana/data/models/user_favorite.dart';

class PropertyService extends Api {
  Future<List<Property>> getAllProperty() async {
    try {
      // log('Fetching properties from: $baseUrl/properties');

      final res = await http.get(
        Uri.parse('$baseUrl/properties'),
        headers: {'Content-Type': 'application/json'},
      );

      // log('Status code: ${res.statusCode}');
      // log('Raw body length: ${res.body.length}');
      // log('Raw body snippet: ${res.body.substring(0, 200)}');

      if (res.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(res.body);

        // log('Decoded JSON count: ${jsonData.length}');
        List<Property> properties = jsonData.map((propJson) {
          // log('Mapping property JSON: $propJson');
          return Property.fromJson(propJson);
        }).toList();

        // log('Properties list length: ${properties.length}');
        return properties;
      } else {
        throw Exception(
            'Failed to load properties. Status code : ${res.statusCode}');
      }
    } catch (e, s) {
      log('Error fetching properties: $e', stackTrace: s);
      throw Exception('Error fetching properties $e');
    }
  }

  Future<Property> getPropertiesById(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/properties/$id'),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);

        return Property.fromJson(data);
      } else {
        throw Exception(
            'Gagal memuat detail properti. Status: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Terjadi kesalahan jaringan: $e');
    }
  }

  Future<List<Property>> getPropertiesByType(String type) async {
    try {
      final response = await http.get(
          Uri.parse('$baseUrl/properties/type/$type'),
          headers: {'Content-Type': 'application/json'});

      if (response.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(response.body);

        List<Property> properties =
            jsonData.map((propJson) => Property.fromJson(propJson)).toList();

        return properties;
      } else {
        throw Exception(
            'Failed to load property by type $type. Status code : ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fatching property by type $type');
    }
  }

  Future<String?> createOrRemove(UserFavorite favo) async {
    final url = Uri.parse('$baseUrl/user-favorites');

    final body = jsonEncode({
      'userId': favo.userId,
      'propertyId': favo.propertyId,
    });
    print(body);

    try {
      final res = await http.post(
        url,
        headers: {
          ...getToken(),
          'Content-Type': 'application/json',
        },
        body: body,
      );

      if (res.statusCode == 201 || res.statusCode == 200) {
        return null;
      } else {
        throw Exception(
            'Failed to toggle favorite. Status code: ${jsonDecode(res.body)}');
      }
    } catch (e) {
      throw Exception('Error toggling favorite: $e');
    }
  }
}
