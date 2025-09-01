import 'dart:convert';

class Address {
  final String? street;
  final String? village;
  final String? district;
  final String? city;
  final String? province;
  final String? postalCode;

  Address({
    this.street,
    this.village,
    this.district,
    this.city,
    this.province,
    this.postalCode,
  });

  factory Address.fromJson(dynamic json) {
    if (json == null) return Address();
    if (json is String) json = jsonDecode(json);

    return Address(
      street: json['street'],
      village: json['village'],
      district: json['district'],
      city: json['city'],
      province: json['province'],
      postalCode: json['postal_code'],
    );
  }

  Map<String, dynamic> toJson() => {
        'street': street,
        'village': village,
        'district': district,
        'city': city,
        'province': province,
        'postal_code': postalCode,
      };
}
