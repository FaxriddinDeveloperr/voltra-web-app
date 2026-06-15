import 'package:flutter/material.dart';

class ContentScreen extends StatelessWidget {
  const ContentScreen({super.key, required this.contentKey});

  final String contentKey;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Ma'lumot")),
      body: const Center(child: Text("Ma'lumot — tez orada")),
    );
  }
}
