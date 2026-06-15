import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/models/catalog.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/custom_dropdown.dart';
import '../../core/widgets/custom_text_field.dart';
import '../../core/widgets/primary_button.dart';
import '../auth/auth_providers.dart';
import '../checkout/checkout_providers.dart';
import '../applications/applications_providers.dart';
import 'widgets/app_success.dart';

/// Spec 2.10 — Xizmat ariza formasi.
class ServiceFormScreen extends ConsumerStatefulWidget {
  const ServiceFormScreen({
    super.key,
    required this.serviceId,
    required this.serviceName,
    required this.hasPowerField,
  });
  final String serviceId;
  final String serviceName;
  final bool hasPowerField;

  @override
  ConsumerState<ServiceFormScreen> createState() => _ServiceFormScreenState();
}

class _ServiceFormScreenState extends ConsumerState<ServiceFormScreen> {
  static const _powers = ['3 kW', '5 kW', '8 kW', '10 kW', '15 kW', 'Boshqa'];

  final _fullName = TextEditingController();
  final _phone = TextEditingController();
  final _comment = TextEditingController();
  String? _power;
  Region? _region;
  City? _city;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).user;
    if (user != null) {
      _phone.text = Formatters.phone(user.phone).replaceFirst('+998 ', '');
      if (user.displayName != user.phone) _fullName.text = user.displayName;
    }
  }

  @override
  void dispose() {
    _fullName.dispose();
    _phone.dispose();
    _comment.dispose();
    super.dispose();
  }

  bool get _valid =>
      _fullName.text.trim().isNotEmpty &&
      _phone.text.replaceAll(RegExp(r'\D'), '').length == 9 &&
      _region != null &&
      _city != null &&
      (!widget.hasPowerField || _power != null);

  Future<void> _submit() async {
    if (!_valid) return;
    setState(() => _submitting = true);
    try {
      await ref.read(apiServiceProvider).createApplication({
        'type': 'SERVICE',
        'serviceId': widget.serviceId,
        if (_power != null) 'power': _power,
        'region': _region!.nameUz,
        'city': _city!.nameUz,
        'fullName': _fullName.text.trim(),
        'phone': Formatters.toE164(_phone.text),
        'comment': _comment.text.trim(),
      });
      ref.invalidate(applicationsProvider);
      if (mounted) showAppSuccess(context);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ariza yuborilmadi')),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final regions = ref.watch(regionsProvider);
    final cities =
        _region == null ? null : ref.watch(citiesProvider(_region!.id));

    return Scaffold(
      appBar: AppBar(),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.screen),
        children: [
          Text(widget.serviceName, style: AppTypography.screenTitle),
          const SizedBox(height: AppSpacing.section),

          const Text('Xizmat tafsilotlari',
              style: AppTypography.sectionTitle),
          const SizedBox(height: AppSpacing.md),
          if (widget.hasPowerField) ...[
            CustomDropdown<String>(
              label: 'Quvvat',
              items: _powers,
              value: _power,
              itemLabel: (e) => e,
              onChanged: (v) => setState(() => _power = v),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
          CustomTextField(
              controller: _comment, label: 'Izoh', maxLines: 4),
          const SizedBox(height: AppSpacing.section),

          const Text('Manzil', style: AppTypography.sectionTitle),
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
          const SizedBox(height: AppSpacing.section),

          const Text('Mijoz', style: AppTypography.sectionTitle),
          const SizedBox(height: AppSpacing.md),
          CustomTextField(
              controller: _fullName,
              label: 'F.I.Sh.',
              onChanged: (_) => setState(() {})),
          const SizedBox(height: AppSpacing.md),
          CustomTextField(
              controller: _phone,
              label: 'Telefon raqamingiz',
              hint: '90 123 45 67',
              prefixText: '+998 ',
              keyboardType: TextInputType.phone,
              onChanged: (_) => setState(() {})),
          const SizedBox(height: 100),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.screen),
          child: PrimaryButton(
            label: 'Arizani yuboring',
            loading: _submitting,
            onPressed: _valid ? _submit : null,
          ),
        ),
      ),
    );
  }
}
