class User {
  final String id;
  final String full_name;
  final String email;
  final String? phone_number;
  final String role;
  final String? password_hash;

  User(
      {required this.id,
      required this.full_name,
      required this.email,
      this.phone_number,
      required this.role,
      this.password_hash});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
        id: json['id'],
        full_name: json['full_name'],
        email: json['email'],
        role: json['role'],
        password_hash: json['password_hash']);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'full_name': full_name,
        'email': email,
        'role': role,
        'password_hash': password_hash
      };
}
