import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

/// Voltra logo — oq plitka + nozik border, ikki tonli "V" (to'q + sariq chaqmoq).
class AppLogo extends StatelessWidget {
  const AppLogo({
    super.key,
    this.size = 56,
    this.showWordmark = false,
    this.onDark = false,
  });

  final double size;
  final bool showWordmark;
  final bool onDark; // qorong'i fon ustida — oq V + sariq chaqmoq

  @override
  Widget build(BuildContext context) {
    final painter = onDark
        ? _VMarkPainter(main: Colors.white, bolt: AppColors.accent)
        : _VMarkPainter(main: AppColors.ink, bolt: AppColors.accent);

    final mark = Container(
      width: size,
      height: size,
      padding: EdgeInsets.all(size * 0.22),
      decoration: BoxDecoration(
        color: onDark ? Colors.white.withValues(alpha: 0.10) : Colors.white,
        borderRadius: BorderRadius.circular(size * 0.28),
        border: Border.all(
          color: onDark ? Colors.white.withValues(alpha: 0.25) : AppColors.accentBorder,
          width: 1.4,
        ),
        boxShadow: onDark ? null : AppColors.softShadow,
      ),
      child: CustomPaint(painter: painter),
    );

    if (!showWordmark) return mark;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        mark,
        SizedBox(width: size * 0.3),
        Text(
          'VOLTRA',
          style: GoogleFonts.plusJakartaSans(
            fontSize: size * 0.5,
            fontWeight: FontWeight.w800,
            letterSpacing: size * 0.012,
            color: onDark ? Colors.white : AppColors.ink,
          ),
        ),
      ],
    );
  }
}

/// Ikki tonli "V" — chap + o'ng-yuqori diagonal (to'q), past chaqmoq (sariq).
class _VMarkPainter extends CustomPainter {
  _VMarkPainter({required this.main, required this.bolt});
  final Color main;
  final Color bolt;

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final pMain = Paint()
      ..color = main
      ..isAntiAlias = true;
    final pBolt = Paint()
      ..color = bolt
      ..isAntiAlias = true;

    // Chap qalin diagonal (to'q)
    final left = Path()
      ..moveTo(w * 0.04, h * 0.06)
      ..lineTo(w * 0.30, h * 0.06)
      ..lineTo(w * 0.58, h * 0.94)
      ..lineTo(w * 0.40, h * 0.94)
      ..close();
    canvas.drawPath(left, pMain);

    // O'ng yuqori diagonal (to'q) — checkmark uchi
    final rightTop = Path()
      ..moveTo(w * 0.96, h * 0.06)
      ..lineTo(w * 0.72, h * 0.06)
      ..lineTo(w * 0.54, h * 0.60)
      ..lineTo(w * 0.68, h * 0.60)
      ..close();
    canvas.drawPath(rightTop, pMain);

    // Past ofset chaqmoq (sariq aksent)
    final boltPath = Path()
      ..moveTo(w * 0.62, h * 0.56)
      ..lineTo(w * 0.80, h * 0.56)
      ..lineTo(w * 0.56, h * 0.96)
      ..close();
    canvas.drawPath(boltPath, pBolt);
  }

  @override
  bool shouldRepaint(covariant _VMarkPainter old) =>
      old.main != main || old.bolt != bolt;
}
