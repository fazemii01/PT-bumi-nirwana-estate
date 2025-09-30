import 'package:mobile_nirwana/data/models/building_property/building_floor_plan.dart';
import 'package:mobile_nirwana/data/models/building_property/building_images.dart';
import 'package:mobile_nirwana/data/models/building_property/specification.dart';
import 'package:mobile_nirwana/data/models/loan-simulation.dart';
import 'package:mobile_nirwana/data/models/property/property.dart';
import 'dart:convert';

enum BuildingStatus { PRE_LAUNCH, AVAILABLE, SOLD_OUT, RESERVED }

class BuildingProperty {
  final String id;
  final String name;
  final String? totalUnits;
  final BuildingStatus status;
  final double price;
  final String price_unit;
  final double? landSize;
  final double? buildingSize;
  final String? description;
  final Specifications? specifications;
  final List<BuildingImages> images;
  final List<BuildingFloorPlan> floorPlans;
  final List<LoanSimulation> loanSimulations;
  final Property? property;
  final DateTime createdAt;
  final DateTime updatedAt;

  BuildingProperty({
    required this.id,
    required this.name,
    this.totalUnits,
    required this.status,
    required this.price,
    required this.price_unit,
    this.landSize,
    this.buildingSize,
    this.description,
    this.specifications,
    this.images = const [],
    this.floorPlans = const [],
    this.loanSimulations = const [],
    this.property,
    required this.createdAt,
    required this.updatedAt,
  });

  factory BuildingProperty.fromJson(Map<String, dynamic> json) {
    return BuildingProperty(
      id: json['id'],
      name: json['name'],
      totalUnits: json['total_units'], // baru
      status: BuildingStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
        orElse: () => BuildingStatus.AVAILABLE,
      ),
      price: json['price'] != null
          ? double.tryParse(json['price'].toString()) ?? 0.0
          : 0.0,
      price_unit: json['price_unit'] ?? '',
      landSize: json['land_size'] != null
          ? double.tryParse(json['land_size'].toString())
          : null,
      buildingSize: json['building_size'] != null
          ? double.tryParse(json['building_size'].toString())
          : null,
      description: json['description'],
      specifications: (() {
        final specData = json['specifications'];
        if (specData == null) return null;

        if (specData is Map<String, dynamic>) {
          return Specifications.fromJson(specData);
        }

        if (specData is String) {
          try {
            final decodedData = jsonDecode(specData) as Map<String, dynamic>;
            return Specifications.fromJson(decodedData);
          } catch (e) {
            print("Gagal parse string specifications: $e");
            return null;
          }
        }

        return null;
      })(),
      images: (json['images'] as List?)
              ?.where((e) => e != null)
              .map((e) => BuildingImages.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      floorPlans: (json['floor_plans'] as List?)
              ?.where((e) => e != null)
              .map((e) => BuildingFloorPlan.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      loanSimulations: (json['loan_simulations'] as List?)
              ?.where((e) => e != null)
              .map((e) => LoanSimulation.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      property:
          json['property'] != null ? Property.fromJson(json['property']) : null,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}
