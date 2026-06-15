import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Zamonaviy, yagona geometrik sans — Plus Jakarta Sans.
/// Sarlavhalar qalin + zich (tight letter-spacing), matn yumshoq.
abstract class AppTypography {
  static TextStyle _t({
    double size = 14,
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.textPrimary,
    double height = 1.35,
    double spacing = 0,
  }) =>
      GoogleFonts.plusJakartaSans(
        fontSize: size,
        fontWeight: weight,
        color: color,
        height: height,
        letterSpacing: spacing,
      );

  // Sarlavhalar — qalin, zich
  static TextStyle get screenTitle =>
      _t(size: 26, weight: FontWeight.w800, height: 1.15, spacing: -0.5);
  static TextStyle get appBarTitle =>
      _t(size: 20, weight: FontWeight.w700, spacing: -0.3);
  static TextStyle get sectionTitle =>
      _t(size: 19, weight: FontWeight.w700, height: 1.2, spacing: -0.3);

  // Matn
  static TextStyle get productName =>
      _t(size: 14, weight: FontWeight.w500, height: 1.3);
  static TextStyle get price =>
      _t(size: 17, weight: FontWeight.w700, color: AppColors.ink, spacing: -0.2);
  static TextStyle get priceLarge => _t(
      size: 25,
      weight: FontWeight.w800,
      color: AppColors.primaryDark,
      spacing: -0.6);
  static TextStyle get oldPrice => _t(
        size: 13,
        weight: FontWeight.w500,
        color: AppColors.strikethrough,
      ).copyWith(decoration: TextDecoration.lineThrough);
  static TextStyle get button =>
      _t(size: 16, weight: FontWeight.w600, color: Colors.white);
  static TextStyle get hint =>
      _t(size: 14, weight: FontWeight.w400, color: AppColors.textSecondary);
  static TextStyle get link =>
      _t(size: 14, weight: FontWeight.w600, color: AppColors.tealText);
  static TextStyle get caption => _t(
        size: 11,
        weight: FontWeight.w700,
        color: AppColors.muted,
        spacing: 0.6,
      );
}
