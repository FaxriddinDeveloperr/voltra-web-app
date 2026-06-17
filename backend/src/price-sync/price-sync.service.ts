import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface Row {
  key: string;
  type: string;
  label: string;
  priceUzs?: number;
  priceUsd?: number;
  priceUzsFrom?: number;
}

const CAT_ORDER = [
  'Quyosh panellari',
  'Tarmoq inverterlar',
  'Gibrid inverterlar',
  'Akkumulyatorlar',
  'Tayyor stansiyalar',
  'Himoya va kabellar',
  "Konstruksiya va o'rnatish",
];

const BRANDS = [
  'JA Solar', 'Jinko', 'LONGi', 'Trina', 'ERA Solar', 'Auxsol', 'Deye',
  'Solax', 'Sungrow', 'SunGrow', 'Huawei', 'Pylontech', 'BYD', 'Deltron',
  'Growatt', 'ABB', 'APC', 'DEHN', 'Eaton', 'K2 Systems', 'Lapp', 'Lider',
  'Powercom', 'Resanta', 'Schneider', 'Stäubli',
];

/**
 * Google Sheets narx jadvalini JONLI kuzatadi: startda va belgilangan
 * interval bilan CSV'ni o'qib, mahsulotlarni (narx/nom/kategoriya) yangilaydi.
 */
