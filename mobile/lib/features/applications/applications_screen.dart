import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/models/order.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_decorations.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/empty_state.dart';
import '../../core/widgets/skeleton_loader.dart';
import 'applications_providers.dart';

/// Spec 2.14 — Mening arizalarim.
class ApplicationsScreen extends ConsumerWidget {
  const ApplicationsScreen({super.key});

  static const _typeLabels = {
    'SERVICE': 'Xizmat arizasi',
    'DEALER': 'Diler arizasi',
    'SELLER': 'Savdo vakili arizasi',
    'MASTER': 'Usta arizasi',
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(applicationsProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Mening arizalarim')),
      body: async.when(
        loading: () => const GridSkeleton(itemCount: 4),
        error: (_, __) => Center(
          child: TextButton(
            onPressed: () => ref.invalidate(applicationsProvider),
            child: const Text('Qayta urinish'),
          ),
        ),
        data: (apps) {
          if (apps.isEmpty) {
            return const EmptyState(
              icon: Icons.grid_view_outlined,
              title: 'Arizalar yo\'q :(',
            );
          }
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(applicationsProvider);
              await ref.read(applicationsProvider.future);
            },
            child: ListView.separated(
              padding: const EdgeInsets.all(AppSpacing.screen),
              itemCount: apps.length,
              separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
              itemBuilder: (_, i) => _AppCard(
                app: apps[i],
                typeLabel: _typeLabels[apps[i].type] ?? 'Ariza',
              ),
            ),
          );
        },
      ),
    );
  }
}

class _AppCard extends StatelessWidget {
  const _AppCard({required this.app, required this.typeLabel});
  final Application app;
  final String typeLabel;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: AppDecorations.card(),
      child: Row(
        children: [
          const CircleAvatar(
            backgroundColor: AppColors.primaryLight,
            child: Icon(Icons.assignment_outlined, color: AppColors.primary),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(typeLabel,
                    style: const TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 2),
                Text(
                  '${app.createdAt.day}.${app.createdAt.month}.${app.createdAt.year}',
                  style: const TextStyle(
                      fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          _StatusChip(status: app.status),
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  const _StatusChip({required this.status});
  final String status;

  @override
  Widget build(BuildContext context) {
    final label = switch (status) {
      'NEW' => 'Yangi',
      'PROCESSING' => 'Jarayonda',
      'DONE' => 'Bajarildi',
      _ => status,
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(label,
          style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.primary)),
    );
  }
}
