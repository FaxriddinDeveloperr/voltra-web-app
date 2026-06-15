import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/models/cart.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_decorations.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/empty_state.dart';
import '../../core/widgets/network_img.dart';
import '../../core/widgets/primary_button.dart';
import '../../core/widgets/quantity_selector.dart';
import 'cart_providers.dart';

/// Spec 2.7 — Savat.
class CartScreen extends ConsumerStatefulWidget {
  const CartScreen({super.key});

  @override
  ConsumerState<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends ConsumerState<CartScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => ref.read(cartProvider.notifier).load(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(cartProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Savat'), automaticallyImplyLeading: false),
      body: cart.items.isEmpty
          ? EmptyState(
              icon: Icons.shopping_cart_outlined,
              title: 'Savatingizda hali biror narsa yo\'q',
              subtitle:
                  'Asosiy sahifadan boshlang yoki kerakli mahsulotni toping',
              actionLabel: 'Bosh sahifa',
              onAction: () => context.go('/home'),
            )
          : Column(
              children: [
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(AppSpacing.screen),
                    children: [
                      Text('Tayyor yechimlar',
                          style: AppTypography.sectionTitle),
                      const SizedBox(height: AppSpacing.md),
                      ...cart.items.map((line) => _CartItemCard(line: line)),
                      const SizedBox(height: AppSpacing.lg),
                      _Summary(cart: cart),
                    ],
                  ),
                ),
                _BottomBar(cart: cart),
              ],
            ),
    );
  }
}

class _CartItemCard extends ConsumerWidget {
  const _CartItemCard({required this.line});
  final CartLine line;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final p = line.product;
    final notifier = ref.read(cartProvider.notifier);

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: AppDecorations.card(),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(AppSpacing.smallImageRadius),
                child: SizedBox(
                    width: 72, height: 72, child: NetworkImg(url: p.firstImage)),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p.nameUz,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: AppTypography.productName),
                    const SizedBox(height: 4),
                    if (p.hasDiscount)
                      Text(Formatters.price(p.oldPrice!),
                          style: AppTypography.oldPrice),
                    Text(Formatters.price(p.price),
                        style: AppTypography.price.copyWith(fontSize: 16)),
                    const SizedBox(height: 2),
                    Text('Sotuvda mavjud: ${p.stock} dona',
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline,
                    color: AppColors.forest),
                onPressed: () => notifier.remove(line.id),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              QuantitySelector(
                quantity: line.quantity,
                max: p.stock,
                onChanged: (q) => notifier.updateQty(line.id, q),
              ),
              Text(Formatters.price(line.lineTotal),
                  style: AppTypography.price.copyWith(fontSize: 16)),
            ],
          ),
        ],
      ),
    );
  }
}

class _Summary extends StatelessWidget {
  const _Summary({required this.cart});
  final Cart cart;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: AppDecorations.surface(),
      child: Column(
        children: [
          const Align(
            alignment: Alignment.centerLeft,
            child: Text('Sizning buyurtmangiz',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
          ),
          const SizedBox(height: AppSpacing.md),
          _row('${cart.count} ta maxsulot', Formatters.price(cart.itemsTotal)),
          if (cart.discountTotal > 0)
            _row('Maxsulotlarga chegirma',
                '-${Formatters.price(cart.discountTotal)}',
                valueColor: AppColors.discountRed),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: AppSpacing.sm),
            child: Divider(),
          ),
          _row('Jami:', Formatters.price(cart.grandTotal), bold: true),
        ],
      ),
    );
  }

  Widget _row(String label, String value,
      {bool bold = false, Color? valueColor}) {
    final style = TextStyle(
      fontSize: bold ? 18 : 14,
      fontWeight: bold ? FontWeight.w700 : FontWeight.w400,
      color: valueColor ?? AppColors.textPrimary,
    );
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: TextStyle(
                  fontSize: bold ? 18 : 14,
                  fontWeight: bold ? FontWeight.w700 : FontWeight.w400,
                  color: bold ? AppColors.textPrimary : AppColors.textSecondary)),
          Text(value, style: style),
        ],
      ),
    );
  }
}

class _BottomBar extends StatelessWidget {
  const _BottomBar({required this.cart});
  final Cart cart;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.screen),
        child: PrimaryButton(
          label: 'Buyurtma berish',
          onPressed: () => context.push('/checkout'),
        ),
      ),
    );
  }
}
