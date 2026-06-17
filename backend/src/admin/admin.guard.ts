import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AuthUser } from '../auth/decorators/current-user.decorator';

/**
 * ADMIN_IDS (.env) ro'yxatidagi userlargina o'tkazadi.
 * Ro'yxatda telefon raqami yoki user id (uuid) bo'lishi mumkin.
 * JwtAuthGuard'dan KEYIN ishlatiladi (req.user mavjud bo'lishi shart).
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  /** Berilgan user admin ro'yxatida bormi? */
  static isAdmin(config: ConfigService, user?: AuthUser | null): boolean {
    if (!user) return false;
    const raw = config.get<string>('ADMIN_IDS') ?? '';
    const ids = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!ids.length) return false;
    const norm = (s: string) => s.replace(/[^\d]/g, ''); // raqamlarni solishtirish
    return ids.some(
      (id) =>
        id === user.id ||
        id === user.phone ||
        (norm(id).length >= 7 && norm(id) === norm(user.phone)),
    );
  }

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (!AdminGuard.isAdmin(this.config, req.user)) {
      throw new ForbiddenException('Sizda admin huquqi yo\'q');
    }
    return true;
  }
}
