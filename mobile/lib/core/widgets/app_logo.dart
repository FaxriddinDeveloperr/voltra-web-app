import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Spec 1.5 — Turkuaz kvadrat ichida solar-panel uslubidagi oq logo.
class AppLogo extends StatelessWidget {
  const AppLogo({super.key, this.size = 56, this.showWordmark = false});
  final double size;
  final bool showWordmark;

  @override
  Widget build(BuildContext context) {
    final mark = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: AppColors.primaryAccent,
        borderRadius: BorderRadius.circular(size * 0.25),
      ),
      child: CustomPaint(painter: _SolarPainter()),
    );

    if (!showWordmark) return mark;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(width: size, height: size, child: mark),
        const SizedBox(width: 8),
        const Text(
          'Quyoshli',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}

class _SolarPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    final w = size.width;
    final h = size.height;
    // Ikkita zigzag plitka (solar panel uslubi)
    final tile = Path()
      ..moveTo(w * 0.22, h * 0.30)
      ..lineTo(w * 0.50, h * 0.30)
      ..lineTo(w * 0.40, h * 0.50)
      ..lineTo(w * 0.62, h * 0.50)
      ..lineTo(w * 0.34, h * 0.74)
      ..lineTo(w * 0.46, h * 0.54)
      ..lineTo(w * 0.26, h * 0.54)
      ..close();
    canvas.drawPath(tile, p);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
