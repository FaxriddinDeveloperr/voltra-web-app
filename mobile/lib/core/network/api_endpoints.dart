import 'package:flutter/foundation.dart';

/// Spec 5 — API endpointlar. Base URL platformaga qarab.
abstract class ApiEndpoints {
  /// Android emulyator -> 10.0.2.2, aks holda localhost.
  /// `--dart-define=API_BASE=...` orqali override qilish mumkin.
  static String get baseUrl {
    const override = String.fromEnvironment('API_BASE');
    if (override.isNotEmpty) return override;
    if (kIsWeb) {
      // Web/Telegram Mini App — API o'sha domendan beriladi (same-origin)
      return '${Uri.base.origin}/api/v1';
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3000/api/v1';
    }
    return 'http://localhost:3000/api/v1';
  }

  // Auth
  static const sendOtp = '/auth/send-otp';
  static const verifyOtp = '/auth/verify-otp';
  static const refresh = '/auth/refresh';
  static const logout = '/auth/logout';

  // Profil
  static const me = '/me';

  // Katalog
  static const categories = '/categories';
  static const brands = '/brands';
  static const banners = '/banners';
  static const products = '/products';
  static const productsHot = '/products/hot';
  static const productsNew = '/products/new';
  static const productsBest = '/products/best-sellers';
  static const productsSearch = '/products/search';
  static String product(String id) => '/products/$id';

  // Savat / sevimli
  static const cart = '/cart';
  static const favorites = '/favorites';

  // Buyurtma
  static const orders = '/orders';
  static const pickupPoints = '/pickup-points';

  // Xizmat / ariza
  static const services = '/services';
  static const applications = '/applications';

  // Statik
  static String content(String key) => '/content/$key';
  static const regions = '/regions';
  static String cities(String regionId) => '/regions/$regionId/cities';
}
