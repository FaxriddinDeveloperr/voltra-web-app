import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../l10n_ext.dart';
import '../../features/cart/cart_providers.dart';

/// Spec 0 — Bottom Navigation (4 tab: Asosiy, Katalog, Savat, Profil).
/// Aktiv tab: och mint pill fon + qora ikonka.
class MainShell extends ConsumerWidget {
  const MainShell({super.key, required this.child});
  final Widget child;

  static const _tabs = [
    _TabSpec('/home', Icons.home_outlined, Icons.home),
    _TabSpec('/catalog', Icons.grid_view_outlined, Icons.grid_view),
    _TabSpec('/cart', Icons.shopping_cart_outlined, Icons.shopping_cart),
    _TabSpec('/profile', Icons.person_outline, Icons.person),
  ];

  int _indexFor(String location) {
    final i = _tabs.indexWhere((t) => location.startsWith(t.path));
    return i < 0 ? 0 : i;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).uri.path;
    final current = _indexFor(location);
    final cartCount = ref.watch(cartCountProvider);
    final labels = [
      context.l10n.navHome,
      context.l10n.navCatalog,
      context.l10n.navCart,
      context.l10n.navProfile,
    ];

    return Scaffold(
      body: child,
      bottomNavigationBar: SafeArea(
        child: Container(
          height: 64,
          padding: const EdgeInsets.symmetric(horizontal: 8),
          decoration: const BoxDecoration(
            color: AppColors.background,
            border: Border(top: BorderSide(color: AppColors.border)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(_tabs.length, (i) {
              final t = _tabs[i];
              final active = i == current;
              return _NavItem(
                spec: t,
                label: labels[i],
                active: active,
                badge: t.path == '/cart' ? cartCount : 0,
                onTap: () => context.go(t.path),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _TabSpec {
  const _TabSpec(this.path, this.icon, this.activeIcon);
  final String path;
  final IconData icon;
  final IconData activeIcon;
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.spec,
    required this.label,
    required this.active,
    required this.onTap,
    this.badge = 0,
  });
  final _TabSpec spec;
  final String label;
  final bool active;
  final VoidCallback onTap;
  final int badge;

  @override
  Widget build(BuildContext context) {
    final iconWidget = Icon(
      active ? spec.activeIcon : spec.icon,
      size: 22,
      color: active ? AppColors.primary : AppColors.textSecondary,
    );

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        padding: EdgeInsets.symmetric(horizontal: active ? 16 : 12, vertical: 8),
        decoration: BoxDecoration(
          color: active ? AppColors.primaryTint : Colors.transparent,
          borderRadius: BorderRadius.circular(AppSpacing.pillRadius),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                iconWidget,
                if (badge > 0)
                  Positioned(
                    top: -6,
                    right: -8,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      constraints:
                          const BoxConstraints(minWidth: 16, minHeight: 16),
                      decoration: const BoxDecoration(
                        color: AppColors.discountRed,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '$badge',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
              ],
            ),
            if (active) ...[
              const SizedBox(width: 6),
              Text(
                label,
                style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
