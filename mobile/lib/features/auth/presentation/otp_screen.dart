import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/widgets/primary_button.dart';
import '../../cart/cart_providers.dart';
import '../../favorites/favorites_providers.dart';
import '../auth_providers.dart';

/// Spec 2.17 — OTP kodni kiritish (4-6 katak).
class OtpScreen extends ConsumerStatefulWidget {
  const OtpScreen({super.key, required this.phone});
  final String phone;

  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> {
  static const _len = 6;
  final _controller = TextEditingController();
  final _focus = FocusNode();
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _focus.requestFocus());
  }

  @override
  void dispose() {
    _controller.dispose();
    _focus.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_controller.text.length < 4) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ref
          .read(authProvider.notifier)
          .verifyOtp(widget.phone, _controller.text);
      // Auth holatiga qarab router avtomatik yo'naltiradi.
      ref.read(cartProvider.notifier).load();
      ref.read(favoritesProvider.notifier).load();
    } catch (_) {
      setState(() => _error = "Kod noto'g'ri yoki muddati tugagan");
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.screen),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Tasdiqlash kodi', style: AppTypography.screenTitle),
              const SizedBox(height: AppSpacing.sm),
              Text(
                '${Formatters.phone(widget.phone)} raqamiga yuborilgan kodni kiriting',
                style: AppTypography.hint,
              ),
              const SizedBox(height: AppSpacing.xl),
              _OtpBoxes(
                controller: _controller,
                focus: _focus,
                length: _len,
                onChanged: (v) {
                  setState(() => _error = null);
                  if (v.length == _len) _submit();
                },
              ),
              if (_error != null) ...[
                const SizedBox(height: AppSpacing.md),
                Text(_error!,
                    style: const TextStyle(color: AppColors.dangerRed)),
              ],
              const SizedBox(height: AppSpacing.lg),
              Text(
                'Dev rejimi: kod 123456',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
              ),
              const Spacer(),
              PrimaryButton(
                label: 'Tasdiqlash',
                loading: _loading,
                onPressed: _submit,
              ),
              const SizedBox(height: AppSpacing.sm),
            ],
          ),
        ),
      ),
    );
  }
}

class _OtpBoxes extends StatelessWidget {
  const _OtpBoxes({
    required this.controller,
    required this.focus,
    required this.length,
    required this.onChanged,
  });

  final TextEditingController controller;
  final FocusNode focus;
  final int length;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Ko'rinmas matn maydoni (klaviatura kirishi)
        Opacity(
          opacity: 0,
          child: TextField(
            controller: controller,
            focusNode: focus,
            keyboardType: TextInputType.number,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(length),
            ],
            onChanged: onChanged,
          ),
        ),
        GestureDetector(
          onTap: focus.requestFocus,
          child: ValueListenableBuilder<TextEditingValue>(
            valueListenable: controller,
            builder: (context, value, _) {
              return Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(length, (i) {
                  final filled = i < value.text.length;
                  final active = i == value.text.length;
                  return Container(
                    width: 48,
                    height: 56,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius:
                          BorderRadius.circular(AppSpacing.inputRadius),
                      border: Border.all(
                        color: active
                            ? AppColors.primaryAccent
                            : AppColors.border,
                        width: active ? 1.6 : 1,
                      ),
                    ),
                    child: Text(
                      filled ? value.text[i] : '',
                      style: const TextStyle(
                          fontSize: 22, fontWeight: FontWeight.w700),
                    ),
                  );
                }),
              );
            },
          ),
        ),
      ],
    );
  }
}
