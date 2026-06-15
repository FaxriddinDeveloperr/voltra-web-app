import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Spec 1.4.4 — XitBadge (olov ikonka + "Xit", turkuaz/ko'k gradient).
class XitBadge extends StatelessWidget {
  const XitBadge({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primaryAccent, Color(0xFF2BB7E0)],
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.local_fire_department, size: 13, color: Colors.white),
          SizedBox(width: 3),
          Text(
            'Xit',
            style: TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

/// Yashil "Yangi"/"Tez kunda" pill (spec 8.9).
class StatusPill extends StatelessWidget {
  const StatusPill({super.key, required this.label});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.newGreen,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
