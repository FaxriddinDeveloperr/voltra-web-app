import 'package:dio/dio.dart';
import '../models/cart.dart';
import '../models/catalog.dart';
import '../models/order.dart';
import '../models/product.dart';
import '../models/user.dart';
import 'api_endpoints.dart';

/// Barcha REST chaqiriqlar uchun yagona service (spec 5).
class ApiService {
  ApiService(this._dio);
  final Dio _dio;

  // ── Auth ──────────────────────────────────────────────
  Future<Map<String, dynamic>> sendOtp(String phone) async {
    final r = await _dio.post(ApiEndpoints.sendOtp, data: {'phone': phone});
    return r.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> verifyOtp(String phone, String code) async {
    final r = await _dio.post(ApiEndpoints.verifyOtp,
        data: {'phone': phone, 'code': code});
    return r.data as Map<String, dynamic>;
  }

  Future<void> logout() => _dio.post(ApiEndpoints.logout);

  // ── Profil ────────────────────────────────────────────
  Future<AppUser> getMe() async {
    final r = await _dio.get(ApiEndpoints.me);
    return AppUser.fromJson(r.data as Map<String, dynamic>);
  }

  Future<AppUser> updateMe(Map<String, dynamic> data) async {
    final r = await _dio.patch(ApiEndpoints.me, data: data);
    return AppUser.fromJson(r.data as Map<String, dynamic>);
  }

  Future<void> deleteMe() => _dio.delete(ApiEndpoints.me);

  // ── Katalog ───────────────────────────────────────────
  Future<List<Category>> categories() async {
    final r = await _dio.get(ApiEndpoints.categories);
    return (r.data as List)
        .map((e) => Category.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<Brand>> brands() async {
    final r = await _dio.get(ApiEndpoints.brands);
    return (r.data as List)
        .map((e) => Brand.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<Banner>> banners() async {
    final r = await _dio.get(ApiEndpoints.banners);
    return (r.data as List)
        .map((e) => Banner.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Paginated<Product>> products({
    String? category,
    String? brand,
    String? search,
    int page = 1,
    int limit = 20,
  }) async {
    final r = await _dio.get(ApiEndpoints.products, queryParameters: {
      if (category != null) 'category': category,
      if (brand != null) 'brand': brand,
      if (search != null && search.isNotEmpty) 'search': search,
      'page': page,
      'limit': limit,
    });
    return _paginated(r.data);
  }

  Future<List<Product>> _simpleList(String path) async {
    final r = await _dio.get(path);
    return _paginated(r.data).items;
  }

  Future<List<Product>> hot() => _simpleList(ApiEndpoints.productsHot);
  Future<List<Product>> newest() => _simpleList(ApiEndpoints.productsNew);
  Future<List<Product>> bestSellers() => _simpleList(ApiEndpoints.productsBest);

  Future<List<Product>> search(String q) async {
    final r = await _dio
        .get(ApiEndpoints.productsSearch, queryParameters: {'q': q});
    return _paginated(r.data).items;
  }

  Future<Product> product(String id) async {
    final r = await _dio.get(ApiEndpoints.product(id));
    return Product.fromJson(r.data as Map<String, dynamic>);
  }

  Paginated<Product> _paginated(dynamic data) {
    final map = data as Map<String, dynamic>;
    final items = (map['items'] as List)
        .map((e) => Product.fromJson(e as Map<String, dynamic>))
        .toList();
    return Paginated(items: items, total: (map['total'] as num?)?.toInt() ?? 0);
  }

  // ── Sevimli ───────────────────────────────────────────
  Future<List<Product>> favorites() async {
    final r = await _dio.get(ApiEndpoints.favorites);
    return (r.data as List)
        .map((e) => Product.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> addFavorite(String productId) =>
      _dio.post('${ApiEndpoints.favorites}/$productId');
  Future<void> removeFavorite(String productId) =>
      _dio.delete('${ApiEndpoints.favorites}/$productId');

  // ── Savat ─────────────────────────────────────────────
  Future<Cart> getCart() async {
    final r = await _dio.get(ApiEndpoints.cart);
    return Cart.fromJson(r.data as Map<String, dynamic>);
  }

  Future<Cart> addToCart(String productId, int quantity) async {
    final r = await _dio.post(ApiEndpoints.cart,
        data: {'productId': productId, 'quantity': quantity});
    return Cart.fromJson(r.data as Map<String, dynamic>);
  }

  Future<Cart> updateCartItem(String itemId, int quantity) async {
    final r = await _dio.patch('${ApiEndpoints.cart}/$itemId',
        data: {'quantity': quantity});
    return Cart.fromJson(r.data as Map<String, dynamic>);
  }

  Future<Cart> removeCartItem(String itemId) async {
    final r = await _dio.delete('${ApiEndpoints.cart}/$itemId');
    return Cart.fromJson(r.data as Map<String, dynamic>);
  }

  // ── Buyurtma ──────────────────────────────────────────
  Future<List<PickupPoint>> pickupPoints() async {
    final r = await _dio.get(ApiEndpoints.pickupPoints);
    return (r.data as List)
        .map((e) => PickupPoint.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Order> createOrder(Map<String, dynamic> body) async {
    final r = await _dio.post(ApiEndpoints.orders, data: body);
    return Order.fromJson(r.data as Map<String, dynamic>);
  }

  Future<List<Order>> orders() async {
    final r = await _dio.get(ApiEndpoints.orders);
    return (r.data as List)
        .map((e) => Order.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  // ── Xizmat / ariza ────────────────────────────────────
  Future<List<ServiceItem>> services() async {
    final r = await _dio.get(ApiEndpoints.services);
    return (r.data as List)
        .map((e) => ServiceItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> createApplication(Map<String, dynamic> body) =>
      _dio.post(ApiEndpoints.applications, data: body);

  Future<List<Application>> applications() async {
    final r = await _dio.get(ApiEndpoints.applications);
    return (r.data as List)
        .map((e) => Application.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  // ── Statik ────────────────────────────────────────────
  Future<AppContent> content(String key) async {
    final r = await _dio.get(ApiEndpoints.content(key));
    return AppContent.fromJson(r.data as Map<String, dynamic>);
  }

  Future<List<Region>> regions() async {
    final r = await _dio.get(ApiEndpoints.regions);
    return (r.data as List)
        .map((e) => Region.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<City>> cities(String regionId) async {
    final r = await _dio.get(ApiEndpoints.cities(regionId));
    return (r.data as List)
        .map((e) => City.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
