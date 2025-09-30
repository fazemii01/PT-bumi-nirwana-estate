import 'dart:convert';

import 'package:mobile_nirwana/core/utils/api.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:http/http.dart' as http;

class BuildingPropertyService extends Api {
  Future<List<BuildingProperty>> getAllBuildings() async {
    final res = await http.get(
      Uri.parse('$baseUrl/building-property'),
      headers: {'Content-Type': 'application/json'},
    );

    if (res.statusCode == 200) {
      final List<dynamic> jsonData = jsonDecode(res.body);
      List<BuildingProperty> buildings =
          jsonData.map((bJson) => BuildingProperty.fromJson(bJson)).toList();
      return buildings;
    } else {
      throw Exception('Failed to load buildings: ${res.statusCode}');
    }
  }

  Future<BuildingProperty> getBuildingPropertiesById(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/building-property/$id'),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);

        return BuildingProperty.fromJson(data);
      } else {
        throw Exception(
            'Gagal memuat detail building. Status: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Terjadi kesalahan jaringan: $e');
    }
  }

  Future<List<BuildingProperty>> getBuildingsByProperty(
      String propertyId) async {
    try {
      final res = await http.get(
        Uri.parse('$baseUrl/building-property/property/${propertyId}'),
        headers: {'Content-Type': 'application/json'},
      );

      if (res.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(res.body);
        List<BuildingProperty> buildings =
            jsonData.map((bJson) => BuildingProperty.fromJson(bJson)).toList();
        return buildings;
      } else {
        throw Exception('Failed to load buildings: ${res.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching buildings: $e');
    }
  }
}
