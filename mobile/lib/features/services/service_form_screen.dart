import 'package:flutter/material.dart';

class ServiceFormScreen extends StatelessWidget {
  const ServiceFormScreen({super.key, required this.serviceId, required this.serviceName, required this.hasPowerField});

  final String serviceId;
  final String serviceName;
  final bool hasPowerField;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ariza')),
      body: const Center(child: Text('Ariza — tez orada')),
    );
  }
}
