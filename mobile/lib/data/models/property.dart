import 'dart:convert';

import 'package:mobile_nirwana/data/models/agent.dart';
import 'package:mobile_nirwana/data/models/developer.dart';
import 'package:mobile_nirwana/data/models/location.dart';

enum PropertyStatus { PRE_LAUNCH, AVAILABLE, SOLD_OUT, RESERVED }

enum PriceUnit { TOTAL, PER_MONTH, PER_SQM }

enum PropertyType { HOUSE, APARTMENT, RUKO, KAVLING }

class Property {
  final String id;
  final Developer? developer;
  final Agent? agent;
  final String name;
  final String slug;
  final PropertyStatus status;
  final double price;
  final PriceUnit priceUnit;
  final PropertyType type;
  final double? landSize;
  final double? buildingSize;
  final String? description;
  final String? detailDescription;
  final Location location;
  final Map<String, dynamic>? address;
  final Map<String, dynamic>? specifications;
  final List<PropertyImage> images;
  final List<PropertyFloorPlan> floorPlans;
  // final List<LoanSimulation> loanSimulations;
  final DateTime createdAt;
  final DateTime updatedAt;

  Property({
    required this.id,
    this.developer,
    this.agent,
    required this.name,
    required this.slug,
    required this.status,
    required this.price,
    required this.priceUnit,
    required this.type,
    this.landSize,
    this.buildingSize,
    this.description,
    this.detailDescription,
    required this.location,
    this.address,
    this.specifications,
    this.images = const [],
    this.floorPlans = const [],
    // this.loanSimulations = const [],
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
      slug: json['slug'],
      status: PropertyStatus.values
          .firstWhere((e) => e.toString().split('.').last == json['status']),
      price: json['price'] != null
          ? double.tryParse(json['price'].toString()) ?? 0.0
          : 0.0,
      priceUnit: PriceUnit.values.firstWhere(
          (e) => e.toString().split('.').last == json['price_unit']),
      type: PropertyType.values
          .firstWhere((e) => e.toString().split('.').last == json['type']),
      landSize: json['land_size'] != null
          ? double.tryParse(json['land_size'].toString())
          : null,
      buildingSize: json['building_size'] != null
          ? double.tryParse(json['building_size'].toString())
          : null,
      description: json['description'],
      detailDescription: json['detail_description'],
      location: Location.fromJson(json['location']),
      address: json['address'] != null
          ? (json['address'] is String
              ? Map<String, dynamic>.from(
                  jsonDecode(json['address']),
                )
              : json['address'])
          : null,
      specifications: json['specifications'] != null
          ? (json['specifications'] is String
              ? Map<String, dynamic>.from(
                  jsonDecode(json['specifications']),
                )
              : json['specifications'])
          : null,
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => PropertyImage.fromJson(e))
              .toList() ??
          [],
      floorPlans: (json['floor_plans'] as List<dynamic>?)
              ?.map((e) => PropertyFloorPlan.fromJson(e))
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
      'slug': slug,
      'status': status.toString().split('.').last,
      'price': price,
      'price_unit': priceUnit.toString().split('.').last,
      'type': type.toString().split('.').last,
      'land_size': landSize,
      'building_size': buildingSize,
      'description': description,
      'detail_description': detailDescription,
      'location': location.toJson(),
      'address': address,
      'specifications': specifications,
      'images': images.map((e) => e.toJson()).toList(),
      'floor_plans': floorPlans.map((e) => e.toJson()).toList(),
      // 'loan_simulations': loanSimulations.map((e) => e.toJson()).toList(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

class PropertyImage {
  final String id;
  final String? caption;
  final String? image_url;

  PropertyImage({required this.id, this.caption, this.image_url});

  factory PropertyImage.fromJson(Map<String, dynamic> json) {
    return PropertyImage(
        id: json['id'], caption: json['caption'], image_url: json['image_url']);
  }

  Map<String, dynamic> toJson() =>
      {'id': id, 'caption': caption, 'image_url': image_url};
}

class PropertyFloorPlan {
  final String id;
  final String name;
  final String file_url;

  PropertyFloorPlan(
      {required this.id, required this.name, required this.file_url});

  factory PropertyFloorPlan.fromJson(Map<String, dynamic> json) {
    return PropertyFloorPlan(
        id: json['id'], name: json['name'], file_url: json['file_url']);
  }

  Map<String, dynamic> toJson() =>
      {'id': id, 'name': name, 'file_url': file_url};
}
