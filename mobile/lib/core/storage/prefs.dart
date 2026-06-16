import 'package:shared_preferences/shared_preferences.dart';

/// Til va sozlamalar (spec 3 — shared_preferences).
class Prefs {
  Prefs(this._p);
  final SharedPreferences _p;

  static const _kLang = 'lang';
  static const _kThemeMode = 'theme_mode';

  String get lang => _p.getString(_kLang) ?? 'uz';
  Future<void> setLang(String code) => _p.setString(_kLang, code);

  // 'light' | 'dark' | 'system'
  String get themeMode => _p.getString(_kThemeMode) ?? 'light';
  Future<void> setThemeMode(String mode) => _p.setString(_kThemeMode, mode);
}
