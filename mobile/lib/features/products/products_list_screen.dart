import 'package:flutter/material.dart';

class ProductsListScreen extends StatelessWidget {
  const ProductsListScreen({super.key, required this.title, this.categoryId, this.brandId, this.filter});

  final String title;
  final String? categoryId;
  final String? brandId;
  final String? filter;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mahsulotlar')),
      body: const Center(child: Text('Mahsulotlar — tez orada')),
    );
  }
}
