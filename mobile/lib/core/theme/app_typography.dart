import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Voltra Brand Book (06 — Typography).
/// Display = Playfair Display (serif), Text = Inter (sans).
abstract class AppTypography {
  static TextStyle _serif({
    double size = 24,
    FontWeight weight = FontWeight.w700,
    Color color = AppColors.textPrimary,
    double height = 1.1,
  }) =>
      GoogleFonts.playfairDisplay(
        fontSize: size,
        fontWeight: weight,
        color: color,
        height: height,
      );

  static TextStyle _sans({
    double size = 14,
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.textPrimary,
    double height = 1.3,
    double spacing = 0,
  }) =>
      GoogleFonts.inter(
        fontSize: size,
        fontWeight: weight,
        color: color,
        height: height,
        letterSpacing: spacing,
      );

  // Display / sarlavhalar — serif
  static TextStyle get screenTitle =>
      _serif(size: 26, weight: FontWeight.w700);
  static TextStyle get appBarTitle =>
      _serif(size: 20, weight: FontWeight.w700);
  static TextStyle get sectionTitle =>
      _serif(size: 19, weight: FontWeight.w700);

  // Matn — sans
  static TextStyle get productName =>
      _sans(size: 14, weight: FontWeight.w500, height: 1.25);
  static TextStyle get price =>
      _sans(size: 17, weight: FontWeight.w700, color: AppColors.ink);
  static TextStyle get priceLarge =>
      _serif(size: 24, weight: FontWeight.w700, color: AppColors.forest);
  static TextStyle get oldPrice => _sans(
        size: 13,
        weight: FontWeight.w400,
        color: AppColors.strikethrough,
      ).copyWith(decoration: TextDecoration.lineThrough);
  static TextStyle get button =>
      _sans(size: 16, weight: FontWeight.w600, color: Colors.white);
  static TextStyle get hint =>
      _sans(size: 14, weight: FontWeight.w400, color: AppColors.textSecondary);
  static TextStyle get link =>
      _sans(size: 14, weight: FontWeight.w600, color: AppColors.tealText);
  static TextStyle get caption => _sans(
        size: 11,
        weight: FontWeight.w700,
        color: AppColors.muted,
        spacing: 1.2,
      );
}
