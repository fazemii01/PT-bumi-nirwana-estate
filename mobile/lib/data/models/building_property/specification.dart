import 'dart:convert';

class Specifications {
  // Dimensi
  final int? bedrooms;
  final int? bathrooms;
  final int? familyRoom;
  final int? kitchen;
  final int? garage;
  final int? floors;

  // Material
  final String? structure;
  final String? floor;
  final String? walls;
  final String? roof;
  final String? doors;
  final String? windows;

  // Utilitas
  final String? electricity;
  final String? waterSource;
  final String? internet;
  final String? security;

  // Fasilitas
  final String? facilities;

  Specifications({
    this.bedrooms,
    this.bathrooms,
    this.familyRoom,
    this.kitchen,
    this.garage,
    this.floors,
    this.structure,
    this.floor,
    this.walls,
    this.roof,
    this.doors,
    this.windows,
    this.electricity,
    this.waterSource,
    this.internet,
    this.security,
    this.facilities,
  });

  factory Specifications.fromJson(dynamic json) {
    if (json == null) return Specifications();
    if (json is String) json = jsonDecode(json);

    return Specifications(
      bedrooms: json['bedrooms'],
      bathrooms: json['bathrooms'],
      familyRoom: json['family_room'],
      kitchen: json['kitchen'],
      garage: json['garage'],
      floors: json['floors'],
      structure: json['structure'],
      floor: json['floor'],
      walls: json['walls'],
      roof: json['roof'],
      doors: json['doors'],
      windows: json['windows'],
      electricity: json['electricity'],
      waterSource: json['water_source'],
      internet: json['internet'],
      security: json['security'],
      facilities: json['facilities'],
    );
  }

  Map<String, dynamic> toJson() => {
        'bedrooms': bedrooms,
        'bathrooms': bathrooms,
        'family_room': familyRoom,
        'kitchen': kitchen,
        'garage': garage,
        'floors': floors,
        'structure': structure,
        'floor': floor,
        'walls': walls,
        'roof': roof,
        'doors': doors,
        'windows': windows,
        'electricity': electricity,
        'water_source': waterSource,
        'internet': internet,
        'security': security,
        'facilities': facilities,
      };
}
