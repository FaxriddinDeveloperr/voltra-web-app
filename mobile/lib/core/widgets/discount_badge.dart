import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Spec 1.4.3 — DiscountBadge (qizil pill, ⚙/quyosh ikonka + foiz).
class DiscountBadge extends StatelessWidget {
  const DiscountBadge({super.key, required this.percent, this.withMinus = false});

  final int percent;
  final bool withMinus; // detalda "-3%", kartalarda "15 %"

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.discountRed,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.settings, size: 12, color: Colors.white),
          const SizedBox(width: 3),
          Text(
            withMinus ? '-$percent%' : '$percent %',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}
