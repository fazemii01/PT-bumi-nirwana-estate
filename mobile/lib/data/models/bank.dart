class Bank {
  final String id;
  final String name;
  final double interest_rate;
  final int min_tenure;
  final int max_tenure;
  final String logo;

  Bank(
      {required this.id,
      required this.name,
      required this.interest_rate,
      required this.logo,
      required this.min_tenure,
      required this.max_tenure});

  factory Bank.fromJson(Map<String, dynamic> json) {
    return Bank(
        id: json['id'],
        name: json['name'],
        interest_rate: json['interest_rate'] != null
            ? double.tryParse(json['interest_rate'].toString()) ?? 0.0
            : 0.0,
        logo: json['logo'],
        min_tenure: json['min_tenure'],
        max_tenure: json['max_tenure']);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'interest_rate': interest_rate,
        'logo': logo,
        'min_tenure': min_tenure,
        'max_tenure': max_tenure
      };
}
