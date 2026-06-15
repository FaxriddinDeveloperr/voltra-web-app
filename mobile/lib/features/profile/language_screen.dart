import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/locale_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

/// Spec 2.16 — Til tanlash.
class LanguageScreen extends ConsumerWidget {
  const LanguageScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final current = ref.watch(localeProvider).languageCode;
    return Scaffold(
      appBar: AppBar(title: const Text('Til')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.screen),
        children: supportedLanguages.map((lang) {
          final selected = lang.$1 == current;
          return Container(
            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
            decoration: BoxDecoration(
              color: selected ? AppColors.primaryLight : AppColors.surface,
              borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
              border: Border.all(
                color: selected ? AppColors.forest : Colors.transparent,
                width: 1.4,
              ),
            ),
            child: ListTile(
              title: Text(lang.$2,
                  style: const TextStyle(fontWeight: FontWeight.w500)),
              trailing: selected
                  ? const Icon(Icons.check_circle, color: AppColors.primary)
                  : const Icon(Icons.radio_button_off,
                      color: AppColors.textSecondary),
              onTap: () => ref.read(localeProvider.notifier).setLocale(lang.$1),
            ),
          );
        }).toList(),
      ),
    );
  }
}
