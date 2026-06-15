import 'package:flutter/material.dart';
import '../theme/app_typography.dart';
import '../theme/app_colors.dart';
import '../l10n_ext.dart';

/// Spec 1.4.6 — SectionHeader (chapda sarlavha, o'ngda "Hammasi >").
class SectionHeader extends StatelessWidget {
  const SectionHeader({super.key, required this.title, this.onSeeAll});

  final String title;
  final VoidCallback? onSeeAll;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(title, style: AppTypography.sectionTitle),
        ),
        if (onSeeAll != null)
          GestureDetector(
            onTap: onSeeAll,
            behavior: HitTestBehavior.opaque,
            child: Row(
              children: [
                Text(context.l10n.seeAll, style: AppTypography.link),
                const Icon(Icons.chevron_right,
                    size: 18, color: AppColors.tealText),
              ],
            ),
          ),
      ],
    );
  }
}
