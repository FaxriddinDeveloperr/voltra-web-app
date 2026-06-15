import 'package:flutter/material.dart';

class PartnershipFormScreen extends StatelessWidget {
  const PartnershipFormScreen({super.key, required this.type});

  final String type;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hamkorlik')),
      body: const Center(child: Text('Hamkorlik — tez orada')),
    );
  }
}
