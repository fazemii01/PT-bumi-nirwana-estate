import 'package:mobile_nirwana/data/models/property/property.dart';
import 'package:mobile_nirwana/data/models/user.dart';

class UserFavorite {
  final String userId;
  final String propertyId;
  final DateTime? createdAt;

  final User? user;
  final Property? property;

  UserFavorite(
      {required this.userId,
      required this.propertyId,
      this.createdAt,
      this.property,
      this.user});

  factory UserFavorite.fromJson(Map<String, dynamic> json) {
    return UserFavorite(
      userId: json['userId'],
      propertyId: json['propertyId'],
      user: json['user'] != null ? User.fromJson(json['user']) : null,
      property:
          json['property'] != null ? Property.fromJson(json['property']) : null,
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
