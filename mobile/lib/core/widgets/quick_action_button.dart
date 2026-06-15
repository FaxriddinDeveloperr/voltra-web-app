import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import 'xit_badge.dart';

/// Spec 1.4.5 — QuickActionButton (och kulrang karta, turkuaz ikonka, nom).
class QuickActionButton extends StatelessWidget {
  const QuickActionButton({
    super.key,
    required this.icon,
    required this.label,
    this.onTap,
    this.badge,
  });

  final IconData icon;
  final String label;
  final VoidCallback? onTap;
  final String? badge; // "Yangi"

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: AppSpacing.quickAction,
                height: AppSpacing.quickAction,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
                ),
                child: Icon(icon, size: 32, color: AppColors.forest),
              ),
              if (badge != null)
                Positioned(
                  top: -6,
                  right: -6,
                  child: StatusPill(label: badge!),
                ),
            ],
          ),
          const SizedBox(height: 6),
          SizedBox(
            width: AppSpacing.quickAction + 8,
            child: Text(
              label,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 12, color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}
