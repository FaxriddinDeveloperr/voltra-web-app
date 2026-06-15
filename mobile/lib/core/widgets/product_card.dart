import 'package:flutter/material.dart';
import '../models/product.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../utils/formatters.dart';
import 'discount_badge.dart';
import 'xit_badge.dart';
import 'network_img.dart';

/// Spec 1.4.1 — ProductCard (gorizontal listda, ~160px).
class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.product,
    this.onTap,
    this.isFavorite = false,
    this.onFavorite,
    this.width = AppSpacing.productCardWidth,
  });

  final Product product;
  final VoidCallback? onTap;
  final bool isFavorite;
  final VoidCallback? onFavorite;
  final double width;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 1,
              child: Stack(
                children: [
                  Positioned.fill(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
                      child: NetworkImg(url: product.firstImage),
                    ),
                  ),
                  if (product.isXit)
                    const Positioned(top: 8, left: 8, child: XitBadge()),
                  if (product.hasDiscount && product.discountPct != null)
                    Positioned(
                      bottom: 8,
                      left: 8,
                      child: DiscountBadge(percent: product.discountPct!),
                    ),
                  Positioned(
                    top: 6,
                    right: 6,
                    child: _FavoriteButton(
                      isFavorite: isFavorite,
                      onTap: onFavorite,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              product.nameUz,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.productName,
            ),
            const SizedBox(height: 4),
            if (product.hasDiscount)
              Text(Formatters.price(product.oldPrice!),
                  style: AppTypography.oldPrice),
            Text(Formatters.price(product.price), style: AppTypography.price),
          ],
        ),
      ),
    );
  }
}

class _FavoriteButton extends StatelessWidget {
  const _FavoriteButton({required this.isFavorite, this.onTap});
  final bool isFavorite;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedScale(
        scale: isFavorite ? 1.0 : 1.0,
        duration: const Duration(milliseconds: 120),
        child: Container(
          padding: const EdgeInsets.all(6),
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: Icon(
            isFavorite ? Icons.favorite : Icons.favorite_border,
            size: 18,
            color: isFavorite ? AppColors.discountRed : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
