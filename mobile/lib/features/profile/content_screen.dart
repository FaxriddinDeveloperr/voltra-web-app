import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/catalog.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

final _contentProvider =
    FutureProvider.family<AppContent, String>((ref, key) {
  return ref.watch(apiServiceProvider).content(key);
});

/// Spec 2.15 — Biz haqimizda / Oferta.
class ContentScreen extends ConsumerWidget {
  const ContentScreen({super.key, required this.contentKey});
  final String contentKey;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(_contentProvider(contentKey));
    final fallbackTitle =
        contentKey == 'about' ? 'Biz haqimizda' : 'Oferta va shartlar';

    return Scaffold(
      appBar: AppBar(title: Text(fallbackTitle)),
      body: async.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, __) => Center(
          child: TextButton(
            onPressed: () => ref.invalidate(_contentProvider(contentKey)),
            child: const Text('Qayta urinish'),
          ),
        ),
        data: (content) => ListView(
          padding: const EdgeInsets.all(AppSpacing.screen),
          children: [
            Text(content.titleUz ?? fallbackTitle,
                style: AppTypography.screenTitle),
            const SizedBox(height: AppSpacing.lg),
            Text(content.bodyUz ?? '',
                style: const TextStyle(height: 1.6, fontSize: 15)),
          ],
        ),
      ),
    );
  }
}
