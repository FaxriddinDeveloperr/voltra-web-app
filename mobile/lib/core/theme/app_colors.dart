import 'package:flutter/material.dart';

/// Voltra Brand Book (05 — Color). Forest + Sun + Cream.
abstract class AppColors {
  // ── Voltra asosiy palitrasi ────────────────────────────────
  static const forest = Color(0xFF155233); // Voltra Forest — asosiy
  static const deepForest = Color(0xFF0E3A24);
  static const softForest = Color(0xFF1F6F46);
  static const sun = Color(0xFFF0C71D); // Voltra Sun — akssent
  static const cream = Color(0xFFF9F3D9); // Voltra Cream — kanvas
  static const creamDeep = Color(0xFFEFE7C4);
  static const ink = Color(0xFF0B1D13);
  static const muted = Color(0xFF6B7A70);
  static const rule = Color(0xFFD8D2B8);

  // ── Eski semantik nomlar (Voltra qiymatlariga ko'chirilgan) ─
  static const primary = forest; // asosiy tugmalar, interaktiv
  static const primaryAccent = sun; // akssent (badge, nuqta, narx highlight)
  static const primaryAccentAlt = softForest;
  static const primaryLight = Color(0xFFE4EFE8); // och forest tint (selected)
  static const primaryLightAlt = creamDeep;
  static const tealText = softForest; // havola va narx matni (yashil)

  // Status
  static const discountRed = Color(0xFFD6453B);
  static const discountRedAlt = Color(0xFFD6453B);
  static const newGreen = softForest;
  static const newGreenAlt = softForest;
  static const dangerRed = Color(0xFFC0392B);
  static const inStockGreen = softForest;

  // Sirtlar
  static const background = cream; // kanvas — issiq krem
  static const surface = Color(0xFFFFFFFF); // kartalar / inputlar
  static const surfaceAlt = creamDeep;
  static const imagePlaceholder = Color(0xFFE6E0CC);
  static const imagePlaceholderAlt = Color(0xFFE6E0CC);

  // Matn
  static const textPrimary = ink;
  static const textPrimaryAlt = ink;
  static const textSecondary = muted;
  static const textSecondaryAlt = muted;
  static const strikethrough = muted;

  // Chegara
  static const border = rule;

  // ── Gradientlar (yumshoq, shaffof uslub) ───────────────────
  static const forestGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [forest, deepForest],
  );
  static const sunGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF6D43A), sun],
  );
}
