import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/models/product.dart';
import '../../../core/widgets/product_card.dart';
import '../../../core/widgets/product_grid_card.dart';
import '../../favorites/favorites_providers.dart';

/// ProductCard + sevimli toggle + detalga o'tish (gorizontal list).
class FavProductCard extends ConsumerWidget {
  const FavProductCard({super.key, required this.product, this.width = 160});
  final Product product;
  final double width;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favs = ref.watch(favoritesProvider);
    return ProductCard(
      product: product,
      width: width,
      isFavorite: favs.contains(product.id),
      onFavorite: () => ref.read(favoritesProvider.notifier).toggle(product.id),
      onTap: () => context.push('/product/${product.id}'),
    );
  }
}

/// ProductGridCard versiyasi (2-ustun grid).
class FavProductGridCard extends ConsumerWidget {
  const FavProductGridCard({super.key, required this.product});
  final Product product;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favs = ref.watch(favoritesProvider);
    return ProductGridCard(
      product: product,
      isFavorite: favs.contains(product.id),
      onFavorite: () => ref.read(favoritesProvider.notifier).toggle(product.id),
      onTap: () => context.push('/product/${product.id}'),
    );
  }
}
