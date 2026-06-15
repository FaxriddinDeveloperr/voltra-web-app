import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/models/catalog.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_decorations.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/skeleton_loader.dart';
import '../../core/widgets/xit_badge.dart';
import 'services_providers.dart';

/// Spec 2.9 — Xizmatlar (2-ustun grid, "Tez kunda" badge).
class ServicesScreen extends ConsumerWidget {
  const ServicesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(servicesProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Xizmatlar')),
      body: async.when(
        loading: () => const GridSkeleton(itemCount: 4),
        error: (_, __) => Center(
          child: TextButton(
            onPressed: () => ref.invalidate(servicesProvider),
            child: const Text('Qayta urinish'),
          ),
        ),
        data: (services) => GridView.builder(
          padding: const EdgeInsets.all(AppSpacing.screen),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 14,
            crossAxisSpacing: 14,
            childAspectRatio: 1.1,
          ),
          itemCount: services.length,
          itemBuilder: (_, i) => _ServiceCard(service: services[i]),
        ),
      ),
    );
  }
}

class _ServiceCard extends StatelessWidget {
  const _ServiceCard({required this.service});
  final ServiceItem service;

  @override
  Widget build(BuildContext context) {
    final enabled = service.isActive && !service.comingSoon;
    return GestureDetector(
      onTap: enabled
          ? () => context.push(
                '/services/apply?id=${service.id}'
                '&name=${Uri.encodeComponent(service.nameUz)}'
                '&power=${service.hasPowerField ? 1 : 0}',
              )
          : null,
      child: Opacity(
        opacity: enabled ? 1 : 0.7,
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: AppDecorations.card(),
          child: Stack(
            children: [
              if (service.comingSoon)
                const Align(
                  alignment: Alignment.topLeft,
                  child: StatusPill(label: 'Tez kunda'),
                ),
              Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.cleaning_services_outlined,
                        size: 36, color: AppColors.forest),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      service.nameUz,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          fontWeight: FontWeight.w600, fontSize: 14),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
