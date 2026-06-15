import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/widgets/empty_state.dart';
import '../../core/widgets/skeleton_loader.dart';
import 'products_providers.dart';
import 'widgets/product_grid.dart';

/// Spec 2.3 — Mahsulotlar ro'yxati (kategoriya/brend/filter grid).
class ProductsListScreen extends ConsumerWidget {
  const ProductsListScreen({
    super.key,
    required this.title,
    this.categoryId,
    this.brandId,
    this.filter,
  });

  final String title;
  final String? categoryId;
  final String? brandId;
  final String? filter;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final query = ProductsQuery(
      categoryId: categoryId,
      brandId: brandId,
      filter: filter,
    );
    final async = ref.watch(productsListProvider(query));

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: async.when(
        loading: () => const GridSkeleton(),
        error: (_, __) => Center(
          child: TextButton(
            onPressed: () => ref.invalidate(productsListProvider(query)),
            child: const Text('Qayta urinish'),
          ),
        ),
        data: (products) {
          if (products.isEmpty) {
            return const EmptyState(
              icon: Icons.inventory_2_outlined,
              title: 'Mahsulot topilmadi',
            );
          }
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(productsListProvider(query));
              await ref.read(productsListProvider(query).future);
            },
            child: ProductGrid(products: products),
          );
        },
      ),
    );
  }
}
