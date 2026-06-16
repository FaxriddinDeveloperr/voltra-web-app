import 'package:flutter/material.dart';
import '../models/product.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../utils/formatters.dart';
import 'discount_badge.dart';
import 'xit_badge.dart';
import 'network_img.dart';
import 'heart_button.dart';
import 'pressable.dart';

/// ProductCard (gorizontal listda, ~160px) — rasm ustun, suzib turuvchi soya.
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
    return Pressable(
      onTap: onTap,
      child: SizedBox(
        width: width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Signature: suzib turuvchi rasm bloki
            AspectRatio(
              aspectRatio: 1,
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
                  boxShadow: AppColors.floatShadow,
                ),
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: ClipRRect(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.cardRadius),
                        child: NetworkImg(url: product.firstImage),
                      ),
                    ),
                    if (product.isXit)
                      const Positioned(top: 10, left: 10, child: XitBadge()),
                    if (product.hasDiscount && product.discountPct != null)
                      Positioned(
                        bottom: 10,
                        left: 10,
                        child: DiscountBadge(percent: product.discountPct!),
                      ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: HeartButton(
                        isFavorite: isFavorite,
                        onTap: onFavorite,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              product.nameUz,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.productName,
            ),
            const SizedBox(height: AppSpacing.xs),
            // Narx — USD (Google Sheets'dan)
            Text(Formatters.usdPrice(product.priceUsd),
                style: AppTypography.price),
          ],
        ),
      ),
    );
  }
}
