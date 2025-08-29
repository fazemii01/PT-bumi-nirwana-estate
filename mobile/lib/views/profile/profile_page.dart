import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mobile_nirwana/data/service/auth_service.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final AuthService _authService = AuthService();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Profil')),
      body: Center(
          child: ElevatedButton(
              onPressed: _authService.logout, child: Text('LOGOUT'))),
    );
  }
}
