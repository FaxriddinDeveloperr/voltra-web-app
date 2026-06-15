import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/models/product.dart';
import '../../core/network/api_endpoints.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/discount_badge.dart';
import '../../core/widgets/network_img.dart';
import '../../core/widgets/primary_button.dart';
import '../cart/cart_providers.dart';
import '../favorites/favorites_providers.dart';
import 'products_providers.dart';

/// Spec 2.6 — Mahsulot detali.
class ProductDetailScreen extends ConsumerWidget {
  const ProductDetailScreen({super.key, required this.id});
  final String id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(productDetailProvider(id));
    final isFav = ref.watch(favoritesProvider).contains(id);

    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
            icon: Icon(
              isFav ? Icons.favorite : Icons.favorite_border,
              color: isFav ? AppColors.discountRed : null,
            ),
            onPressed: () => ref.read(favoritesProvider.notifier).toggle(id),
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: async.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, __) => Center(
          child: TextButton(
            onPressed: () => ref.invalidate(productDetailProvider(id)),
            child: const Text('Qayta urinish'),
          ),
        ),
        data: (p) => _Body(product: p),
      ),
      bottomNavigationBar: async.maybeWhen(
        data: (p) => _BottomBar(product: p),
        orElse: () => null,
      ),
    );
  }
}

class _Body extends StatelessWidget {
  const _Body({required this.product});
  final Product product;

  @override
  Widget build(BuildContext context) {
    final p = product;
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        _Gallery(images: p.images),
        Padding(
          padding: const EdgeInsets.all(AppSpacing.screen),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Texnik xususiyatlar
              if (p.specs.isNotEmpty) ...[
                _SpecsBlock(specs: p.specs),
                const SizedBox(height: AppSpacing.lg),
              ],

              // Nom
              Text(p.nameUz,
                  style: const TextStyle(
                      fontSize: 22, fontWeight: FontWeight.w700)),
              const SizedBox(height: AppSpacing.md),

              // Narx bloki
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  if (p.hasDiscount) ...[
                    Text(Formatters.price(p.oldPrice!),
                        style: AppTypography.oldPrice.copyWith(fontSize: 15)),
                    const SizedBox(width: 8),
                    if (p.discountPct != null)
                      DiscountBadge(percent: p.discountPct!, withMinus: true),
                  ],
                ],
              ),
              const SizedBox(height: 4),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(Formatters.price(p.price),
                      style: AppTypography.priceLarge),
                  const SizedBox(width: 8),
                  if (p.vatIncluded)
                    const Padding(
                      padding: EdgeInsets.only(bottom: 3),
                      child: Text('QQS bilan',
                          style: TextStyle(
                              color: AppColors.textSecondary, fontSize: 13)),
                    ),
                ],
              ),
              if (p.priceUsd != null)
                Text(Formatters.usd(p.priceUsd!),
                    style: const TextStyle(
                        color: AppColors.textSecondary, fontSize: 14)),
              const SizedBox(height: AppSpacing.md),

              // Mavjudlik
              Row(
                children: [
                  const Text('Sotuvda mavjud: ',
                      style: TextStyle(color: AppColors.textSecondary)),
                  Text('${p.stock} dona',
                      style: const TextStyle(
                          color: AppColors.inStockGreen,
                          fontWeight: FontWeight.w700)),
                ],
              ),
              const SizedBox(height: AppSpacing.lg),

              // Xususiyatlar matni
              if (p.shortFeatures.isNotEmpty) ...[
                ...p.shortFeatures.map(
                  (f) => Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.only(top: 6, right: 8),
                          child: CircleAvatar(
                              radius: 2.5,
                              backgroundColor: AppColors.forest),
                        ),
                        Expanded(
                            child: Text(f,
                                style: const TextStyle(height: 1.4))),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],

              // To'liq tavsif
              if ((p.descriptionUz ?? '').isNotEmpty)
                OutlinedButton(
                  onPressed: () => _showDescription(context, p),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(48),
                    foregroundColor: AppColors.tealText,
                    side: const BorderSide(color: AppColors.forest),
                    shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.buttonRadius)),
                  ),
                  child: const Text("To'liq tavsif"),
                ),
              const SizedBox(height: AppSpacing.sm),

              // Datasheet
              if ((p.datasheetUrl ?? '').isNotEmpty)
                OutlinedButton.icon(
                  onPressed: () => _openDatasheet(context, p.datasheetUrl!),
                  icon: const Icon(Icons.download_outlined, size: 20),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(48),
                    foregroundColor: AppColors.textPrimary,
                    side: const BorderSide(color: AppColors.border),
                    shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.buttonRadius)),
                  ),
                  label: const Text("Datasheet'ni yuklab olish"),
                ),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ],
    );
  }

  void _showDescription(BuildContext context, Product p) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.background,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.6,
        maxChildSize: 0.9,
        builder: (_, controller) => SingleChildScrollView(
          controller: controller,
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(p.nameUz, style: AppTypography.sectionTitle),
              const SizedBox(height: AppSpacing.md),
              Text(p.descriptionUz ?? '',
                  style: const TextStyle(height: 1.5)),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _openDatasheet(BuildContext context, String url) async {
    final full = url.startsWith('http')
        ? url
        : '${ApiEndpoints.baseUrl.replaceAll('/api/v1', '')}$url';
    final uri = Uri.parse(full);
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Datasheet ochilmadi')),
      );
    }
  }
}

