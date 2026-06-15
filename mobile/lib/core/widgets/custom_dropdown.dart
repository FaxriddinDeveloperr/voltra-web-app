import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// Spec 1.4.8 — CustomDropdown (och kulrang fon, chevron, radius 12).
class CustomDropdown<T> extends StatelessWidget {
  const CustomDropdown({
    super.key,
    required this.items,
    required this.label,
    required this.value,
    required this.onChanged,
    required this.itemLabel,
    this.hint,
  });

  final List<T> items;
  final String? label;
  final T? value;
  final ValueChanged<T?> onChanged;
  final String Function(T) itemLabel;
  final String? hint;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
        ],
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppSpacing.inputRadius),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<T>(
              value: value,
              isExpanded: true,
              hint: Text(
                hint ?? 'Tanlang',
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 14,
                ),
              ),
              icon: const Icon(Icons.keyboard_arrow_down,
                  color: AppColors.textSecondary),
              items: items
                  .map((e) => DropdownMenuItem<T>(
                        value: e,
                        child: Text(itemLabel(e),
                            style: const TextStyle(fontSize: 14)),
                      ))
                  .toList(),
              onChanged: onChanged,
            ),
          ),
        ),
      ],
    );
  }
}
