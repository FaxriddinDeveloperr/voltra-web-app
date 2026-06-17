import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../auth/decorators/current-user.decorator';

/**
 * ADMIN_IDS (.env) ro'yxatidagi userlargina o'tkazadi.
 * Ro'yxatda telefon raqami, telegram id yoki user id (uuid) bo'lishi mumkin.
 * Userni bazadan yuklab tekshiradi (telefon keyin ulashilsa ham ishlaydi).
 * JwtAuthGuard'dan KEYIN ishlatiladi (req.user mavjud bo'lishi shart).
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /** Berilgan user id admin ro'yxatida bormi? (bazadan tekshiradi) */
  async isAdminById(userId?: string): Promise<boolean> {
    if (!userId) return false;
    const raw = this.config.get<string>('ADMIN_IDS') ?? '';
    const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (!ids.length) return false;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return false;

    const norm = (s: string) => s.replace(/[^\d]/g, '');
    const phone = user.phone ?? '';
    return ids.some(
      (id) =>
        id === user.id ||
        id === user.telegramId ||
        id === phone ||
        (norm(id).length >= 7 && phone && norm(id) === norm(phone)),
    );
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (!(await this.isAdminById(req.user?.id))) {
      throw new ForbiddenException('Sizda admin huquqi yo\'q');
    }
    return true;
  }
}