class _Gallery extends StatefulWidget {
  const _Gallery({required this.images});
  final List<ProductImage> images;

  @override
  State<_Gallery> createState() => _GalleryState();
}

class _GalleryState extends State<_Gallery> {
  int _current = 0;

  @override
  Widget build(BuildContext context) {
    final imgs = widget.images;
    return Column(
      children: [
        AspectRatio(
          aspectRatio: 1,
          child: imgs.isEmpty
              ? const NetworkImg(url: null)
              : CarouselSlider(
                  options: CarouselOptions(
                    viewportFraction: 1,
                    aspectRatio: 1,
                    enableInfiniteScroll: imgs.length > 1,
                    onPageChanged: (i, _) => setState(() => _current = i),
                  ),
                  items: imgs
                      .map((im) =>
                          SizedBox.expand(child: NetworkImg(url: im.url)))
                      .toList(),
                ),
        ),
        if (imgs.length > 1) ...[
          const SizedBox(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(imgs.length, (i) {
              final active = i == _current;
              return AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: active ? 18 : 7,
                height: 7,
                decoration: BoxDecoration(
                  color: active ? AppColors.primaryAccent : AppColors.border,
                  borderRadius: BorderRadius.circular(4),
                ),
              );
            }),
          ),
        ],
      ],
    );
  }
}

class _SpecsBlock extends StatelessWidget {
  const _SpecsBlock({required this.specs});
  final List<ProductSpec> specs;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
      ),
      child: Wrap(
        spacing: 20,
        runSpacing: 12,
        children: specs.map((s) {
          return SizedBox(
            width: 140,
            child: Row(
              children: [
                Icon(_iconFor(s.icon),
                    size: 20, color: AppColors.forest),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(s.label,
                          style: const TextStyle(
                              fontSize: 11, color: AppColors.textSecondary)),
                      Text(s.value,
                          style: const TextStyle(
                              fontSize: 13, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  IconData _iconFor(String key) {
    switch (key) {
      case 'bolt':
        return Icons.bolt;
      case 'sine':
        return Icons.show_chart;
      case 'mppt':
        return Icons.account_tree_outlined;
      case 'shield':
        return Icons.shield_outlined;
      case 'wifi':
        return Icons.wifi;
      case 'efficiency':
        return Icons.speed;
      case 'battery':
        return Icons.battery_charging_full;
      case 'cable':
        return Icons.cable;
      case 'length':
        return Icons.straighten;
      case 'cells':
        return Icons.grid_4x4;
      default:
        return Icons.info_outline;
    }
  }
}

class _BottomBar extends ConsumerStatefulWidget {
  const _BottomBar({required this.product});
  final Product product;

  @override
  ConsumerState<_BottomBar> createState() => _BottomBarState();
}

class _BottomBarState extends ConsumerState<_BottomBar> {
  bool _adding = false;

  Future<void> _add() async {
    setState(() => _adding = true);
    try {
      await ref.read(cartProvider.notifier).add(widget.product.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Savatga qo\'shildi')),
        );
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Xatolik yuz berdi')),
        );
      }
    } finally {
      if (mounted) setState(() => _adding = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.product;
    return SafeArea(
      child: Container(
        padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.screen, vertical: AppSpacing.md),
        decoration: const BoxDecoration(
          color: AppColors.background,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (p.hasDiscount)
                    Text(Formatters.price(p.oldPrice!),
                        style: AppTypography.oldPrice),
                  Text(Formatters.price(p.price), style: AppTypography.price),
                ],
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: PrimaryButton(
                label: 'Savatga',
                icon: Icons.shopping_cart_outlined,
                loading: _adding,
                onPressed: p.stock > 0 ? _add : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
