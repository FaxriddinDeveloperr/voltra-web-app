import 'package:flutter/material.dart';

/// Energiya brendi — electric yellow (tok sariq) + chaqmoq + qorong'i hero.
/// Markazlashtirilgan: barcha widgetlar shu tokenlardan o'qiydi.
abstract class AppColors {
  // ── Energiya palitrasi ─────────────────────────────────────
  static const accent = Color(0xFFFFD60A); // electric yellow — asosiy aksent
  static const accentDeep = Color(0xFFF2B600); // gradient/pressed
  static const accentBright = Color(0xFFFFE24D); // gradient yuqori (glossy)
  static const ink = Color(0xFF17170E); // near-black (qorong'i hero + matn)
  static const inkDeep = Color(0xFF0E0E08); // gradient tubi

  // Sariq tinted variantlar
  static const accentTintSoft = Color(0x1FFFD60A); // ~12%
  static const accentTint = Color(0x29FFD60A); // ~16%
  static const accentTintStrong = Color(0x3DFFD60A); // ~24%
  static const accentBorder = Color(0x4DFFD60A); // ~30% — sariq border

  // ── Neytral ────────────────────────────────────────────────
  static const background = Color(0xFFFFFFFF); // toza oq kontent foni
  static const surface = Color(0xFFF7F7F2); // iliq yengil sirt
  static const surfaceVariant = Color(0xFFEFEFE6);
  static const border = Color(0xFFE9E9DD);

  // ── Matn ───────────────────────────────────────────────────
  static const textPrimary = ink;
  static const textSecondary = Color(0xFF6B6B5C);
  static const textTertiary = Color(0xFF9C9C8C);

  // ── Status ─────────────────────────────────────────────────
  static const danger = Color(0xFFE5484D);
  static const dangerTint = Color(0xFFFDEBEC);
  static const success = Color(0xFF2BA24C);
  static const successTint = Color(0xFFE7F6EC);
  static const warn = accentDeep;
  static const warnTint = accentTintSoft;

  // ── Soyalar + electric glow ────────────────────────────────
  static const List<BoxShadow> cardShadow = [
    BoxShadow(color: Color(0x14000000), blurRadius: 20, offset: Offset(0, 10)),
    BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 1)),
  ];
  static const List<BoxShadow> softShadow = [
    BoxShadow(color: Color(0x12000000), blurRadius: 14, offset: Offset(0, 6)),
  ];
  static const List<BoxShadow> floatShadow = [
    BoxShadow(color: Color(0x1A000000), blurRadius: 18, offset: Offset(0, 10)),
  ];
  // Sariq electric glow (tugma/logo)
  static const List<BoxShadow> glow = [
    BoxShadow(color: Color(0x66FFD60A), blurRadius: 24, offset: Offset(0, 8)),
  ];

  // ── Gradientlar ────────────────────────────────────────────
  static const accentGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [accentBright, accent],
  );
  static const darkGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF24241A), inkDeep],
  );

  // Logo akssenti
  static const sun = accent;

  // ════════════════════════════════════════════════════════════
  // Eski semantik nomlar -> energiya tokenlariga
  // FILL'lar (tugma/aktiv/indikator) = sariq; MATN/IKONKA = ink
  // ════════════════════════════════════════════════════════════
  static const primary = accent; // tugma/aktiv FILL = sariq
  static const primaryDark = ink;
  static const primaryAccent = accent;
  static const primaryAccentAlt = ink;
  static const primaryLight = accentTint; // tinted aktiv fon = sariq tint
  static const primaryLightAlt = surfaceVariant;
  static const primaryTint = accentTint;
  static const primaryTintSoft = accentTintSoft;
  static const primaryTintStrong = accentTintStrong;
  static const tealText = ink; // havola/narx matni = ink (oqilmaydigan sariq emas)

  static const forest = ink; // ikonkalar = ink (oq fonda o'qiladi)
  static const deepForest = ink;
  static const softForest = ink;
  static const cream = Color(0xFFFFFFFF);
  static const creamDeep = surfaceVariant;
  static const muted = textSecondary;
  static const rule = border;

  static const discountRed = danger;
  static const discountRedAlt = danger;
  static const newGreen = success;
  static const newGreenAlt = success;
  static const dangerRed = danger;
  static const inStockGreen = success;

  static const surfaceAlt = surfaceVariant;
  static const imagePlaceholder = Color(0xFFECECE2);
  static const imagePlaceholderAlt = Color(0xFFECECE2);

  static const textPrimaryAlt = textPrimary;
  static const textSecondaryAlt = textSecondary;
  static const strikethrough = textTertiary;

  // Eski gradient nomlari
  static const tealGradient = darkGradient; // hero/logo plitka -> qorong'i
  static const forestGradient = darkGradient;
  static const sunGradient = accentGradient;
}
