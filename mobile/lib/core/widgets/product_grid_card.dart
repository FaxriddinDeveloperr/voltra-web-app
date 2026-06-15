import 'package:flutter/material.dart';
import '../models/product.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../utils/formatters.dart';
import 'discount_badge.dart';
import 'xit_badge.dart';
import 'network_img.dart';
import 'heart_button.dart';

/// Spec 1.4.2 — ProductGridCard (2-ustun grid).
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
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
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
                  child: HeartButton(
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
    );
  }
}
