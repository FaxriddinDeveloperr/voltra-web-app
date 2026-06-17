import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../common/sms/sms.service';
import type { User } from '@prisma/client';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly sms: SmsService,
  ) {}

  async sendOtp(phone: string): Promise<{ sent: boolean; ttl: number }> {
    const ttl = Number(this.config.get('OTP_TTL_SECONDS') ?? 120);
    // dev rejimda doim 123456, prodda tasodifiy 6 xonali
    const devMode = this.config.get<string>('OTP_DEV_MODE') !== 'false';
    const code = devMode ? '123456' : this.randomCode();
    const codeHash = await bcrypt.hash(code, 10);

    await this.prisma.otpCode.create({
      data: {
        phone,
        code: codeHash,
        expiresAt: new Date(Date.now() + ttl * 1000),
      },
    });

    await this.sms.sendOtp(phone, code);
    return { sent: true, ttl };
  }

  async verifyOtp(
    phone: string,
    code: string,
  ): Promise<Tokens & { user: User; isNewProfile: boolean }> {
    const otp = await this.prisma.otpCode.findFirst({
      where: { phone, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) {
      throw new UnauthorizedException('Kod muddati tugagan yoki topilmadi');
    }
    const valid = await bcrypt.compare(code, otp.code);
    if (!valid) {
      throw new UnauthorizedException("Kod noto'g'ri");
    }

    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    let user = await this.prisma.user.findUnique({ where: { phone } });
    const isNewProfile = !user || (!user.firstName && !user.lastName);
    if (!user) {
      user = await this.prisma.user.create({
        data: { phone, isVerified: true },
      });
    } else if (!user.isVerified) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    const tokens = await this.issueTokens(user);
    return { ...tokens, user, isNewProfile };
  }

  /**
   * Telegram Mini App avtomatik kirish: initData imzosini bot token bilan
   * tekshiradi, telegramId bo'yicha userni topadi/yaratadi. OTP shart emas.
   */
  async telegramAuth(
    initData: string,
  ): Promise<Tokens & { user: User; isNewProfile: boolean }> {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) throw new UnauthorizedException('Bot token sozlanmagan');

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) throw new UnauthorizedException('initData yaroqsiz');

    // data-check-string: hash'dan tashqari hamma kalit=qiymat, alfavit bo'yicha
    const pairs: string[] = [];
    params.forEach((v, k) => {
      if (k !== 'hash') pairs.push(`${k}=${v}`);
    });
    pairs.sort();
    const dataCheckString = pairs.join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(token)
      .digest();
    const computed = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computed !== hash) {
      throw new UnauthorizedException('initData imzosi mos kelmadi');
    }

    // auth_date eskirgan emasligini tekshirish (24 soat)
    const authDate = Number(params.get('auth_date') ?? 0);
    if (authDate && Date.now() / 1000 - authDate > 86400) {
      throw new UnauthorizedException('initData muddati tugagan');
    }

    const userJson = params.get('user');
    if (!userJson) throw new UnauthorizedException('Telegram user topilmadi');
    const tgUser = JSON.parse(userJson) as {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
    const telegramId = String(tgUser.id);

    let user = await this.prisma.user.findUnique({ where: { telegramId } });
    const isNewProfile = !user;
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          telegramId,
          username: tgUser.username ?? null,
          firstName: tgUser.first_name ?? null,
          lastName: tgUser.last_name ?? null,
          isVerified: true,
        },
      });
    }

    const tokens = await this.issueTokens(user);
    return { ...tokens, user, isNewProfile };
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    let payload: { sub: string; phone: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz');
    }

    const stored = await this.prisma.refreshToken.findFirst({
      where: { userId: payload.sub, revoked: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!stored || !(await bcrypt.compare(refreshToken, stored.tokenHash))) {
      throw new UnauthorizedException('Refresh token topilmadi');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException();
    return this.issueTokens(user);
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
    return { success: true };
  }

  private async issueTokens(user: User): Promise<Tokens> {
    const payload = { sub: user.id, phone: user.phone };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_TTL') ?? '15m',
    } as object);
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_TTL') ?? '30d',
    } as object);

    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  private randomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
