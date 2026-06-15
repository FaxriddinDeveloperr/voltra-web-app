import 'package:flutter/material.dart';

/// Markazlashtirilgan rang tizimi (teal). Hech qayerda hardcode rang yo'q —
/// barcha widgetlar shu tokenlardan o'qiydi.
abstract class AppColors {
  // ── Brend teal ─────────────────────────────────────────────
  static const primary = Color(0xFF0EA5A5);
  static const primaryDark = Color(0xFF0E3B3B); // chuqur teal

  // Tinted (yumshoq, shaffof) variantlar
  static const primaryTintSoft = Color(0x140EA5A5); // ~8%
  static const primaryTint = Color(0x1A0EA5A5); // ~10%
  static const primaryTintStrong = Color(0x240EA5A5); // ~14%

  // ── Neytral shkala (teal'ga biroz moyil, yumshoq o'tishlar) ─
  static const background = Color(0xFFFFFFFF); // asosiy kanvas — toza oq
  static const surface = Color(0xFFF7F9F9); // kartalar/inputlar yengil foni
  static const surfaceVariant = Color(0xFFEFF3F3); // biroz chuqurroq
  static const border = Color(0xFFE3EAEA); // nozik chegara

  // ── Matn ierarxiyasi ───────────────────────────────────────
  static const textPrimary = Color(0xFF0F2121);
  static const textSecondary = Color(0xFF5C6B6B);
  static const textTertiary = Color(0xFF93A1A1);

  // ── Status (yumshoq, zamonaviy ton + tinted fon) ───────────
  static const danger = Color(0xFFE15C54);
  static const dangerTint = Color(0xFFFCECEA);
  static const success = Color(0xFF1FA07A);
  static const successTint = Color(0xFFE6F4EF);
  static const warn = Color(0xFFC98A00);
  static const warnTint = Color(0xFFFBF1D6);

  // ── Soyalar (ko'p qatlamli, teal-tinted — border o'rniga) ──
  // Skill: soya rangi fonga moslangan (sof qora emas, deep teal toni).
  static const List<BoxShadow> cardShadow = [
    BoxShadow(color: Color(0x0A0E3B3B), blurRadius: 24, offset: Offset(0, 12)),
    BoxShadow(color: Color(0x0F0E3B3B), blurRadius: 6, offset: Offset(0, 2)),
  ];
  static const List<BoxShadow> softShadow = [
    BoxShadow(color: Color(0x0A0E3B3B), blurRadius: 16, offset: Offset(0, 6)),
  ];
  // Mahsulot rasmi "suzib turishi" uchun (signature)
  static const List<BoxShadow> floatShadow = [
    BoxShadow(color: Color(0x140E3B3B), blurRadius: 20, offset: Offset(0, 10)),
  ];

  // ── Nozik gradientlar (faqat banner/CTA/logo) ──────────────
  static const tealGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, primaryDark],
  );

  // ── Logo akssenti (faqat logo belgisida) ───────────────────
  static const sun = Color(0xFFF2B705);

  // ════════════════════════════════════════════════════════════
  // Eski semantik nomlar — yangi tokenlarga ko'chirilgan
  // (widgetlar o'zgarmasdan ishlashi uchun)
  // ════════════════════════════════════════════════════════════
  static const primaryAccent = primary;
  static const primaryAccentAlt = primaryDark;
  static const primaryLight = primaryTint; // tanlangan tinted fon
  static const primaryLightAlt = surfaceVariant;
  static const tealText = primary; // havola / narx akssent matni

  static const forest = primary; // ikonkalar -> primary
  static const deepForest = primaryDark;
  static const softForest = primary;
  static const cream = Color(0xFFFFFFFF);
  static const creamDeep = surfaceVariant;
  static const ink = textPrimary;
  static const muted = textSecondary;
  static const rule = border;

  static const discountRed = danger;
  static const discountRedAlt = danger;
  static const newGreen = success;
  static const newGreenAlt = success;
  static const dangerRed = danger;
  static const inStockGreen = success;

  static const surfaceAlt = surfaceVariant;
  static const imagePlaceholder = Color(0xFFE9EEEE);
  static const imagePlaceholderAlt = Color(0xFFE9EEEE);

  static const textPrimaryAlt = textPrimary;
  static const textSecondaryAlt = textSecondary;
  static const strikethrough = textTertiary;

  // Eski gradient nomlari -> teal gradient
  static const forestGradient = tealGradient;
  static const sunGradient = tealGradient;
}
