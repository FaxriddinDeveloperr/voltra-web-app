import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/models/order.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_decorations.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/empty_state.dart';
import '../../core/widgets/skeleton_loader.dart';
import 'orders_providers.dart';

/// Spec 2.14 — Mening buyurtmalarim.
class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  static const _statusLabels = {
    'NEW': 'Yangi',
    'CONFIRMED': 'Tasdiqlangan',
    'PROCESSING': 'Jarayonda',
    'SHIPPED': 'Yo\'lda',
    'DELIVERED': 'Yetkazilgan',
    'CANCELLED': 'Bekor qilingan',
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(ordersProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Mening buyurtmalarim')),
      body: async.when(
        loading: () => const GridSkeleton(itemCount: 4),
        error: (_, __) => Center(
          child: TextButton(
            onPressed: () => ref.invalidate(ordersProvider),
            child: const Text('Qayta urinish'),
          ),
        ),
        data: (orders) {
          if (orders.isEmpty) {
            return const EmptyState(
              icon: Icons.shopping_bag_outlined,
              title: 'Buyurtmalar yo\'q',
            );
          }
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(ordersProvider);
              await ref.read(ordersProvider.future);
            },
            child: ListView.separated(
              padding: const EdgeInsets.all(AppSpacing.screen),
              itemCount: orders.length,
              separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
              itemBuilder: (_, i) => _OrderCard(
                order: orders[i],
                statusLabel:
                    _statusLabels[orders[i].status] ?? orders[i].status,
              ),
            ),
          );
        },
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  const _OrderCard({required this.order, required this.statusLabel});
  final Order order;
  final String statusLabel;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: AppDecorations.card(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('№ ${order.orderNumber}',
                  style: const TextStyle(fontWeight: FontWeight.w700)),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(statusLabel,
                    style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.primary)),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            '${order.items.length} ta mahsulot • '
            '${order.createdAt.day}.${order.createdAt.month}.${order.createdAt.year}',
            style: TextStyle(
                fontSize: 13, color: AppColors.textSecondary),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: AppSpacing.sm),
            child: Divider(),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Jami:', style: AppTypography.hint),
              Text(Formatters.price(order.grandTotal),
                  style: AppTypography.price.copyWith(fontSize: 16)),
            ],
          ),
        ],
      ),
    );
  }
}
