import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'di/providers.dart';

class LocaleNotifier extends StateNotifier<Locale> {
  LocaleNotifier(this._ref) : super(Locale(_ref.read(prefsProvider).lang));
  final Ref _ref;

  Future<void> setLocale(String code) async {
    await _ref.read(prefsProvider).setLang(code);
    state = Locale(code);
  }
}

final localeProvider =
    StateNotifierProvider<LocaleNotifier, Locale>((ref) => LocaleNotifier(ref));

const supportedLanguages = [
  ('uz', 'O\'zbek'),
  ('ru', 'Русский'),
  ('en', 'English'),
];
