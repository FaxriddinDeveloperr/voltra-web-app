import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../../../core/widgets/primary_button.dart';
import '../auth_providers.dart';

/// Spec 2.17 — Profil bo'sh bo'lsa Familiya/Ism so'raydi.
class ProfileSetupScreen extends ConsumerStatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  ConsumerState<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends ConsumerState<ProfileSetupScreen> {
  final _lastName = TextEditingController();
  final _firstName = TextEditingController();
  final _middleName = TextEditingController();
  bool _loading = false;

  bool get _valid =>
      _firstName.text.trim().isNotEmpty && _lastName.text.trim().isNotEmpty;

  @override
  void dispose() {
    _lastName.dispose();
    _firstName.dispose();
    _middleName.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_valid) return;
    setState(() => _loading = true);
    try {
      await ref.read(authProvider.notifier).completeProfile(
            firstName: _firstName.text.trim(),
            lastName: _lastName.text.trim(),
            middleName: _middleName.text.trim(),
          );
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
              Text("Ma'lumotlaringiz", style: AppTypography.screenTitle),
              const SizedBox(height: AppSpacing.sm),
              Text(
                "Buyurtma va arizalar uchun ismingizni kiriting",
                style: AppTypography.hint,
              ),
              const SizedBox(height: AppSpacing.xl),
              CustomTextField(
                controller: _lastName,
                label: 'Familiya',
                hint: 'Aliyev',
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppSpacing.lg),
              CustomTextField(
                controller: _firstName,
                label: 'Ism',
                hint: 'Vali',
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: AppSpacing.lg),
              CustomTextField(
                controller: _middleName,
                label: 'Sharif',
                hint: 'Akmalovich',
              ),
              const Spacer(),
              PrimaryButton(
                label: 'Saqlash',
                loading: _loading,
                onPressed: _valid ? _save : null,
              ),
              const SizedBox(height: AppSpacing.sm),
            ],
          ),
        ),
      ),
    );
  }
}
