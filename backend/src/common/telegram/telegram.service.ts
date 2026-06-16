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
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.config.get<string>('TELEGRAM_ORDER_CHAT_ID');
    if (!token || !chatId) {
      this.logger.warn('TELEGRAM_ORDER_CHAT_ID o\'rnatilmagan — xabar yuborilmadi');
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
