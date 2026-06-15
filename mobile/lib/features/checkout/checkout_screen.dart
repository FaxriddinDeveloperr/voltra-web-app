import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/di/providers.dart';
import '../../core/models/catalog.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/custom_dropdown.dart';
import '../../core/widgets/custom_text_field.dart';
import '../../core/widgets/primary_button.dart';
import '../auth/auth_providers.dart';
import '../cart/cart_providers.dart';
import 'checkout_providers.dart';
import 'widgets/segmented.dart';

enum _Delivery { delivery, pickup }

enum _Customer { individual, legal }

enum _Install { self, withInstall }

/// Spec 2.8 — Buyurtma berish (Checkout).
class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  _Delivery _delivery = _Delivery.delivery;
  _Customer _customer = _Customer.individual;
  _Install _install = _Install.self;

  final _fullName = TextEditingController();
  final _phone = TextEditingController();
  // yuridik
  final _orgName = TextEditingController();
  final _inn = TextEditingController();
  final _director = TextEditingController();
  final _bank = TextEditingController();
  final _mfo = TextEditingController();
  final _oked = TextEditingController();
  final _legalAddr = TextEditingController();
  // manzil
  final _address = TextEditingController();
  final _house = TextEditingController();
  final _landmark = TextEditingController();

  Region? _region;
  City? _city;
  String? _pickupId;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).user;
    if (user != null) {
      _phone.text = Formatters.phone(user.phone).replaceFirst('+998 ', '');
      _fullName.text = user.displayName == user.phone ? '' : user.displayName;
    }
  }

  @override
  void dispose() {
    for (final c in [
      _fullName, _phone, _orgName, _inn, _director, _bank, _mfo, _oked,
      _legalAddr, _address, _house, _landmark,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  bool get _valid {
    if (_phone.text.replaceAll(RegExp(r'\D'), '').length < 9) return false;
    if (_customer == _Customer.individual && _fullName.text.trim().isEmpty) {
      return false;
    }
    if (_customer == _Customer.legal &&
        (_orgName.text.trim().isEmpty || _inn.text.trim().isEmpty)) {
      return false;
    }
    if (_delivery == _Delivery.delivery) {
      if (_region == null || _city == null || _address.text.trim().isEmpty) {
        return false;
      }
    } else if (_pickupId == null) {
      return false;
    }
    return true;
  }

  Future<void> _submit() async {
    if (!_valid) return;
    setState(() => _submitting = true);
    final cart = ref.read(cartProvider);
    final body = <String, dynamic>{
      'deliveryType': _delivery == _Delivery.delivery ? 'DELIVERY' : 'PICKUP',
      'customerType':
          _customer == _Customer.individual ? 'INDIVIDUAL' : 'LEGAL',
      'phone': Formatters.toE164(_phone.text),
      'installation': _install == _Install.self ? 'SELF' : 'WITH_INSTALL',
      'items': cart.items
          .map((l) => {'productId': l.productId, 'quantity': l.quantity})
          .toList(),
    };
    if (_customer == _Customer.individual) {
      body['fullName'] = _fullName.text.trim();
    } else {
      body.addAll({
        'orgName': _orgName.text.trim(),
        'inn': _inn.text.trim(),
        'directorName': _director.text.trim(),
        'bank': _bank.text.trim(),
        'mfo': _mfo.text.trim(),
        'oked': _oked.text.trim(),
        'legalAddress': _legalAddr.text.trim(),
      });
    }
    if (_delivery == _Delivery.delivery) {
      body.addAll({
        'region': _region!.nameUz,
        'city': _city!.nameUz,
        'address': _address.text.trim(),
        'house': _house.text.trim(),
        'landmark': _landmark.text.trim(),
      });
    } else {
      body['pickupPointId'] = _pickupId;
    }

    try {
      final order = await ref.read(apiServiceProvider).createOrder(body);
      ref.read(cartProvider.notifier).clearLocal();
      if (mounted) _showSuccess(order.orderNumber);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Buyurtma yaratilmadi. Qayta urining.')),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _showSuccess(String orderNumber) {
    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircleAvatar(
              radius: 32,
              backgroundColor: AppColors.primaryLight,
              child: Icon(Icons.check, color: AppColors.primary, size: 36),
            ),
            const SizedBox(height: AppSpacing.lg),
            const Text('Buyurtma qabul qilindi!',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
            const SizedBox(height: AppSpacing.sm),
            Text('Raqam: $orderNumber',
                style: const TextStyle(color: AppColors.textSecondary)),
          ],
        ),
        actions: [
          PrimaryButton(
            label: 'Buyurtmalarim',
            onPressed: () {
              Navigator.pop(context);
              context.go('/orders');
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(cartProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Buyurtma berish')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.screen),
        children: [
          // Yetkazib berish turi
          Segmented<_Delivery>(
            label: (v) => '',
            value: _delivery,
            onChanged: (v) => setState(() => _delivery = v),
            options: const [
              (_Delivery.delivery, 'Yetkazib berish', Icons.local_shipping_outlined),
              (_Delivery.pickup, 'Olib ketish', Icons.storefront_outlined),
            ],
          ),
          const SizedBox(height: AppSpacing.section),

          // Mijoz turi
          const Text('Mijoz', style: AppTypography.sectionTitle),
          const SizedBox(height: AppSpacing.md),
          Segmented<_Customer>(
            label: (v) => '',
            value: _customer,
            onChanged: (v) => setState(() => _customer = v),
            options: const [
              (_Customer.individual, 'Jis. shaxs', null),
              (_Customer.legal, 'Yur. shaxs', null),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          ..._customerFields(),
          const SizedBox(height: AppSpacing.section),

          // Manzil yoki pickup
          if (_delivery == _Delivery.delivery)
            ..._deliveryFields()
          else
            _pickupFields(),
          const SizedBox(height: AppSpacing.section),

          // O'rnatish
          const Text("O'rnatish", style: AppTypography.sectionTitle),
          const SizedBox(height: AppSpacing.md),
          RadioRow(
            selected: _install == _Install.self,
            title: "O'zim o'rnatib olaman",
            onTap: () => setState(() => _install = _Install.self),
          ),
          RadioRow(
            selected: _install == _Install.withInstall,
            title: "O'rnatish bilan",
            onTap: () => setState(() => _install = _Install.withInstall),
          ),
          const SizedBox(height: AppSpacing.section),

          // Xulosa
          _summary(cart.grandTotal, cart.count),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.screen),
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: AppColors.border)),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('Jami', style: AppTypography.hint),
                    Text(Formatters.price(cart.grandTotal),
                        style: AppTypography.price),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: PrimaryButton(
                  label: 'Buyurtma berish',
                  loading: _submitting,
                  onPressed: _valid ? _submit : null,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> _customerFields() {
    final phoneField = CustomTextField(
      controller: _phone,
      label: 'Telefon raqamingiz',
      hint: '90 123 45 67',
      prefixText: '+998 ',
      keyboardType: TextInputType.phone,
      onChanged: (_) => setState(() {}),
    );
    if (_customer == _Customer.individual) {
      return [
        CustomTextField(
            controller: _fullName,
            label: 'F.I.Sh.',
            onChanged: (_) => setState(() {})),
        const SizedBox(height: AppSpacing.md),
        phoneField,
      ];
    }
    return [
      CustomTextField(
          controller: _orgName,
          label: 'Tashkilot nomi',
          onChanged: (_) => setState(() {})),
      const SizedBox(height: AppSpacing.md),
      CustomTextField(
          controller: _inn,
          label: 'STIR',
          keyboardType: TextInputType.number,
          onChanged: (_) => setState(() {})),
      const SizedBox(height: AppSpacing.md),
      CustomTextField(controller: _director, label: "Direktor F.I.Sh."),
      const SizedBox(height: AppSpacing.md),
      CustomTextField(controller: _bank, label: 'Bank'),
      const SizedBox(height: AppSpacing.md),
      CustomTextField(
          controller: _mfo, label: 'MFO', keyboardType: TextInputType.number),
      const SizedBox(height: AppSpacing.md),
      CustomTextField(
          controller: _oked, label: 'OKED', keyboardType: TextInputType.number),
      const SizedBox(height: AppSpacing.md),
      CustomTextField(controller: _legalAddr, label: 'Yuridik manzil'),
      const SizedBox(height: AppSpacing.md),
      phoneField,
    ];
  }

  List<Widget> _deliveryFields() {
    final regions = ref.watch(regionsProvider);
    final cities =
        _region == null ? null : ref.watch(citiesProvider(_region!.id));
    return [
      const Text('Yetkazib berish manzili:',
          style: AppTypography.sectionTitle),
      const SizedBox(height: AppSpacing.md),
      regions.maybeWhen(
        data: (list) => CustomDropdown<Region>(
          label: 'Viloyat',
          items: list,
          value: _region,
          itemLabel: (r) => r.nameUz,
          onChanged: (r) => setState(() {
            _region = r;
            _city = null;
          }),
        ),
        orElse: () => const LinearProgressIndicator(),
      ),
      const SizedBox(height: AppSpacing.md),
      if (_region != null)
        cities!.maybeWhen(
          data: (list) => CustomDropdown<City>(
            label: 'Shahar/Tuman',
            items: list,
            value: _city,
            itemLabel: (c) => c.nameUz,
            onChanged: (c) => setState(() => _city = c),
          ),
          orElse: () => const LinearProgressIndicator(),
        ),
      const SizedBox(height: AppSpacing.md),
      CustomTextField(
          controller: _address,
          label: 'Manzil',
          onChanged: (_) => setState(() {})),
      const SizedBox(height: AppSpacing.md),
      CustomTextField(controller: _house, label: 'Uy'),
      const SizedBox(height: AppSpacing.md),
      CustomTextField(controller: _landmark, label: "Mo'ljal"),
    ];
  }

  Widget _pickupFields() {
    final points = ref.watch(pickupPointsProvider);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Buyurtmani qabul qilish punkti',
            style: AppTypography.sectionTitle),
        const SizedBox(height: AppSpacing.md),
        points.maybeWhen(
          data: (list) => Column(
            children: list
                .map((p) => RadioRow(
                      selected: _pickupId == p.id,
                      title: p.name,
                      subtitle: p.city,
                      onTap: () => setState(() => _pickupId = p.id),
                    ))
                .toList(),
          ),
          orElse: () => const LinearProgressIndicator(),
        ),
      ],
    );
  }

  Widget _summary(double total, int count) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
      ),
      child: Column(
        children: [
          const Align(
            alignment: Alignment.centerLeft,
            child: Text('Sizning buyurtmangiz',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
          ),
          const SizedBox(height: AppSpacing.md),
          _sumRow('$count ta mahsulot', Formatters.price(total)),
          _sumRow('Yetkazib berish', '0 so\'m'),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: AppSpacing.sm),
            child: Divider(),
          ),
          _sumRow('Jami:', Formatters.price(total), bold: true),
        ],
      ),
    );
  }

  Widget _sumRow(String l, String v, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(l,
              style: TextStyle(
                  fontWeight: bold ? FontWeight.w700 : FontWeight.w400,
                  fontSize: bold ? 18 : 14,
                  color:
                      bold ? AppColors.textPrimary : AppColors.textSecondary)),
          Text(v,
              style: TextStyle(
                  fontWeight: bold ? FontWeight.w700 : FontWeight.w400,
                  fontSize: bold ? 18 : 14)),
        ],
      ),
    );
  }
}
