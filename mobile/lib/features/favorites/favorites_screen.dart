import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/widgets/empty_state.dart';
import '../../core/widgets/skeleton_loader.dart';
import '../products/widgets/product_grid.dart';
import 'favorites_providers.dart';

/// Spec 2.2/2.7 — Sevimlilar ekrani.
class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(favoriteProductsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Sevimlilar')),
      body: async.when(
        loading: () => const GridSkeleton(),
        error: (_, __) => Center(
          child: TextButton(
            onPressed: () => ref.invalidate(favoriteProductsProvider),
            child: const Text('Qayta urinish'),
          ),
        ),
        data: (products) {
          if (products.isEmpty) {
            return EmptyState(
              icon: Icons.favorite_border,
              title: 'Sevimlilar bo\'sh',
              subtitle: 'Yoqqan mahsulotlarni yurakcha bilan belgilang',
              actionLabel: 'Mahsulotlar',
              onAction: () => context.go('/home'),
            );
          }
          return RefreshIndicator(
            onRefresh: () async {
              await ref.read(favoritesProvider.notifier).load();
              ref.invalidate(favoriteProductsProvider);
              await ref.read(favoriteProductsProvider.future);
            },
            child: ProductGrid(products: products),
          );
        },
      ),
    );
  }
}
