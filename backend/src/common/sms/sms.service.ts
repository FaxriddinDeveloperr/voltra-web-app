import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * SMS yuborish servisi.
 * Dev rejimda (OTP_DEV_MODE=true) kodni faqat log qiladi.
 * Prod uchun Eskiz.uz integratsiyasi (placeholder) — TODO.
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly config: ConfigService) {}

  async sendOtp(phone: string, code: string): Promise<void> {
    const devMode = this.config.get<string>('OTP_DEV_MODE') !== 'false';
    if (devMode) {
      this.logger.warn(`[DEV SMS] ${phone} uchun OTP kod: ${code}`);
      return;
    }
    // TODO: Eskiz.uz / Play Mobile integratsiyasi
    // const token = await this.eskizAuth();
    // await this.eskizSend(phone, `Quyoshli tasdiqlash kodi: ${code}`);
    this.logger.log(`SMS yuborildi: ${phone}`);
  }
}
