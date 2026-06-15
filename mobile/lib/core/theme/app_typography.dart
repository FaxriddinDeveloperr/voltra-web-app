import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Spec 1.2 — Tipografiya. System sans-serif (Roboto-ga o'xshash).
abstract class AppTypography {
  static const _family = null; // system default

  static const screenTitle = TextStyle(
    fontFamily: _family,
    fontSize: 25,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
  );

  static const appBarTitle = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
  );

  static const sectionTitle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
  );

  static const productName = TextStyle(
    fontSize: 15,
    fontWeight: FontWeight.w500,
    color: AppColors.textPrimary,
    height: 1.25,
  );

  static const price = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
  );

  static const priceLarge = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.w700,
    color: AppColors.tealText,
  );

  static const oldPrice = TextStyle(
    fontSize: 13,
    fontWeight: FontWeight.w400,
    color: AppColors.strikethrough,
    decoration: TextDecoration.lineThrough,
  );

  static const button = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.white,
  );

  static const hint = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
  );

  static const link = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: AppColors.tealText,
  );
}
