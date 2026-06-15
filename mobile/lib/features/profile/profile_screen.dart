import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/l10n_ext.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/utils/formatters.dart';
import '../auth/auth_providers.dart';
import '../cart/cart_providers.dart';
import '../favorites/favorites_providers.dart';

/// Spec 2.12 — Profil.
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;

    return Scaffold(
      appBar: AppBar(
        title: Text(context.l10n.profileTitle),
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        children: [
          // Avatar + telefon
          ListTile(
            contentPadding:
                const EdgeInsets.symmetric(horizontal: AppSpacing.screen),
            leading: const CircleAvatar(
              radius: 26,
              backgroundColor: AppColors.primaryLight,
              child: Icon(Icons.person, color: AppColors.primary, size: 28),
            ),
            title: Text(
              user == null ? '' : Formatters.phone(user.phone),
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
            ),
            subtitle: user != null &&
                    user.displayName != user.phone
                ? Text(user.displayName)
                : const Text('Profilni to\'ldiring'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/profile/edit'),
          ),
          const SizedBox(height: AppSpacing.md),

          // Menyu
          _MenuTile(
            icon: Icons.shopping_bag_outlined,
            label: context.l10n.myOrders,
            onTap: () => context.push('/orders'),
          ),
          _MenuTile(
            icon: Icons.assignment_outlined,
            label: context.l10n.myApplications,
            onTap: () => context.push('/applications'),
          ),
          _MenuTile(
            icon: Icons.headset_mic_outlined,
            label: context.l10n.contactUs,
            onTap: () => launchUrl(Uri.parse('tel:+998940196141')),
          ),

          _SectionLabel(context.l10n.settings),
          _MenuTile(
            icon: Icons.language,
            label: context.l10n.language,
            onTap: () => context.push('/profile/language'),
          ),
          _MenuTile(
            icon: Icons.info_outline,
            label: context.l10n.about,
            onTap: () => context.push('/content/about'),
          ),
          _MenuTile(
            icon: Icons.description_outlined,
            label: context.l10n.offer,
            onTap: () => context.push('/content/offer'),
          ),

          const SizedBox(height: AppSpacing.xl),
          // Chiqish
          Center(
            child: TextButton.icon(
              onPressed: () => _confirmLogout(context, ref),
              icon: const Icon(Icons.logout, color: AppColors.dangerRed),
              label: Text(context.l10n.logout,
                  style: const TextStyle(
                      color: AppColors.dangerRed, fontWeight: FontWeight.w600)),
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }

  void _confirmLogout(BuildContext context, WidgetRef ref) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Chiqish'),
        content: const Text('Hisobdan chiqishni xohlaysizmi?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Bekor qilish'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              ref.read(cartProvider.notifier).clearLocal();
              ref.read(favoritesProvider.notifier).clear();
              await ref.read(authProvider.notifier).logout();
            },
            child: const Text('Chiqish',
                style: TextStyle(color: AppColors.dangerRed)),
          ),
        ],
      ),
    );
  }
}

class _MenuTile extends StatelessWidget {
  const _MenuTile(
      {required this.icon, required this.label, required this.onTap});
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding:
          const EdgeInsets.symmetric(horizontal: AppSpacing.screen),
      leading: Icon(icon, color: AppColors.primary),
      title: Text(label),
      trailing:
          const Icon(Icons.chevron_right, color: AppColors.textSecondary),
      onTap: onTap,
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.label);
  final String label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.screen, AppSpacing.lg, AppSpacing.screen, AppSpacing.sm),
      child: Text(label,
          style: const TextStyle(
              color: AppColors.textSecondary, fontWeight: FontWeight.w600)),
    );
  }
}
