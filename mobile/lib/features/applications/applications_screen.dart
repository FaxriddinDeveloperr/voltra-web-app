import 'package:flutter/material.dart';

class ApplicationsScreen extends StatelessWidget {
  const ApplicationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Arizalarim')),
      body: const Center(child: Text('Arizalarim — tez orada')),
    );
  }
}
