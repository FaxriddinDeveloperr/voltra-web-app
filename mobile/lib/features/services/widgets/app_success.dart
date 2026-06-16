import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/widgets/primary_button.dart';

/// Ariza muvaffaqiyatli yuborilganda ko'rsatiladi.
void showAppSuccess(BuildContext context) {
  showDialog<void>(
    context: context,
    barrierDismissible: false,
    builder: (_) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircleAvatar(
            radius: 32,
            backgroundColor: AppColors.accent,
            child: Icon(Icons.check, color: AppColors.onAccent, size: 36),
          ),
          SizedBox(height: AppSpacing.lg),
          Text('Arizangiz qabul qilindi!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
          SizedBox(height: AppSpacing.sm),
          Text("Tez orada siz bilan bog'lanamiz",
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.textSecondary)),
        ],
      ),
      actions: [
        PrimaryButton(
          label: 'Mening arizalarim',
          onPressed: () {
            Navigator.pop(context);
            context.go('/applications');
          },
        ),
      ],
    ),
  );
}
