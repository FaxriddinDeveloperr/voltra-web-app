import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Spec 1.4.10 — QuantitySelector ( (−) 1 (+) doira tugmalar, turkuaz).
class QuantitySelector extends StatelessWidget {
  const QuantitySelector({
    super.key,
    required this.quantity,
    required this.onChanged,
    this.min = 1,
    this.max = 9999,
  });

  final int quantity;
  final ValueChanged<int> onChanged;
  final int min;
  final int max;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _circle(
          icon: Icons.remove,
          enabled: quantity > min,
          onTap: () => onChanged(quantity - 1),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: Text(
            '$quantity',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
        ),
        _circle(
          icon: Icons.add,
          enabled: quantity < max,
          onTap: () => onChanged(quantity + 1),
        ),
      ],
    );
  }

  Widget _circle({
    required IconData icon,
    required bool enabled,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: enabled ? AppColors.primaryAccent : AppColors.border,
            width: 1.4,
          ),
        ),
        child: Icon(
          icon,
          size: 18,
          color: enabled ? AppColors.primaryAccent : AppColors.border,
        ),
      ),
    );
  }
}
