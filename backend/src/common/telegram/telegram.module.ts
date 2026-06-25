import {
  Body,
  Controller,
  Global,
  Headers,
  HttpCode,
  Module,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';

interface TgUpdate {
  message?: {
    chat?: { id?: number };
    text?: string;
    from?: { first_name?: string };
  };
  // Botning chatdagi statusi o'zgarganda keladi (guruhga qo'shilish/chiqarilish)
  my_chat_member?: {
    chat?: { id?: number; title?: string; type?: string };
    new_chat_member?: { status?: string };
  };
}

@ApiTags('telegram')
@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly telegram: TelegramService,
    private readonly config: ConfigService,
  ) {}

  // Telegram webhook — bot xabarlarini qabul qiladi (/start va boshqalar)
  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Body() update: TgUpdate,
    @Headers('x-telegram-bot-api-secret-token') secret?: string,
  ) {
    const expected = this.config.get<string>('TELEGRAM_WEBHOOK_SECRET');
    if (expected && secret !== expected) return { ok: false };

    // Bot guruhga qo'shilib admin qilinsa — guruhni buyurtma ro'yxatiga yozamiz.
    const cm = update?.my_chat_member;
    if (cm?.chat?.id) {
      const status = cm.new_chat_member?.status;
      const type = cm.chat.type ?? '';
      const isGroup = type === 'group' || type === 'supergroup';
      if (isGroup && (status === 'administrator' || status === 'creator')) {
        await this.telegram.registerGroup(String(cm.chat.id), cm.chat.title);
      } else if (status === 'left' || status === 'kicked' || status === 'member' || status === 'restricted') {
        // Botdan adminlik olib qo'yilsa yoki guruhdan chiqarilsa — ro'yxatdan o'chiramiz.
        await this.telegram.removeGroup(String(cm.chat.id));
      }
      return { ok: true };
    }

    const msg = update?.message;
    const text = msg?.text?.trim() ?? '';
    const chatId = msg?.chat?.id;
    if (!chatId) return { ok: true };

    if (text === '/start' || text.startsWith('/start')) {
      const name = msg?.from?.first_name ?? '';
      const url = this.config.get<string>('TELEGRAM_WEBAPP_URL')
        ?? this.config.get<string>('PUBLIC_BASE_URL')
        ?? '';
      const hi = name ? `Assalomu alaykum, <b>${TelegramService.escape(name)}</b>!` : 'Assalomu alaykum!';
      const body = [
        `${hi} ⚡️`,
        '',
        '<b>Voltra</b> — quyosh energiyasi yechimlari do‘koniga xush kelibsiz.',
        'Panellar, inverterlar, akkumulyatorlar va tayyor stansiyalar — eng yaxshi narxlarda.',
        '',
        'Boshlash uchun pastdagi tugmani bosing 👇',
      ].join('\n');
      const replyMarkup = url
        ? { inline_keyboard: [[{ text: '🚀 Ilovani ochish', web_app: { url } }]] }
        : undefined;
      await this.telegram.sendMessage(chatId, body, replyMarkup);
    }
    return { ok: true };
  }
}

@Global()
@Module({
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
