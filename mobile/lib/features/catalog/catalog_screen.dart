import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/models/catalog.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/widgets/network_img.dart';
import '../../core/widgets/skeleton_loader.dart';
import 'catalog_providers.dart';

/// Spec 2.5 — Katalog (kategoriyalar accordion).
class CatalogScreen extends ConsumerWidget {
  const CatalogScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(categoriesProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Katalog')),
      body: async.when(
        loading: () => const GridSkeleton(itemCount: 8),
        error: (_, __) => Center(
          child: TextButton(
            onPressed: () => ref.invalidate(categoriesProvider),
            child: const Text('Qayta urinish'),
          ),
        ),
        data: (categories) => ListView.separated(
          padding: const EdgeInsets.all(AppSpacing.screen),
          itemCount: categories.length,
          separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
          itemBuilder: (_, i) => _CategoryTile(category: categories[i]),
        ),
      ),
    );
  }
}

class _CategoryTile extends StatelessWidget {
  const _CategoryTile({required this.category});
  final Category category;

  @override
  Widget build(BuildContext context) {
    final hasChildren = category.children.isNotEmpty;

    void openProducts() => context.push(
          '/products?category=${category.id}'
          '&title=${Uri.encodeComponent(category.nameUz)}',
        );

    final leading = ClipRRect(
      borderRadius: BorderRadius.circular(AppSpacing.smallImageRadius),
      child: SizedBox(
        width: 48,
        height: 48,
        child: NetworkImg(url: category.imageUrl),
      ),
    );

    if (!hasChildren) {
      return Container(
        decoration: _boxDeco,
        child: ListTile(
          onTap: openProducts,
          leading: leading,
          title: Text(category.nameUz,
              style: const TextStyle(fontWeight: FontWeight.w600)),
          trailing:
              const Icon(Icons.chevron_right, color: AppColors.textSecondary),
        ),
      );
    }

    return Container(
      decoration: _boxDeco,
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          shape: const Border(),
          collapsedShape: const Border(),
          leading: leading,
          title: Text(category.nameUz,
              style: const TextStyle(fontWeight: FontWeight.w600)),
          childrenPadding:
              const EdgeInsets.only(left: 16, right: 8, bottom: 8),
          children: [
            ListTile(
              dense: true,
              contentPadding: EdgeInsets.zero,
              title: Text('Barchasi', style: AppTypography.link),
              onTap: openProducts,
            ),
            ...category.children.map(
              (c) => ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                title: Text(c.nameUz),
                trailing: const Icon(Icons.chevron_right,
                    size: 18, color: AppColors.textSecondary),
                onTap: () => context.push(
                  '/products?category=${c.id}'
                  '&title=${Uri.encodeComponent(c.nameUz)}',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  BoxDecoration get _boxDeco => BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
        border: Border.all(color: AppColors.border),
      );
}
