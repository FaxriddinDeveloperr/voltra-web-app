import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/product.dart';
import '../auth/auth_providers.dart';

/// Sevimli mahsulot ID'lari to'plami (heart toggle uchun).
class FavoritesNotifier extends StateNotifier<Set<String>> {
  FavoritesNotifier(this._ref) : super({});
  final Ref _ref;

  bool get _authed =>
      _ref.read(authProvider).status == AuthStatus.authenticated ||
      _ref.read(authProvider).status == AuthStatus.needsProfile;

  Future<void> load() async {
    if (!_authed) return;
    try {
      final list = await _ref.read(apiServiceProvider).favorites();
      state = list.map((p) => p.id).toSet();
    } catch (_) {/* ignore */}
  }

  bool isFavorite(String id) => state.contains(id);

  Future<void> toggle(String productId) async {
    final api = _ref.read(apiServiceProvider);
    if (state.contains(productId)) {
      state = {...state}..remove(productId);
      await api.removeFavorite(productId);
    } else {
      state = {...state, productId};
      await api.addFavorite(productId);
    }
  }
}

final favoritesProvider =
    StateNotifierProvider<FavoritesNotifier, Set<String>>(
  (ref) => FavoritesNotifier(ref),
);

/// To'liq sevimli mahsulotlar ro'yxati (Sevimlilar ekrani uchun).
final favoriteProductsProvider = FutureProvider<List<Product>>((ref) {
  ref.watch(favoritesProvider); // o'zgarsa qayta yuklash
  return ref.watch(apiServiceProvider).favorites();
});
