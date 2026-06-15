import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/product.dart';

/// Mahsulotlar ro'yxati filtri.
class ProductsQuery {
  const ProductsQuery({this.categoryId, this.brandId, this.filter});
  final String? categoryId;
  final String? brandId;
  final String? filter; // hot | new | best

  @override
  bool operator ==(Object other) =>
      other is ProductsQuery &&
      other.categoryId == categoryId &&
      other.brandId == brandId &&
      other.filter == filter;

  @override
  int get hashCode => Object.hash(categoryId, brandId, filter);
}

final productsListProvider =
    FutureProvider.family<List<Product>, ProductsQuery>((ref, q) {
  final api = ref.watch(apiServiceProvider);
  switch (q.filter) {
    case 'hot':
      return api.hot();
    case 'new':
      return api.newest();
    case 'best':
      return api.bestSellers();
    default:
      return api
          .products(category: q.categoryId, brand: q.brandId, limit: 50)
          .then((p) => p.items);
  }
});

final productDetailProvider =
    FutureProvider.family<Product, String>((ref, id) {
  return ref.watch(apiServiceProvider).product(id);
});
