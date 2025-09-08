import 'package:mobile_nirwana/data/models/agent.dart';
import 'package:mobile_nirwana/data/models/developer.dart';
import 'package:mobile_nirwana/data/models/loan-simulation.dart';
import 'package:mobile_nirwana/data/models/property/address.dart';
import 'package:mobile_nirwana/data/models/property/location.dart';
import 'package:mobile_nirwana/data/models/property/property_floor_plan.dart';
import 'package:mobile_nirwana/data/models/property/property_images.dart';
import 'package:mobile_nirwana/data/models/property/specification.dart';

enum PropertyStatus { PRE_LAUNCH, AVAILABLE, SOLD_OUT, RESERVED }

class Property {
  final String id;
  final Developer? developer;
  final Agent? agent;
  final String name;
  final String slug;
  final PropertyStatus status;
  final double price;
  final String price_unit;
  final String type;
  final double? landSize;
  final double? buildingSize;
  final String? description;
  final String? detailDescription;
  final Location? location;
  final Address? address;
  final Specifications? specifications;
  final List<PropertyImages> images;
  final List<PropertyFloorPlan> floorPlans;
  final List<LoanSimulation> loanSimulations;
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
    required this.price_unit,
    required this.type,
    this.landSize,
    this.buildingSize,
    this.description,
    this.detailDescription,
    this.location,
    this.address,
    this.specifications,
    this.images = const [],
    this.floorPlans = const [],
    this.loanSimulations = const [],
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
      price_unit: json['price_unit'],
      type: json['type'],
      landSize: json['land_size'] != null
          ? double.tryParse(json['land_size'].toString())
          : null,
      buildingSize: json['building_size'] != null
          ? double.tryParse(json['building_size'].toString())
          : null,
      description: json['description'],
      detailDescription: json['detail_description'],
      location: Location.fromJson(json['location']),
      address: Address.fromJson(json['address']),
      specifications: Specifications.fromJson(json['specifications']),
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => PropertyImages.fromJson(e))
              .toList() ??
          [],
      floorPlans: (json['floor_plans'] as List<dynamic>?)
              ?.map((e) => PropertyFloorPlan.fromJson(e))
              .toList() ??
          [],
      loanSimulations: (json['loan_simulations'] as List<dynamic>?)
              ?.map((e) => LoanSimulation.fromJson(e))
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
      'price_unit': price_unit,
      'type': type,
      'land_size': landSize,
      'building_size': buildingSize,
      'description': description,
      'detail_description': detailDescription,
      'location': location?.toJson(),
      'address': address?.toJson(),
      'specifications': specifications?.toJson(),
      'images': images.map((e) => e.toJson()).toList(),
      'floor_plans': floorPlans.map((e) => e.toJson()).toList(),
      'loan_simulations': loanSimulations.map((e) => e.toJson()).toList(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
