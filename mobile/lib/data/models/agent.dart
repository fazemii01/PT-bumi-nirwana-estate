import 'dart:io';

class Agent {
  final String id;
  final String full_name;
  final String email;
  final String phone_number;
  final String? avatar_url;
  final File? avatar_file;

  Agent(
      {required this.id,
      required this.full_name,
      required this.email,
      required this.phone_number,
      this.avatar_url,
      this.avatar_file});

  factory Agent.fromJson(Map<String, dynamic> json) {
    return Agent(
        id: json['id'],
        full_name: json['full_name'],
        email: json['email'],
        phone_number: json['phone_number'],
        avatar_url: json['avatar_url']);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'full_name': full_name,
        'email': email,
        'phone_number': phone_number,
        'avatar_url': avatar_url
      };
}
