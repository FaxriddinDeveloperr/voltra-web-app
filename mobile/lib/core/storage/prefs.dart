import 'package:shared_preferences/shared_preferences.dart';

/// Til va sozlamalar (spec 3 — shared_preferences).
class Prefs {
  Prefs(this._p);
  final SharedPreferences _p;

  static const _kLang = 'lang';

  String get lang => _p.getString(_kLang) ?? 'uz';
  Future<void> setLang(String code) => _p.setString(_kLang, code);
}
