import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/app_logo.dart';
import '../auth/auth_providers.dart';
import '../cart/cart_providers.dart';
import '../favorites/favorites_providers.dart';

/// Spec 1.5 / 2.1 — Splash: logo, token tekshirish -> Home yoki Login.
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _boot());
  }

  Future<void> _boot() async {
    await Future<void>.delayed(const Duration(milliseconds: 1200));
    await ref.read(authProvider.notifier).bootstrap();
    // Auth bo'lsa savatni yuklab qo'yamiz.
    if (ref.read(authProvider).status == AuthStatus.authenticated) {
      ref.read(cartProvider.notifier).load();
      ref.read(favoritesProvider.notifier).load();
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(child: AppLogo(size: 96)),
    );
  }
}
