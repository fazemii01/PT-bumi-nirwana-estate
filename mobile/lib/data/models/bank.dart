import 'dart:ffi';

class Bank {
  final String id;
  final String name;
  final Double interest_rate;
  final Int max_tenure;
  final String logo;

  Bank(
      {required this.id,
      required this.name,
      required this.interest_rate,
      required this.logo,
      required this.max_tenure});

  factory Bank.fromJson(Map<String, dynamic> json) {
    return Bank(
        id: json['id'],
        name: json['name'],
        interest_rate: json['interest_rate'],
        logo: json['logo'],
        max_tenure: json['max_tenure']);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'interest_rate': interest_rate,
        'logo': logo,
        'max_tenure': max_tenure
      };
}
