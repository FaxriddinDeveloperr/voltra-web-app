import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/catalog.dart';
import '../../core/models/product.dart';

final bannersProvider = FutureProvider<List<Banner>>((ref) {
  return ref.watch(apiServiceProvider).banners();
});

final hotProductsProvider = FutureProvider<List<Product>>((ref) {
  return ref.watch(apiServiceProvider).hot();
});

final newProductsProvider = FutureProvider<List<Product>>((ref) {
  return ref.watch(apiServiceProvider).newest();
});

final bestSellerProvider = FutureProvider<List<Product>>((ref) {
  return ref.watch(apiServiceProvider).bestSellers();
});

final brandsProvider = FutureProvider<List<Brand>>((ref) {
  return ref.watch(apiServiceProvider).brands();
});
