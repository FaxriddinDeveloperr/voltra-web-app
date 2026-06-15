import 'package:flutter/material.dart';
import '../../../core/models/product.dart';
import '../../../core/theme/app_spacing.dart';
import 'fav_product_card.dart';

/// Qayta ishlatiluvchi 2-ustun mahsulot grid.
class ProductGrid extends StatelessWidget {
  const ProductGrid({
    super.key,
    required this.products,
    this.padding,
    this.controller,
  });
  final List<Product> products;
  final EdgeInsets? padding;
  final ScrollController? controller;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      controller: controller,
      padding: padding ?? const EdgeInsets.all(AppSpacing.screen),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 14,
        crossAxisSpacing: 12,
        childAspectRatio: 0.60,
      ),
      itemCount: products.length,
      itemBuilder: (_, i) => FavProductGridCard(product: products[i]),
    );
  }
}
