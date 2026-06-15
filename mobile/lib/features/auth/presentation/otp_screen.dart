import 'package:flutter/material.dart';

class OtpScreen extends StatelessWidget {
  const OtpScreen({super.key, required this.phone});

  final String phone;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tasdiqlash')),
      body: const Center(child: Text('Tasdiqlash — tez orada')),
    );
  }
}
