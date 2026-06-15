import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/l10n_ext.dart';
import '../../core/models/product.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/widgets/app_logo.dart';
import '../../core/widgets/network_img.dart';
import '../../core/widgets/quick_action_button.dart';
import '../../core/widgets/section_header.dart';
import '../../core/widgets/soft_icon_button.dart';
import '../../core/widgets/skeleton_loader.dart';
import '../products/widgets/fav_product_card.dart';
import 'home_providers.dart';
import 'widgets/banner_carousel.dart';
import 'widgets/home_menus.dart';

/// Spec 2.2 — Asosiy ekran (Home).
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final banners = ref.watch(bannersProvider);
    final hot = ref.watch(hotProductsProvider);
    final isLoading = banners.isLoading && hot.isLoading;

    return Scaffold(
      appBar: AppBar(
        titleSpacing: AppSpacing.screen,
        title: const Align(
          alignment: Alignment.centerLeft,
          child: AppLogo(size: 32, showWordmark: true),
        ),
        actions: [
          SoftIconButton(
            icon: Icons.search,
            onTap: () => context.push('/search'),
          ),
          const SizedBox(width: AppSpacing.sm),
          SoftIconButton(
            icon: Icons.favorite_border,
            onTap: () => context.push('/favorites'),
          ),
          const SizedBox(width: AppSpacing.screen),
        ],
      ),
      body: isLoading
          ? const HomeSkeleton()
          : RefreshIndicator(
              color: AppColors.primary,
              onRefresh: () async {
                ref.invalidate(bannersProvider);
                ref.invalidate(hotProductsProvider);
                ref.invalidate(newProductsProvider);
                ref.invalidate(bestSellerProvider);
                ref.invalidate(brandsProvider);
                await ref.read(hotProductsProvider.future);
              },
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg),
                children: [
                  // Signature hero — brend va'dasi + statistika
                  const Padding(
                    padding:
                        EdgeInsets.symmetric(horizontal: AppSpacing.screen),
                    child: _HeroCard(),
                  ),
                  const SizedBox(height: AppSpacing.section),

                  // Banner
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.screen),
                    child: banners.maybeWhen(
                      data: (list) => BannerCarousel(banners: list),
                      orElse: () => const SizedBox(height: 160),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.section),

                  // Quick actions
                  const _QuickActions(),
                  const SizedBox(height: AppSpacing.section),

                  // Sections
                  _ProductSection(
                    title: context.l10n.sectionHot,
                    provider: hotProductsProvider,
                    filter: 'hot',
                  ),
                  _ProductSection(
                    title: context.l10n.sectionNew,
                    provider: newProductsProvider,
                    filter: 'new',
                  ),
                  _ProductSection(
                    title: context.l10n.sectionBest,
                    provider: bestSellerProvider,
                    filter: 'best',
                  ),

                  // Brendlar
                  const _BrandsSection(),
                  const SizedBox(height: AppSpacing.section),
                ],
              ),
            ),
    );
  }
}

/// Signature hero — brend va'dasi + raqamlar (Voltra ovozi: raqamlar).
class _HeroCard extends StatelessWidget {
  const _HeroCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        gradient: AppColors.tealGradient,
        borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Quyosh sizga ishlaydi',
            style: AppTypography.sectionTitle.copyWith(
              color: Colors.white,
              fontSize: 22,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Quyosh panellari va to‘liq stansiyalar',
            style: AppTypography.hint
                .copyWith(color: Colors.white.withValues(alpha: 0.82)),
          ),
          const SizedBox(height: AppSpacing.lg),
          const Row(
            children: [
              _Stat(value: '25 yil', label: 'Kafolat'),
              _StatDivider(),
              _Stat(value: '4.5 yil', label: 'To‘lov qaytadi'),
              _StatDivider(),
              _Stat(value: '500+', label: 'O‘rnatilgan'),
            ],
          ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.value, required this.label});
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.4,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.75),
              fontSize: 11,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatDivider extends StatelessWidget {
  const _StatDivider();
  @override
  Widget build(BuildContext context) => Container(
        width: 1,
        height: 32,
        margin: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
        color: Colors.white.withValues(alpha: 0.20),
      );
}

class _QuickActions extends StatelessWidget {
  const _QuickActions();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.screen),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          QuickActionButton(
            icon: Icons.grid_view_rounded,
            label: context.l10n.qaCatalog,
            onTap: () => context.go('/catalog'),
          ),
          QuickActionButton(
            icon: Icons.build_outlined,
            label: context.l10n.qaServices,
            onTap: () => context.push('/services'),
          ),
          QuickActionButton(
            icon: Icons.handshake_outlined,
            label: context.l10n.qaPartnership,
            badge: context.l10n.badgeNew,
            onTap: () => showPartnershipMenu(context),
          ),
          QuickActionButton(
            icon: Icons.info_outline,
            label: context.l10n.qaUseful,
            onTap: () => showUsefulMenu(context),
          ),
        ],
      ),
    );
  }
}

class _ProductSection extends ConsumerWidget {
  const _ProductSection({
    required this.title,
    required this.provider,
    required this.filter,
  });
  final String title;
  final FutureProvider<List<Product>> provider;
  final String filter;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(provider);
    return async.maybeWhen(
      data: (products) {
        if (products.isEmpty) return const SizedBox.shrink();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: AppSpacing.screen),
              child: SectionHeader(
                title: title,
                onSeeAll: () => context.push(
                  '/products?filter=$filter&title=${Uri.encodeComponent(title)}',
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            SizedBox(
              height: 232,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding:
                    const EdgeInsets.symmetric(horizontal: AppSpacing.screen),
                itemCount: products.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (_, i) => FavProductCard(product: products[i]),
              ),
            ),
            const SizedBox(height: AppSpacing.section),
          ],
        );
      },
      orElse: () => const SizedBox.shrink(),
    );
  }
}

class _BrandsSection extends ConsumerWidget {
  const _BrandsSection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(brandsProvider);
    return async.maybeWhen(
      data: (brands) {
        if (brands.isEmpty) return const SizedBox.shrink();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.screen),
              child: Text(context.l10n.sectionBrands,
                  style: AppTypography.sectionTitle),
            ),
            const SizedBox(height: AppSpacing.md),
            SizedBox(
              height: 72,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding:
                    const EdgeInsets.symmetric(horizontal: AppSpacing.screen),
                itemCount: brands.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (_, i) {
                  final b = brands[i];
                  return GestureDetector(
                    onTap: () => context.push(
                      '/products?brand=${b.id}&title=${Uri.encodeComponent(b.name)}',
                    ),
                    child: Container(
                      width: 110,
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius:
                            BorderRadius.circular(AppSpacing.cardRadius),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: SizedBox(
                              width: 40,
                              height: 40,
                              child: NetworkImg(url: b.logoUrl),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              b.name,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  fontSize: 11, fontWeight: FontWeight.w500),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
      orElse: () => const SizedBox.shrink(),
    );
  }
}
