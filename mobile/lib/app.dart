import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/locale_provider.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_colors.dart';
import 'core/theme/app_theme.dart';
import 'core/theme_mode_provider.dart';
import 'l10n/app_localizations.dart';

class QuyoshliApp extends ConsumerWidget {
  const QuyoshliApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final locale = ref.watch(localeProvider);
    final mode = ref.watch(themeModeProvider);

    final platformDark =
        MediaQuery.platformBrightnessOf(context) == Brightness.dark;
    final isDark =
        mode == ThemeMode.dark || (mode == ThemeMode.system && platformDark);

    // Global rang rejimini build'dan oldin o'rnatamiz (statik tokenlar uchun).
    AppColors.dark = isDark;

    return MaterialApp.router(
      // isDark o'zgarganda butun daraxt qayta quriladi (joylashuv saqlanadi —
      // GoRouter instansiyasi barqaror).
      key: ValueKey(isDark),
      title: 'Voltra',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      locale: locale,
      routerConfig: router,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
    );
  }
}
