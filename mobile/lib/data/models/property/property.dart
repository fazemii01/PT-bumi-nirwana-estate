import 'package:mobile_nirwana/data/models/agent.dart';
import 'package:mobile_nirwana/data/models/building_property/building_property.dart';
import 'package:mobile_nirwana/data/models/developer.dart';
import 'package:mobile_nirwana/data/models/property/address.dart';
import 'package:mobile_nirwana/data/models/property/location.dart';
import 'package:mobile_nirwana/data/models/property/property_site_plan.dart';
import 'package:mobile_nirwana/data/models/property/property_images.dart';

class Property {
  final String id;
  final Developer? developer;
  final Agent? agent;
  final String name;
  final String type;
  final String? description;
  final String? detailDescription;
  final Location? location;
  final Address? address;
  final int? favoritesCount;
  final List<PropertyImages> images;
  final List<PropertySitePlan> sitePlans;
  final List<BuildingProperty> building_property;
  final DateTime createdAt;
  final DateTime updatedAt;

  Property({
    required this.id,
    this.developer,
    this.agent,
    required this.name,
    required this.type,
    this.description,
    this.detailDescription,
    this.location,
    this.address,
    this.favoritesCount,
    this.images = const [],
    this.sitePlans = const [],
    this.building_property = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id'],
      developer: json['developer'] != null
          ? Developer.fromJson(json['developer'])
          : null,
      agent: json['agent'] != null ? Agent.fromJson(json['agent']) : null,
      name: json['name'],
      type: json['type'],
      description: json['description'],
      detailDescription: json['detail_description'],
      location: Location.fromJson(json['location']),
      address: Address.fromJson(json['address']),
      favoritesCount: json['favoritesCount'] != null
          ? int.tryParse(json['favoritesCount'].toString()) ?? 0
          : 0,
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => PropertyImages.fromJson(e))
              .toList() ??
          [],
      sitePlans: (json['site_plans'] as List<dynamic>?)
              ?.map((e) => PropertySitePlan.fromJson(e))
              .toList() ??
          [],
      building_property: (json['building_property'] as List<dynamic>?)
              ?.map((e) => BuildingProperty.fromJson(e))
              .toList() ??
          [],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'developer': developer?.toJson(),
      'agent': agent?.toJson(),
      'name': name,
      'type': type,
      'description': description,
      'detail_description': detailDescription,
      'location': location?.toJson(),
      'address': address?.toJson(),
      'images': images.map((e) => e.toJson()).toList(),
      'site_plans': sitePlans.map((e) => e.toJson()).toList(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
