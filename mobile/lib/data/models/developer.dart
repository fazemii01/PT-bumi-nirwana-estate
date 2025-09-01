import 'dart:io';

class Developer {
  final String id;
  final String name;
  final String? website_url;
  final String? logo_url;
  final File? logo_file;

  Developer(
      {required this.id,
      required this.name,
      this.website_url,
      this.logo_url,
      this.logo_file});

  factory Developer.fromJson(Map<String, dynamic> json) {
    return Developer(
        id: json['id'],
        name: json['name'],
        website_url: json['website_url'],
        logo_url: json['logo_url']);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'website_url': website_url,
        'logo_url': logo_url
      };
}
