import 'package:flutter/material.dart';

/// Energiya brendi — electric yellow + chaqmoq. Light va Dark rejim.
/// `AppColors.dark` global bayroq orqali rang tizimi almashadi.
abstract class AppColors {
  /// Joriy rejim (app.dart build'da o'rnatiladi).
  static bool dark = false;

  static Color _v(Color light, Color darkC) => dark ? darkC : light;

  // ── Aksent (ikkala rejimda bir xil) ────────────────────────
  static const accent = Color(0xFFFFD60A);
  static const accentDeep = Color(0xFFF2B600);
  static const accentBright = Color(0xFFFFE24D);
  static const onAccent = Color(0xFF17170E); // sariq ustidagi matn — doim to'q

  // Sariq tinted (ikkala rejimda)
  static const accentTintSoft = Color(0x1FFFD60A);
  static const accentTint = Color(0x29FFD60A);
  static const accentTintStrong = Color(0x3DFFD60A);
  static const accentBorder = Color(0x4DFFD60A);

  // Status (asosiy ranglar bir xil)
  static const danger = Color(0xFFE5484D);
  static const success = Color(0xFF2BA24C);

  // ── Neytral (rejimga qarab almashadi) ──────────────────────
  static Color get background => _v(const Color(0xFFFFFFFF), const Color(0xFF0F0F0A));
  static Color get card => _v(const Color(0xFFFFFFFF), const Color(0xFF1B1B13));
  static Color get surface => _v(const Color(0xFFF7F7F2), const Color(0xFF232319));
  static Color get surfaceVariant =>
      _v(const Color(0xFFEFEFE6), const Color(0xFF2C2C20));
  static Color get border => _v(const Color(0xFFE9E9DD), const Color(0xFF34342A));

  static Color get textPrimary =>
      _v(const Color(0xFF17170E), const Color(0xFFF4F2E6));
  static Color get textSecondary =>
      _v(const Color(0xFF6B6B5C), const Color(0xFFAEAEA0));
  static Color get textTertiary =>
      _v(const Color(0xFF9C9C8C), const Color(0xFF76766A));

  static Color get dangerTint =>
      _v(const Color(0xFFFDEBEC), const Color(0xFF3A1E1E));
  static Color get successTint =>
      _v(const Color(0xFFE7F6EC), const Color(0xFF14301F));
  static Color get warn => accentDeep;
  static Color get warnTint => accentTintSoft;

  static Color get imagePlaceholder =>
      _v(const Color(0xFFECECE2), const Color(0xFF26261C));

  // ── Soyalar ────────────────────────────────────────────────
  static List<BoxShadow> get cardShadow => dark
      ? const [
          BoxShadow(color: Color(0x40000000), blurRadius: 22, offset: Offset(0, 10)),
        ]
      : const [
          BoxShadow(color: Color(0x14000000), blurRadius: 20, offset: Offset(0, 10)),
          BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 1)),
        ];
  static List<BoxShadow> get softShadow => dark
      ? const [BoxShadow(color: Color(0x33000000), blurRadius: 16, offset: Offset(0, 6))]
      : const [BoxShadow(color: Color(0x12000000), blurRadius: 14, offset: Offset(0, 6))];
  static List<BoxShadow> get floatShadow => dark
      ? const [BoxShadow(color: Color(0x4D000000), blurRadius: 20, offset: Offset(0, 10))]
      : const [BoxShadow(color: Color(0x1A000000), blurRadius: 18, offset: Offset(0, 10))];
  // Sariq electric glow (ikkala rejim)
  static const List<BoxShadow> glow = [
    BoxShadow(color: Color(0x66FFD60A), blurRadius: 24, offset: Offset(0, 8)),
  ];

  // ── Gradientlar ────────────────────────────────────────────
  static const accentGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [accentBright, accent],
  );
  static LinearGradient get heroGradient => dark
      ? const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF26261A), Color(0xFF0F0F0A)],
        )
      : const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFFFFF7D6), Color(0xFFFFFFFF)],
        );

  // Logo akssenti
  static const sun = accent;

  // ════════════════════════════════════════════════════════════
  // Eski semantik nomlar
  // ════════════════════════════════════════════════════════════
  static const primary = accent; // tugma/aktiv FILL
  static Color get primaryDark => textPrimary;
  static const primaryAccent = accent;
  static const primaryAccentAlt = onAccent;
  static const primaryLight = accentTint;
  static Color get primaryLightAlt => surfaceVariant;
  static const primaryTint = accentTint;
  static const primaryTintSoft = accentTintSoft;
  static const primaryTintStrong = accentTintStrong;
  static Color get tealText => textPrimary;

  static Color get forest => textPrimary; // ikonkalar (matn rangi bilan birga)
  static Color get deepForest => textPrimary;
  static Color get softForest => textPrimary;
  static Color get cream => background;
  static Color get creamDeep => surfaceVariant;
  static Color get ink => textPrimary; // umumiy matn (flip)
  static Color get muted => textSecondary;
  static Color get rule => border;

  static const discountRed = danger;
  static const discountRedAlt = danger;
  static const newGreen = success;
  static const newGreenAlt = success;
  static const dangerRed = danger;
  static const inStockGreen = success;

  static Color get surfaceAlt => surfaceVariant;
  static Color get imagePlaceholderAlt => imagePlaceholder;
  static Color get textPrimaryAlt => textPrimary;
  static Color get textSecondaryAlt => textSecondary;
  static Color get strikethrough => textTertiary;

  // Eski gradient nomlari -> hero gradient
  static LinearGradient get tealGradient => heroGradient;
  static LinearGradient get forestGradient => heroGradient;
  static const sunGradient = accentGradient;
}
