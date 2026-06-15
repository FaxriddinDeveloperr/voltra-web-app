import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';

/// Hamkorlik turlari (spec 2.11).
void showPartnershipMenu(BuildContext context) {
  _sheet(context, 'Hamkorlik', [
    _MenuItem(Icons.store_mall_directory_outlined, 'Dilerlar uchun',
        () => context.push('/partnership/dealer')),
    _MenuItem(Icons.badge_outlined, 'Savdo vakillari uchun',
        () => context.push('/partnership/seller')),
    _MenuItem(Icons.handyman_outlined, 'Ustalar uchun',
        () => context.push('/partnership/master')),
  ]);
}

/// Foydali menyu (spec 2.2 quick action "Foydali").
void showUsefulMenu(BuildContext context) {
  _sheet(context, 'Foydali', [
    _MenuItem(Icons.info_outline, 'Biz haqimizda',
        () => context.push('/content/about')),
    _MenuItem(Icons.description_outlined, 'Oferta va shartlar',
        () => context.push('/content/offer')),
    _MenuItem(Icons.assignment_outlined, 'Mening arizalarim',
        () => context.push('/applications')),
    _MenuItem(Icons.build_outlined, 'Xizmatlar',
        () => context.push('/services')),
  ]);
}

class _MenuItem {
  _MenuItem(this.icon, this.label, this.onTap);
  final IconData icon;
  final String label;
  final VoidCallback onTap;
}

void _sheet(BuildContext context, String title, List<_MenuItem> items) {
  showModalBottomSheet<void>(
    context: context,
    backgroundColor: AppColors.background,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) => SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Text(
              title,
              style: const TextStyle(
                  fontSize: 18, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: AppSpacing.sm),
            ...items.map(
              (m) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(m.icon, color: AppColors.forest),
                title: Text(m.label),
                trailing: const Icon(Icons.chevron_right,
                    color: AppColors.textSecondary),
                onTap: () {
                  Navigator.pop(ctx);
                  m.onTap();
                },
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
