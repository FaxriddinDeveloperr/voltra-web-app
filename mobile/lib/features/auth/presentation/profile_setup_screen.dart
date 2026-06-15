import 'package:flutter/material.dart';

class ProfileSetupScreen extends StatelessWidget {
  const ProfileSetupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profil to'ldirish")),
      body: const Center(child: Text("Profil to'ldirish — tez orada")),
    );
  }
}
