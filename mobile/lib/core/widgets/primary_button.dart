import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import 'pressable.dart';

/// PrimaryButton — glossy sariq gradient + electric glow, to'q matn (3D his).
class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.loading = false,
    this.expanded = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool loading;
  final bool expanded;

  @override
  Widget build(BuildContext context) {
    final enabled = !loading && onPressed != null;

    final content = loading
        ? const SizedBox(
            height: 22,
            width: 22,
            child: CircularProgressIndicator(
              strokeWidth: 2.4,
              valueColor: AlwaysStoppedAnimation(AppColors.ink),
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 20, color: AppColors.ink),
                const SizedBox(width: AppSpacing.sm),
              ],
              Flexible(
                child: Text(
                  label,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
              ),
            ],
          );

    final box = Container(
      height: 54,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        gradient: enabled ? AppColors.accentGradient : null,
        color: enabled ? null : AppColors.accentTintSoft,
        borderRadius: BorderRadius.circular(AppSpacing.buttonRadius),
        boxShadow: enabled ? AppColors.glow : null,
        // yuqori nozik yorug'lik (3D)
        border: enabled
            ? const Border(
                top: BorderSide(color: Color(0x66FFFFFF), width: 1),
              )
            : null,
      ),
      child: DefaultTextStyle.merge(
        style: TextStyle(
          color: enabled ? AppColors.ink : AppColors.textTertiary,
        ),
        child: IconTheme.merge(
          data: IconThemeData(
            color: enabled ? AppColors.ink : AppColors.textTertiary,
          ),
          child: content,
        ),
      ),
    );

    final sized = expanded ? SizedBox(width: double.infinity, child: box) : box;
    return Pressable(onTap: enabled ? onPressed : null, child: sized);
  }
}
