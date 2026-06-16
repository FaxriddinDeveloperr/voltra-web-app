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

/// ProductGridCard (2-ustun grid) — rasm ustun, suzib turuvchi soya.
class ProductGridCard extends StatelessWidget {
  const ProductGridCard({
    super.key,
    required this.product,
    this.onTap,
    this.isFavorite = false,
    this.onFavorite,
  });

  final Product product;
  final VoidCallback? onTap;
  final bool isFavorite;
  final VoidCallback? onFavorite;

  @override
  Widget build(BuildContext context) {
    return Pressable(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
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
                      borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
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
          // Nom — doim 2 qatorlik joy (bir xil balandlik)
          SizedBox(
            height: 38,
            child: Text(
              product.nameUz,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.productName,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(Formatters.price(product.price), style: AppTypography.price),
          // Eski narx — doim joy ajratiladi (chegirma bo'lmasa ham)
          SizedBox(
            height: 16,
            child: product.hasDiscount
                ? Text(Formatters.price(product.oldPrice!),
                    style: AppTypography.oldPrice)
                : null,
          ),
        ],
      ),
    );
  }
}
