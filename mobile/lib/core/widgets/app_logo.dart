import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

/// Voltra logo — toza geometrik "V" (cream), teal gradient plitkada, yumshoq nur.
class AppLogo extends StatelessWidget {
  const AppLogo({
    super.key,
    this.size = 56,
    this.showWordmark = false,
    this.onDark = false,
  });

  final double size;
  final bool showWordmark;
  final bool onDark;

  @override
  Widget build(BuildContext context) {
    final mark = onDark
        ? SizedBox(
            width: size,
            height: size,
            child: CustomPaint(painter: _VMarkPainter(AppColors.accent)),
          )
        : Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              gradient: AppColors.tealGradient,
              borderRadius: BorderRadius.circular(size * 0.28),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.30),
                  blurRadius: size * 0.28,
                  offset: Offset(0, size * 0.12),
                ),
              ],
            ),
            child: Stack(
              children: [
                // yumshoq ichki nur (yuqori-chap)
                Positioned(
                  left: -size * 0.1,
                  top: -size * 0.1,
                  child: Container(
                    width: size * 0.7,
                    height: size * 0.7,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          Colors.white.withValues(alpha: 0.22),
                          Colors.white.withValues(alpha: 0),
                        ],
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(size * 0.24),
                  child: CustomPaint(painter: _VMarkPainter(AppColors.accent)),
                ),
              ],
            ),
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
            color: onDark ? Colors.white : AppColors.primaryDark,
          ),
        ),
      ],
    );
  }
}

/// Toza, qalin "V" — chap va o'ng diagonal pastda tutashadi (checkmark/bolt).
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

    // Chap qalin diagonal (yuqori-chapdan past-markazga)
    final left = Path()
      ..moveTo(w * 0.06, h * 0.06)
      ..lineTo(w * 0.30, h * 0.06)
      ..lineTo(w * 0.58, h * 0.94)
      ..lineTo(w * 0.40, h * 0.94)
      ..close();
    canvas.drawPath(left, p);

    // O'ng diagonal — yuqori qism (checkmark uchi)
    final rightTop = Path()
      ..moveTo(w * 0.94, h * 0.06)
      ..lineTo(w * 0.70, h * 0.06)
      ..lineTo(w * 0.52, h * 0.62)
      ..lineTo(w * 0.66, h * 0.62)
      ..close();
    canvas.drawPath(rightTop, p);

    // O'ng past ofset uchburchak (chaqmoq — harakat)
    final rightBolt = Path()
      ..moveTo(w * 0.60, h * 0.58)
      ..lineTo(w * 0.78, h * 0.58)
      ..lineTo(w * 0.56, h * 0.96)
      ..close();
    canvas.drawPath(rightBolt, p);
  }

  @override
  bool shouldRepaint(covariant _VMarkPainter old) => old.color != color;
}
