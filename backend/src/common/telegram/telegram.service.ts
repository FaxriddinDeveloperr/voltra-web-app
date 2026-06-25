import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

/** Telegram guruhiga buyurtma bildirishnomalarini yuboradi. */
@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  static escape(s: string): string {
    return (s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Buyurtmani faol guruh(lar)ga yuboradi.
   * Bot admin qilingan guruhlar DB'da saqlanadi; biror faol guruh bo'lmasa —
   * eski `.env` (TELEGRAM_ORDER_CHAT_ID) ga qaytadi.
   */
  async send(html: string): Promise<void> {
    const groups = await this.prisma.orderGroup.findMany({
      where: { isActive: true },
    });
    if (groups.length > 0) {
      await Promise.all(groups.map((g) => this.sendMessage(g.chatId, html)));
      return;
    }
    const chatId = this.config.get<string>('TELEGRAM_ORDER_CHAT_ID');
    if (!chatId) {
      this.logger.warn('Faol guruh yo\'q va TELEGRAM_ORDER_CHAT_ID o\'rnatilmagan — xabar yuborilmadi');
      return;
    }
    await this.sendMessage(chatId, html);
  }

  /** Bot guruhga admin qilinganda guruhni ro'yxatga qo'shadi (yoki nomini yangilaydi). */
  async registerGroup(chatId: string, title?: string): Promise<void> {
    await this.prisma.orderGroup.upsert({
      where: { chatId },
      create: { chatId, title: title ?? null },
      update: { title: title ?? undefined },
    });
    this.logger.log(`Buyurtma guruhi qo'shildi: ${title ?? chatId}`);
  }

  /** Bot guruhdan chiqarilganda yoki adminlikdan olinganda guruhni o'chiradi. */
  async removeGroup(chatId: string): Promise<void> {
    await this.prisma.orderGroup
      .delete({ where: { chatId } })
      .catch(() => undefined);
    this.logger.log(`Buyurtma guruhi o'chirildi: ${chatId}`);
  }

  /** Ixtiyoriy inline klaviatura bilan xabar yuborish. */
  async sendMessage(
    chatId: string | number,
    html: string,
    replyMarkup?: unknown,
  ): Promise<void> {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN yo\'q — xabar yuborilmadi');
      return;
    }
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: html,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
        }),
      });
      if (!res.ok) {
        this.logger.error(`Telegram xato: ${res.status} ${await res.text()}`);
      }
    } catch (e) {
      this.logger.error(`Telegram yuborishda xato: ${String(e)}`);
    }
  }
}
