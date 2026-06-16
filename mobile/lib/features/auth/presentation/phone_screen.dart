import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/widgets/app_logo.dart';
import '../../../core/widgets/primary_button.dart';
import '../auth_providers.dart';

/// Spec 2.17 — Telefon raqami kiritish (+998 maska).
class PhoneScreen extends ConsumerStatefulWidget {
  const PhoneScreen({super.key});

  @override
  ConsumerState<PhoneScreen> createState() => _PhoneScreenState();
}

class _PhoneScreenState extends ConsumerState<PhoneScreen> {
  final _controller = TextEditingController();
  bool _loading = false;
  String? _error;

  bool get _valid =>
      _controller.text.replaceAll(RegExp(r'\D'), '').length == 9;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_valid) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    final phone = Formatters.toE164(_controller.text);
    try {
      await ref.read(authProvider.notifier).sendOtp(phone);
      if (mounted) context.push('/auth/otp?phone=${Uri.encodeComponent(phone)}');
    } catch (_) {
      setState(() => _error = 'Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.of(context);
    return Scaffold(
      body: Column(
        children: [
          // ── Teal hero: logo + brend va'dasi ──
          Container(
            width: double.infinity,
            padding: EdgeInsets.fromLTRB(
                AppSpacing.xl, media.padding.top + 56, AppSpacing.xl, 44),
            decoration: const BoxDecoration(
              // oq, biroz iliq-sariq
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFFFFF7D6), Color(0xFFFFFFFF)],
              ),
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(36)),
              boxShadow: AppColors.softShadow,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const AppLogo(size: 52, showWordmark: true),
                const SizedBox(height: AppSpacing.xxl),
                Text(
                  'Quyosh allaqachon\nishlayapti.',
                  style: AppTypography.screenTitle.copyWith(
                    fontSize: 30,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                Text(
                  'Quyosh energiyasi yechimlari — tomingiz aktivga aylansin.',
                  style: AppTypography.hint.copyWith(height: 1.45),
                ),
              ],
            ),
          ),

          // ── Pastki oq qism: input + tugma ──
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: AppSpacing.sm),
                  Text('Telefon raqamingiz', style: AppTypography.sectionTitle),
                  const SizedBox(height: AppSpacing.xs),
                  Text('Tasdiqlash kodi SMS orqali yuboriladi',
                      style: AppTypography.hint),
                  const SizedBox(height: AppSpacing.lg),
                  TextField(
                    controller: _controller,
                    keyboardType: TextInputType.phone,
                    onChanged: (_) => setState(() {}),
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(9),
                      _PhoneMaskFormatter(),
                    ],
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.w600),
                    decoration: const InputDecoration(
                      prefixText: '+998  ',
                      prefixStyle: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                      hintText: '90 123 45 67',
                    ),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: AppSpacing.sm),
                    Text(_error!,
                        style: const TextStyle(color: AppColors.dangerRed)),
                  ],
                  const Spacer(),
                  PrimaryButton(
                    label: 'Davom etish',
                    loading: _loading,
                    onPressed: _valid ? _submit : null,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Center(
                    child: Text(
                      'Davom etish orqali shartlarga rozilik bildirasiz',
                      style: AppTypography.hint.copyWith(fontSize: 12),
                    ),
                  ),
                  SizedBox(height: media.padding.bottom + AppSpacing.sm),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// "90 123 45 67" formatida maska.
class _PhoneMaskFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final digits = newValue.text.replaceAll(RegExp(r'\D'), '');
    final buf = StringBuffer();
    for (int i = 0; i < digits.length && i < 9; i++) {
      if (i == 2 || i == 5 || i == 7) buf.write(' ');
      buf.write(digits[i]);
    }
    final text = buf.toString();
    return TextEditingValue(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }
}
