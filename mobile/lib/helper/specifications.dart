import 'package:flutter/material.dart';
import 'package:mobile_nirwana/data/models/property/specification.dart';

class SpecificationHelper {
  /// Helper untuk menampilkan spesifikasi utama (bed, bath, garage, dll.)
  static List<Widget> buildMainSpecs(Specifications specs) {
    return [
      if (specs.bedrooms != null)
        _buildSpecItem(Icons.bed, "${specs.bedrooms}"),
      if (specs.bathrooms != null)
        _buildSpecItem(Icons.bathtub, "${specs.bathrooms}"),
      if (specs.garage != null)
        _buildSpecItem(Icons.directions_car, "${specs.garage}"),
      if (specs.floors != null)
        _buildSpecItem(Icons.layers, "${specs.floors} Lt"),
    ];
  }

  /// Helper untuk menampilkan detail spesifikasi tambahan
  static List<Map<String, String>> buildDetailSpecs(Specifications specs) {
    return [
      {"label": "Ruang Keluarga", "value": "${specs.familyRoom ?? '-'}"},
      {"label": "Dapur", "value": "${specs.kitchen ?? '-'}"},
      {"label": "Struktur", "value": specs.structure ?? "-"},
      {"label": "Lantai", "value": specs.floor ?? "-"},
      {"label": "Dinding", "value": specs.walls ?? "-"},
      {"label": "Atap", "value": specs.roof ?? "-"},
      {"label": "Pintu", "value": specs.doors ?? "-"},
      {"label": "Jendela", "value": specs.windows ?? "-"},
      {"label": "Listrik", "value": specs.electricity ?? "-"},
      {"label": "Sumber Air", "value": specs.waterSource ?? "-"},
      {"label": "Internet", "value": specs.internet ?? "-"},
      {"label": "Keamanan", "value": specs.security ?? "-"},
      {"label": "Fasilitas", "value": specs.facilities ?? "-"},
    ];
  }

  /// Widget kecil untuk icon + text
  static Widget _buildSpecItem(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: Colors.grey[600]),
        SizedBox(width: 2),
        Text(
          text,
          style: TextStyle(fontSize: 12, color: Colors.grey[600]),
        ),
        SizedBox(width: 8),
      ],
    );
  }
}
