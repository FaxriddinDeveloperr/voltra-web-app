import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// DiscountBadge — yumshoq tinted chip (ochiq qizil fon + to'q qizil matn).
class DiscountBadge extends StatelessWidget {
  const DiscountBadge({super.key, required this.percent, this.withMinus = false});

  final int percent;
  final bool withMinus; // detalda "-3%", kartalarda "15 %"

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.dangerTint,
        borderRadius: BorderRadius.circular(AppSpacing.pillRadius),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.sell_outlined, size: 12, color: AppColors.danger),
          const SizedBox(width: 3),
          Text(
            withMinus ? '-$percent%' : '$percent %',
            style: const TextStyle(
              color: AppColors.danger,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}
