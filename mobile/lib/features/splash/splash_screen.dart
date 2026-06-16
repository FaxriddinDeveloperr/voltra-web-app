import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/app_logo.dart';
import '../auth/auth_providers.dart';
import '../cart/cart_providers.dart';
import '../favorites/favorites_providers.dart';

/// Splash — qorong'i energiya kirishi: nurli sariq chaqmoq logo.
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulse = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1400),
  )..repeat(reverse: true);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _boot());
  }

  Future<void> _boot() async {
    await Future<void>.delayed(const Duration(milliseconds: 1300));
    await ref.read(authProvider.notifier).bootstrap();
    if (ref.read(authProvider).status == AuthStatus.authenticated) {
      ref.read(cartProvider.notifier).load();
      ref.read(favoritesProvider.notifier).load();
    }
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.of(context).disableAnimations;
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFFFF7D6), Color(0xFFFFFFFF)],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AnimatedBuilder(
                animation: _pulse,
                builder: (context, child) {
                  final t = reduce ? 0.5 : _pulse.value;
                  return Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.accent
                              .withValues(alpha: 0.30 + 0.30 * t),
                          blurRadius: 36 + 26 * t,
                          spreadRadius: 2 + 5 * t,
                        ),
                      ],
                    ),
                    child: child,
                  );
                },
                child: const AppLogo(size: 88),
              ),
              const SizedBox(height: 28),
              Text(
                'VOLTRA',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 4,
                  color: AppColors.ink,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'QUYOSH ENERGIYASI',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 3,
                  color: AppColors.accentDeep,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
