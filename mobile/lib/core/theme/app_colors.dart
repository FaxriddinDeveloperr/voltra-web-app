import 'package:flutter/material.dart';

/// Spec 1.1 — Rang palitrasi (videodan piksel darajasida).
abstract class AppColors {
  // Primary
  static const primary = Color(0xFF0F4A3F); // to'q yashil — asosiy tugmalar
  static const primaryAccent = Color(0xFF3DD6C0); // turkuaz/mint
  static const primaryAccentAlt = Color(0xFF4ECDC4);
  static const primaryLight = Color(0xFFD4F5F0); // och mint — aktiv tab foni
  static const primaryLightAlt = Color(0xFFC5F2EB);
  static const tealText = Color(0xFF1A9E8F); // narx matni, "Hammasi >"

  // Status
  static const discountRed = Color(0xFFE63946); // chegirma badge
  static const discountRedAlt = Color(0xFFEF3B3B);
  static const newGreen = Color(0xFF3AAA35); // "Tez kunda", "Yangi"
  static const newGreenAlt = Color(0xFF34A853);
  static const dangerRed = Color(0xFFE03131); // o'chirish/chiqish
  static const inStockGreen = Color(0xFF2E9E4F); // "100 dona"

  // Surfaces
  static const background = Color(0xFFFFFFFF);
  static const surface = Color(0xFFF5F5F5); // input/quick-action fon
  static const surfaceAlt = Color(0xFFF2F2F2);
  static const imagePlaceholder = Color(0xFFE0E0E0);
  static const imagePlaceholderAlt = Color(0xFFDEDEDE);

  // Text
  static const textPrimary = Color(0xFF1A1A1A);
  static const textPrimaryAlt = Color(0xFF212121);
  static const textSecondary = Color(0xFF757575);
  static const textSecondaryAlt = Color(0xFF888888);
  static const strikethrough = Color(0xFF9E9E9E);

  // Border
  static const border = Color(0xFFE0E0E0);
}
