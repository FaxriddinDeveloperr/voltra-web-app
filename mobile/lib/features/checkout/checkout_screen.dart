import 'package:flutter/material.dart';

class CheckoutScreen extends StatelessWidget {
  const CheckoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Buyurtma berish')),
      body: const Center(child: Text('Buyurtma berish — tez orada')),
    );
  }
}
