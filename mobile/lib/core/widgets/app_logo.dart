import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

/// Voltra logo — geometrik "V" (checkmark + chaqmoq), Sun sariq.
/// Brend kitobi 02 — Logo System.
class AppLogo extends StatelessWidget {
  const AppLogo({
    super.key,
    this.size = 56,
    this.showWordmark = false,
    this.onDark = false,
  });

  final double size;
  final bool showWordmark;
  final bool onDark; // to'q fonda — V to'g'ridan-to'g'ri (plitkasiz)

  @override
  Widget build(BuildContext context) {
    final mark = onDark
        ? SizedBox(
            width: size,
            height: size,
            child: CustomPaint(painter: _VMarkPainter(AppColors.sun)),
          )
        : Container(
            width: size,
            height: size,
            padding: EdgeInsets.all(size * 0.2),
            decoration: BoxDecoration(
              gradient: AppColors.forestGradient,
              borderRadius: BorderRadius.circular(size * 0.26),
            ),
            child: CustomPaint(painter: _VMarkPainter(AppColors.sun)),
          );

    if (!showWordmark) return mark;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        mark,
        SizedBox(width: size * 0.28),
        Text(
          'VOLTRA',
          style: GoogleFonts.inter(
            fontSize: size * 0.52,
            fontWeight: FontWeight.w800,
            letterSpacing: size * 0.02,
            color: onDark ? AppColors.cream : AppColors.forest,
          ),
        ),
      ],
    );
  }
}

/// V belgisi: chap qalin diagonal + o'ngda ikki ofset uchburchak (bolt).
class _VMarkPainter extends CustomPainter {
  _VMarkPainter(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final p = Paint()
      ..color = color
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    // Chap qalin diagonal limb (yuqori-chapdan past-markazga)
    final left = Path()
      ..moveTo(w * 0.04, h * 0.06)
      ..lineTo(w * 0.34, h * 0.06)
      ..lineTo(w * 0.66, h * 0.98)
      ..lineTo(w * 0.40, h * 0.98)
      ..close();
    canvas.drawPath(left, p);

    // O'ng yuqori uchburchak (katta — checkmark)
    final topRight = Path()
      ..moveTo(w * 0.58, h * 0.06)
      ..lineTo(w * 0.98, h * 0.06)
      ..lineTo(w * 0.62, h * 0.56)
      ..close();
    canvas.drawPath(topRight, p);

    // O'ng past ofset uchburchak (chaqmoq — harakat)
    final bottomRight = Path()
      ..moveTo(w * 0.66, h * 0.50)
      ..lineTo(w * 0.98, h * 0.50)
      ..lineTo(w * 0.74, h * 0.92)
      ..close();
    canvas.drawPath(bottomRight, p);
  }

  @override
  bool shouldRepaint(covariant _VMarkPainter old) => old.color != color;
}
