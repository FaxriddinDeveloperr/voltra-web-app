import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import 'pressable.dart';

/// Yumshoq doira ichidagi ikonka tugma (AppBar aksiyalari uchun).
class SoftIconButton extends StatelessWidget {
  const SoftIconButton({super.key, required this.icon, this.onTap, this.badge});
  final IconData icon;
  final VoidCallback? onTap;
  final Widget? badge;

  @override
  Widget build(BuildContext context) {
    return Pressable(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 40,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: AppColors.surface,
          shape: BoxShape.circle,
        ),
        child: Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.center,
          children: [
            Icon(icon, size: 20, color: AppColors.textPrimary),
            if (badge != null) Positioned(top: -8, right: -8, child: badge!),
          ],
        ),
      ),
    );
  }
}
