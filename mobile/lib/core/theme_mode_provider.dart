import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'di/providers.dart';

ThemeMode _parse(String v) => switch (v) {
      'dark' => ThemeMode.dark,
      'system' => ThemeMode.system,
      _ => ThemeMode.light,
    };

String _serialize(ThemeMode m) => switch (m) {
      ThemeMode.dark => 'dark',
      ThemeMode.system => 'system',
      ThemeMode.light => 'light',
    };

class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  ThemeModeNotifier(this._ref) : super(_parse(_ref.read(prefsProvider).themeMode));
  final Ref _ref;

  Future<void> set(ThemeMode mode) async {
    state = mode;
    await _ref.read(prefsProvider).setThemeMode(_serialize(mode));
  }
}

final themeModeProvider =
    StateNotifierProvider<ThemeModeNotifier, ThemeMode>(
  (ref) => ThemeModeNotifier(ref),
);
