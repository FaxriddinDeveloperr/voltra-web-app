import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_spacing.dart';

/// Markazlashtirilgan konteyner dekoratsiyalari — yengil soya, border emas.
abstract class AppDecorations {
  /// Oq karta + juda yengil soya.
  static BoxDecoration card({double? radius}) => BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(radius ?? AppSpacing.cardRadius),
        boxShadow: AppColors.cardShadow,
      );

  /// To'ldirilgan yengil sirt (xulosa bloklari, quick-action) — soyasiz.
  static BoxDecoration surface({double? radius}) => BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(radius ?? AppSpacing.cardRadius),
      );

  /// Tanlangan / aktiv tinted holat — primary shaffof fon + nozik border.
  static BoxDecoration tintedActive({double? radius}) => BoxDecoration(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(radius ?? AppSpacing.buttonRadius),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.35)),
      );
}
