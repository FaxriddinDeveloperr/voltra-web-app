import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/cart.dart';
import '../auth/auth_providers.dart';

class CartNotifier extends StateNotifier<Cart> {
  CartNotifier(this._ref) : super(Cart.empty());
  final Ref _ref;

  bool get _authed =>
      _ref.read(authProvider).status == AuthStatus.authenticated ||
      _ref.read(authProvider).status == AuthStatus.needsProfile;

  Future<void> load() async {
    if (!_authed) return;
    try {
      state = await _ref.read(apiServiceProvider).getCart();
    } catch (_) {/* ignore */}
  }

  Future<void> add(String productId, {int quantity = 1}) async {
    state = await _ref.read(apiServiceProvider).addToCart(productId, quantity);
  }

  Future<void> updateQty(String itemId, int quantity) async {
    state = await _ref.read(apiServiceProvider).updateCartItem(itemId, quantity);
  }

  Future<void> remove(String itemId) async {
    state = await _ref.read(apiServiceProvider).removeCartItem(itemId);
  }

  void clearLocal() => state = Cart.empty();
}

final cartProvider =
    StateNotifierProvider<CartNotifier, Cart>((ref) => CartNotifier(ref));

final cartCountProvider = Provider<int>((ref) => ref.watch(cartProvider).count);
