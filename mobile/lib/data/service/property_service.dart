import 'dart:convert';

import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:http/http.dart' as http;

class PropertyService extends Api {
  Future<List<Property>> getAllProperty() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/properties'),
          headers: {'Content-Type': 'application/json'});

      if (res.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(res.body);
        List<Property> properties =
            jsonData.map((propJson) => Property.fromJson(propJson)).toList();
        return properties;
      } else {
        throw Exception(
            'Failed to load properties. Status code : ${res.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching properties $e');
    }
  }
}
