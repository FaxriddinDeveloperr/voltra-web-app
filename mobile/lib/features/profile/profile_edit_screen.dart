import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/di/providers.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/custom_text_field.dart';
import '../../core/widgets/primary_button.dart';
import '../auth/auth_providers.dart';
import '../cart/cart_providers.dart';
import '../favorites/favorites_providers.dart';

/// Spec 2.13 — Profilni tahrirlash.
class ProfileEditScreen extends ConsumerStatefulWidget {
  const ProfileEditScreen({super.key});

  @override
  ConsumerState<ProfileEditScreen> createState() => _ProfileEditScreenState();
}

class _ProfileEditScreenState extends ConsumerState<ProfileEditScreen> {
  late final TextEditingController _lastName;
  late final TextEditingController _firstName;
  late final TextEditingController _middleName;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final u = ref.read(authProvider).user;
    _lastName = TextEditingController(text: u?.lastName ?? '');
    _firstName = TextEditingController(text: u?.firstName ?? '');
    _middleName = TextEditingController(text: u?.middleName ?? '');
  }

  @override
  void dispose() {
    _lastName.dispose();
    _firstName.dispose();
    _middleName.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      final user = await ref.read(apiServiceProvider).updateMe({
        'firstName': _firstName.text.trim(),
        'lastName': _lastName.text.trim(),
        'middleName': _middleName.text.trim(),
      });
      ref.read(authProvider.notifier).setUser(user);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Saqlandi')),
        );
        Navigator.pop(context);
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _delete() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Profilni o\'chirish'),
        content: const Text(
            'Profilingiz va barcha ma\'lumotlaringiz o\'chiriladi. Davom etasizmi?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Bekor qilish')),
          TextButton(
              onPressed: () => Navigator.pop(ctx, true),
              child: const Text("O'chirish",
                  style: TextStyle(color: AppColors.dangerRed))),
        ],
      ),
    );
    if (ok != true) return;
    try {
      await ref.read(apiServiceProvider).deleteMe();
    } catch (_) {}
    ref.read(cartProvider.notifier).clearLocal();
    ref.read(favoritesProvider.notifier).clear();
    await ref.read(authProvider.notifier).logout();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profilni tahrirlash')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.screen),
        children: [
          const Center(
            child: CircleAvatar(
              radius: 44,
              backgroundColor: AppColors.primaryLight,
              child: Icon(Icons.person, size: 48, color: AppColors.primary),
            ),
          ),
          const SizedBox(height: AppSpacing.section),
          CustomTextField(controller: _lastName, label: 'Familiya'),
          const SizedBox(height: AppSpacing.md),
          CustomTextField(controller: _firstName, label: 'Ism'),
          const SizedBox(height: AppSpacing.md),
          CustomTextField(controller: _middleName, label: 'Sharif'),
          const SizedBox(height: AppSpacing.xl),
          Center(
            child: TextButton(
              onPressed: _delete,
              child: const Text("Profilni o'chirish",
                  style: TextStyle(color: AppColors.dangerRed)),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.screen),
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(52),
                    side: BorderSide(color: AppColors.border),
                    shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(AppSpacing.buttonRadius)),
                  ),
                  child: Text('Bekor qilish',
                      style: TextStyle(color: AppColors.textPrimary)),
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: PrimaryButton(
                    label: 'Saqlash', loading: _saving, onPressed: _save),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
