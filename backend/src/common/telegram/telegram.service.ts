import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Telegram guruhiga buyurtma bildirishnomalarini yuboradi. */
@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly config: ConfigService) {}

  static escape(s: string): string {
    return (s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  async send(html: string): Promise<void> {
    const chatId = this.config.get<string>('TELEGRAM_ORDER_CHAT_ID');
    if (!chatId) {
      this.logger.warn('TELEGRAM_ORDER_CHAT_ID o\'rnatilmagan — xabar yuborilmadi');
      return;
    }
    await this.sendMessage(chatId, html);
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
