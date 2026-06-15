import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../widgets/main_shell.dart';
import '../../features/auth/auth_providers.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/auth/presentation/phone_screen.dart';
import '../../features/auth/presentation/otp_screen.dart';
import '../../features/auth/presentation/profile_setup_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/catalog/catalog_screen.dart';
import '../../features/cart/cart_screen.dart';
import '../../features/profile/profile_screen.dart';
import '../../features/products/products_list_screen.dart';
import '../../features/products/product_detail_screen.dart';
import '../../features/search/search_screen.dart';
import '../../features/favorites/favorites_screen.dart';
import '../../features/checkout/checkout_screen.dart';
import '../../features/services/services_screen.dart';
import '../../features/services/service_form_screen.dart';
import '../../features/partnership/partnership_form_screen.dart';
import '../../features/orders/orders_screen.dart';
import '../../features/applications/applications_screen.dart';
import '../../features/profile/profile_edit_screen.dart';
import '../../features/profile/language_screen.dart';
import '../../features/profile/content_screen.dart';

final _rootKey = GlobalKey<NavigatorState>();
final _shellKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    navigatorKey: _rootKey,
    initialLocation: '/splash',
    routes: [
      GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),

      // Auth
      GoRoute(path: '/auth/phone', builder: (_, __) => const PhoneScreen()),
      GoRoute(
        path: '/auth/otp',
        builder: (_, s) => OtpScreen(phone: s.uri.queryParameters['phone'] ?? ''),
      ),
      GoRoute(
        path: '/auth/profile-setup',
        builder: (_, __) => const ProfileSetupScreen(),
      ),

      // Shell (bottom nav)
      ShellRoute(
        navigatorKey: _shellKey,
        builder: (_, __, child) => MainShell(child: child),
        routes: [
          GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
          GoRoute(path: '/catalog', builder: (_, __) => const CatalogScreen()),
          GoRoute(path: '/cart', builder: (_, __) => const CartScreen()),
          GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
        ],
      ),

      // Mahsulotlar
      GoRoute(
        path: '/products',
        builder: (_, s) => ProductsListScreen(
          title: s.uri.queryParameters['title'] ?? 'Mahsulotlar',
          categoryId: s.uri.queryParameters['category'],
          brandId: s.uri.queryParameters['brand'],
          filter: s.uri.queryParameters['filter'],
        ),
      ),
      GoRoute(
        path: '/product/:id',
        builder: (_, s) => ProductDetailScreen(id: s.pathParameters['id']!),
      ),
      GoRoute(path: '/search', builder: (_, __) => const SearchScreen()),
      GoRoute(path: '/favorites', builder: (_, __) => const FavoritesScreen()),
      GoRoute(path: '/checkout', builder: (_, __) => const CheckoutScreen()),

      // Xizmat / hamkorlik
      GoRoute(path: '/services', builder: (_, __) => const ServicesScreen()),
      GoRoute(
        path: '/services/apply',
        builder: (_, s) => ServiceFormScreen(
          serviceId: s.uri.queryParameters['id'] ?? '',
          serviceName: s.uri.queryParameters['name'] ?? 'Xizmat',
          hasPowerField: s.uri.queryParameters['power'] == '1',
        ),
      ),
      GoRoute(
        path: '/partnership/:type',
        builder: (_, s) =>
            PartnershipFormScreen(type: s.pathParameters['type']!),
      ),

      // Profil bo'limlari
      GoRoute(path: '/orders', builder: (_, __) => const OrdersScreen()),
      GoRoute(
          path: '/applications',
          builder: (_, __) => const ApplicationsScreen()),
      GoRoute(
          path: '/profile/edit',
          builder: (_, __) => const ProfileEditScreen()),
      GoRoute(
          path: '/profile/language',
          builder: (_, __) => const LanguageScreen()),
      GoRoute(
        path: '/content/:key',
        builder: (_, s) => ContentScreen(contentKey: s.pathParameters['key']!),
      ),
    ],
    redirect: (context, state) {
      final auth = ref.read(authProvider).status;
      final loc = state.uri.path;
      final isSplash = loc == '/splash';
      final isAuthFlow = loc.startsWith('/auth');

      if (auth == AuthStatus.unknown) {
        return isSplash ? null : '/splash';
      }
      if (auth == AuthStatus.unauthenticated) {
        return isAuthFlow ? null : '/auth/phone';
      }
      if (auth == AuthStatus.needsProfile) {
        return loc == '/auth/profile-setup' ? null : '/auth/profile-setup';
      }
      // authenticated
      if (isSplash || isAuthFlow) return '/home';
      return null;
    },
    refreshListenable: _AuthListenable(ref),
  );
});

/// Auth state o'zgarganda routerni qayta baholash uchun.
class _AuthListenable extends ChangeNotifier {
  _AuthListenable(Ref ref) {
    ref.listen(authProvider, (_, __) => notifyListeners());
  }
}
