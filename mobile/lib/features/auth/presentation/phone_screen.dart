import 'package:flutter/material.dart';

class PhoneScreen extends StatelessWidget {
  const PhoneScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Telefon')),
      body: const Center(child: Text('Telefon — tez orada')),
    );
  }
}