@Injectable()
export class PriceSyncService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PriceSyncService.name);
  private timer?: NodeJS.Timeout;
  private syncing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.sync().catch((e) => this.logger.error(e));
    const ms = Number(this.config.get('PRICE_SYNC_MS') ?? 60000);
    this.timer = setInterval(() => {
      this.sync().catch((e) => this.logger.error(String(e)));
    }, ms);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  // ── CSV o'qish ─────────────────────────────────────────────
  private async loadCsv(): Promise<string> {
    const url = this.config.get<string>('PRICE_SHEET_CSV_URL');
    if (url) {
      try {
        const res = await fetch(url, { redirect: 'follow' });
        if (res.ok) {
          const text = await res.text();
          if (text.includes(',') && text.length > 100) return text;
        }
      } catch {
        // fallback
      }
    }
    return readFileSync(join(process.cwd(), 'prisma', 'price.csv'), 'utf8');
  }

  private num(v: string): number | undefined {
    const s = (v || '').trim();
    if (!s) return undefined;
    const n = Number(s.replace(/\s/g, ''));
    return Number.isFinite(n) ? n : undefined;
  }

  private parse(text: string): Row[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
    const out: Row[] = [];
    for (let i = 1; i < lines.length; i++) {
      const c = lines[i].split(',');
      out.push({
        key: c[0]?.trim(),
        type: c[1]?.trim(),
        label: c[2]?.trim(),
        priceUzs: this.num(c[3]),
        priceUsd: this.num(c[4]),
        priceUzsFrom: this.num(c[6]),
      });
    }
    return out;
  }

  private category(label: string): string {
    const l = label.toLowerCase();
    if (l.includes('quyosh paneli')) return 'Quyosh panellari';
    if (l.includes('kalit topshirish') || l.includes('tizim'))
      return 'Tayyor stansiyalar';
    if (l.includes('gibrid')) return 'Gibrid inverterlar';
    if (
      l.includes('akkumulyator') || l.includes('lifepo4') ||
      l.includes('lithium') || l.includes('battery') || l.includes('bess')
    )
      return 'Akkumulyatorlar';
    if (l.includes('inverter') || l.includes('growatt') || l.includes('sun2000'))
      return 'Tarmoq inverterlar';
    if (
      l.includes('ups') || l.includes('stabilizator') || l.includes('spd') ||
      l.includes('avtomat') || l.includes('saqlagich') || l.includes('kabel') ||
      l.includes('mc4') || l.includes("o'chirgich") || l.includes('1000v') ||
      l.includes('himoya')
    )
      return 'Himoya va kabellar';
    if (
      l.includes('konstruksiya') || l.includes('ushlagich') ||
      l.includes('k2') || l.includes("o'rnatish") || l.includes('shit')
    )
      return "Konstruksiya va o'rnatish";
    return 'Himoya va kabellar';
  }

  private brand(label: string): string | null {
    const l = label.toLowerCase();
    for (const b of BRANDS) {
      if (l.includes(b.toLowerCase())) return b === 'SunGrow' ? 'Sungrow' : b;
    }
    return null;
  }

  private power(label: string): string | null {
    const m = label.match(/(\d+(?:[.,]\d+)?)\s*(kVt·s|kWh|kVt|kW|kwt|W)\b/i);
    return m ? `${m[1]} ${m[2]}` : null;
  }

  // ── Asosiy sinxronizatsiya ─────────────────────────────────
  async sync(): Promise<{ updated: number }> {
    if (this.syncing) return { updated: 0 };
    this.syncing = true;
    try {
      const rows = this.parse(await this.loadCsv());
      const rate = rows.find((r) => r.key === 'exchange-rate')?.priceUzs ?? 12200;
      const items = rows.filter(
        (r) => (r.type === 'product' || r.type === 'system') && r.key && r.label,
      );

      // kategoriyalar (find-or-create)
      const catMap = new Map<string, string>();
      for (let i = 0; i < CAT_ORDER.length; i++) {
        const name = CAT_ORDER[i];
        const found =
          (await this.prisma.category.findFirst({ where: { nameUz: name } })) ??
          (await this.prisma.category.create(
            { data: { nameUz: name, sortOrder: i } },
          ));
        catMap.set(name, found.id);
      }

      // brendlar (find-or-create)
      const brandMap = new Map<string, string>();
      const used = [...new Set(items.map((r) => this.brand(r.label)).filter(Boolean))] as string[];
      for (const name of used) {
        const found =
          (await this.prisma.brand.findFirst({ where: { name } })) ??
          (await this.prisma.brand.create({ data: { name } }));
        brandMap.set(name, found.id);
      }

      let updated = 0;
      for (const r of items) {
        let priceUzs = r.type === 'system' ? r.priceUzsFrom ?? r.priceUzs : r.priceUzs;
        let priceUsd = r.priceUsd;
        if (priceUzs == null && priceUsd != null) priceUzs = Math.round(priceUsd * rate);
        if (priceUsd == null && priceUzs != null) priceUsd = Math.round((priceUzs / rate) * 100) / 100;
        if (priceUzs == null) continue;

        const cat = this.category(r.label);
        const brand = this.brand(r.label);
        const power = this.power(r.label);
        const isPanel = cat === 'Quyosh panellari';

        // Faqat jadvaldan keladigan maydonlar (har sinxronda yangilanadi).
        const syncData = {
          nameUz: r.label,
          price: new Prisma.Decimal(priceUzs),
          priceUsd: priceUsd != null ? new Prisma.Decimal(priceUsd) : null,
          vatIncluded: true,
          shortFeatures: power ? [`Quvvat: ${power}`] : [],
          specs: power
            ? ([{ icon: 'bolt', label: 'Quvvat', value: power }] as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          categoryId: catMap.get(cat) ?? null,
          brandId: brand ? brandMap.get(brand) ?? null : null,
        };

        // Admin nazoratidagi maydonlar — faqat mahsulot YARATILGANDA o'rnatiladi,
        // keyin sinxron ularni tegmaydi (admin o'zgartirsa saqlanib qoladi).
        const createDefaults = {
          stock: 100,
          isBestSeller: isPanel,
          isHot: cat === 'Tayyor stansiyalar',
          isNew: cat === 'Gibrid inverterlar',
        };

        await this.prisma.product.upsert({
          where: { slug: r.key },
          create: {
            slug: r.key,
            descriptionUz: `${r.label}. Voltra — quyosh energiyasi yechimlari.`,
            ...syncData,
            ...createDefaults,
          },
          update: syncData,
        });
        updated++;
      }
      this.logger.log(`Narx sinxronlandi: ${updated} mahsulot (kurs ${rate})`);
      return { updated };
    } finally {
      this.syncing = false;
    }
  }
}
