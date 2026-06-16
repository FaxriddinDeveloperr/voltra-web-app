import { PrismaClient, Prisma } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

const img = (seed: string, w = 600, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

// ── CSV o'qish (env URL yoki mahalliy fayl) ──────────────────
async function loadCsv(): Promise<string> {
  const url = process.env.PRICE_SHEET_CSV_URL;
  if (url) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        if (text.includes(',') && text.length > 100) return text;
      }
    } catch {
      // mahalliy faylga tushamiz
    }
  }
  return readFileSync(join(__dirname, 'price.csv'), 'utf8');
}

interface Row {
  key: string;
  type: string;
  label: string;
  priceUzs?: number;
  priceUsd?: number;
  priceUzsFrom?: number;
  priceUzsTo?: number;
}

function num(v: string): number | undefined {
  const s = (v || '').trim();
  if (!s) return undefined;
  const n = Number(s.replace(/\s/g, ''));
  return Number.isFinite(n) ? n : undefined;
}

function parseCsv(text: string): Row[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split(',');
    rows.push({
      key: c[0]?.trim(),
      type: c[1]?.trim(),
      label: c[2]?.trim(),
      priceUzs: num(c[3]),
      priceUsd: num(c[4]),
      priceUzsFrom: num(c[6]),
      priceUzsTo: num(c[7]),
    });
  }
  return rows;
}

// ── Kategoriya / brend / quvvat ajratish ─────────────────────
function inferCategory(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('quyosh paneli')) return 'Quyosh panellari';
  if (l.includes('kalit topshirish') || l.includes('tizim'))
    return 'Tayyor stansiyalar';
  if (l.includes('gibrid')) return 'Gibrid inverterlar';
  if (
    l.includes('akkumulyator') ||
    l.includes('lifepo4') ||
    l.includes('lithium') ||
    l.includes('battery') ||
    l.includes('bess')
  )
    return 'Akkumulyatorlar';
  if (
    l.includes('inverter') ||
    l.includes('growatt') ||
    l.includes('sun2000')
  )
    return 'Tarmoq inverterlar';
  if (
    l.includes('ups') ||
    l.includes('stabilizator') ||
    l.includes('spd') ||
    l.includes('avtomat') ||
    l.includes('saqlagich') ||
    l.includes('kabel') ||
    l.includes('mc4') ||
    l.includes("o'chirgich") ||
    l.includes('1000v') ||
    l.includes('himoya')
  )
    return 'Himoya va kabellar';
  if (
    l.includes('konstruksiya') ||
    l.includes('ushlagich') ||
    l.includes('k2') ||
    l.includes("o'rnatish") ||
    l.includes('shit')
  )
    return 'Konstruksiya va o\'rnatish';
  return 'Himoya va kabellar';
}

const BRANDS = [
  'JA Solar', 'Jinko', 'LONGi', 'Trina', 'ERA Solar', 'Auxsol', 'Deye',
  'Solax', 'Sungrow', 'SunGrow', 'Huawei', 'Pylontech', 'BYD', 'Deltron',
  'Growatt', 'ABB', 'APC', 'DEHN', 'Eaton', 'K2 Systems', 'Lapp', 'Lider',
  'Powercom', 'Resanta', 'Schneider', 'Stäubli', 'Pylon',
];
function inferBrand(label: string): string | null {
  const l = label.toLowerCase();
  for (const b of BRANDS) {
    if (l.includes(b.toLowerCase())) {
      if (b === 'SunGrow') return 'Sungrow';
      if (b === 'ERA Solar') return 'ERA Solar';
      return b;
    }
  }
  return null;
}

function inferPower(label: string): string | null {
  const m = label.match(/(\d+(?:[.,]\d+)?)\s*(kVt·s|kWh|kVt|kW|kwt|W)\b/i);
  return m ? `${m[1]} ${m[2]}` : null;
}

const catImg: Record<string, string> = {
  'Quyosh panellari': 'panel',
  'Tarmoq inverterlar': 'inverter',
  'Gibrid inverterlar': 'hybrid',
  Akkumulyatorlar: 'battery',
  'Tayyor stansiyalar': 'station',
  'Himoya va kabellar': 'cable',
  "Konstruksiya va o'rnatish": 'mount',
};

async function main() {
  console.log('🌱 Seed (Google Sheets narx jadvalidan)...');
  const rows = parseCsv(await loadCsv());

  const rate =
    rows.find((r) => r.key === 'exchange-rate')?.priceUzs ?? 12200;
  const items = rows.filter((r) => r.type === 'product' || r.type === 'system');
  console.log(`  kurs: 1$ = ${rate} so'm | mahsulotlar: ${items.length}`);

  // Tozalash
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.service.deleteMany();
  await prisma.pickupPoint.deleteMany();
  await prisma.city.deleteMany();
  await prisma.region.deleteMany();
  await prisma.appContent.deleteMany();

  // Kategoriyalar
  const catOrder = [
    'Quyosh panellari',
    'Tarmoq inverterlar',
    'Gibrid inverterlar',
    'Akkumulyatorlar',
    'Tayyor stansiyalar',
    'Himoya va kabellar',
    "Konstruksiya va o'rnatish",
  ];
  const catMap = new Map<string, string>();
  for (let i = 0; i < catOrder.length; i++) {
    const c = await prisma.category.create({
      data: {
        nameUz: catOrder[i],
        imageUrl: img(`cat-${catImg[catOrder[i]] ?? i}`, 200, 200),
        sortOrder: i,
      },
    });
    catMap.set(catOrder[i], c.id);
  }

  // Brendlar
  const brandMap = new Map<string, string>();
  const usedBrands = [
    ...new Set(items.map((r) => inferBrand(r.label)).filter(Boolean)),
  ] as string[];
  for (let i = 0; i < usedBrands.length; i++) {
    const b = await prisma.brand.create({
      data: {
        name: usedBrands[i],
        logoUrl: img(`brand-${usedBrands[i]}`, 200, 120),
        sortOrder: i,
      },
    });
    brandMap.set(usedBrands[i], b.id);
  }

  // Mahsulotlar
  let count = 0;
  for (const r of items) {
    if (!r.key || !r.label) continue;
    const cat = inferCategory(r.label);
    const brand = inferBrand(r.label);
    const power = inferPower(r.label);

    let priceUzs = r.priceUzs;
    let priceUsd = r.priceUsd;
    if (r.type === 'system') {
      priceUzs = r.priceUzsFrom ?? r.priceUzs;
    }
    if (priceUzs == null && priceUsd != null) {
      priceUzs = Math.round(priceUsd * rate);
    }
    if (priceUsd == null && priceUzs != null) {
      priceUsd = Math.round((priceUzs / rate) * 100) / 100;
    }
    if (priceUzs == null) continue;

    const isPanel = cat === 'Quyosh panellari';
    const isStation = cat === 'Tayyor stansiyalar';
    const isHybrid = cat === 'Gibrid inverterlar';

    await prisma.product.create({
      data: {
        nameUz: r.label,
        slug: r.key,
        descriptionUz: `${r.label}. Voltra — quyosh energiyasi yechimlari.`,
        shortFeatures: power ? [`Quvvat: ${power}`] : [],
        price: new Prisma.Decimal(priceUzs),
        priceUsd: priceUsd != null ? new Prisma.Decimal(priceUsd) : null,
        currency: 'UZS',
        stock: 100,
        vatIncluded: true,
        specs: power
          ? ([{ icon: 'bolt', label: 'Quvvat', value: power }] as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        categoryId: catMap.get(cat),
        brandId: brand ? brandMap.get(brand) : null,
        isBestSeller: isPanel,
        isHot: isStation,
        isNew: isHybrid,
        isXit: isPanel && count % 9 === 0,
      },
    });
    count++;
  }
  console.log(`  + ${count} mahsulot, ${usedBrands.length} brend, ${catOrder.length} kategoriya`);

  // ── Bannerlar ────────────────────────────────────────────
  const banners = [
    { title: 'Quyosh panellari', seed: 'b-panel' },
    { title: 'Gibrid inverterlar', seed: 'b-hybrid' },
    { title: 'Tayyor stansiyalar', seed: 'b-station' },
  ];
  for (let i = 0; i < banners.length; i++) {
    await prisma.banner.create({
      data: {
        imageUrl: img(banners[i].seed, 1200, 500),
        title: banners[i].title,
        sortOrder: i,
        isActive: true,
      },
    });
  }

  // ── Xizmatlar ────────────────────────────────────────────
  const services = [
    { nameUz: 'Quyosh panelini tozalash', isActive: true, hasPowerField: true },
    { nameUz: 'Diagnostika', isActive: true, hasPowerField: false },
    { nameUz: 'Loyiha', isActive: false, comingSoon: true },
    { nameUz: 'Quyoshli xonadon', isActive: false, comingSoon: true },
    {
      nameUz: 'Elektr zaryadlash stantsiyalari',
      isActive: false,
      comingSoon: true,
    },
  ];
  for (let i = 0; i < services.length; i++) {
    await prisma.service.create({
      data: {
        nameUz: services[i].nameUz,
        isActive: services[i].isActive,
        comingSoon: services[i].comingSoon ?? false,
        hasPowerField: services[i].hasPowerField ?? false,
        sortOrder: i,
      },
    });
  }

  // ── Pickup punktlari ─────────────────────────────────────
  await prisma.pickupPoint.create({
    data: {
      name: 'Toshkent shahri, Iftixor ko\'chasi 1-uy',
      city: 'Toshkent shahri',
      lat: 41.2995,
      lng: 69.2401,
    },
  });
  await prisma.pickupPoint.create({
    data: {
      name: 'Samarqand shahri, Registon ko\'chasi 15-uy',
      city: 'Samarqand',
      lat: 39.627,
      lng: 66.975,
    },
  });

  // ── Viloyatlar ───────────────────────────────────────────
  const regionsData: Record<string, string[]> = {
    'Toshkent shahri': ['Yunusobod', 'Chilonzor', 'Mirzo Ulug\'bek', 'Yashnobod'],
    'Toshkent viloyati': ['Angren', 'Chirchiq', 'Bekobod', 'Olmaliq'],
    Samarqand: ['Samarqand shahri', 'Kattaqo\'rg\'on', 'Urgut'],
    'Farg\'ona': ['Farg\'ona shahri', 'Qo\'qon', 'Marg\'ilon'],
    Andijon: ['Andijon shahri', 'Asaka', 'Xonobod'],
    Buxoro: ['Buxoro shahri', 'Kogon', 'G\'ijduvon'],
  };
  for (const [regionName, cities] of Object.entries(regionsData)) {
    await prisma.region.create({
      data: {
        nameUz: regionName,
        cities: { create: cities.map((c) => ({ nameUz: c })) },
      },
    });
  }

  // ── Statik kontent ───────────────────────────────────────
  await prisma.appContent.create({
    data: {
      key: 'about',
      titleUz: 'Biz haqimizda',
      bodyUz:
        'Voltra — quyosh energiyasi jihozlarining ishonchli yetkazib beruvchisi. Panellar, invertorlar, akkumulyatorlar va kalit topshirish stansiyalari.\n\nVersiya: 2.0.9',
    },
  });
  await prisma.appContent.create({
    data: {
      key: 'offer',
      titleUz: 'Oferta va foydalanish shartlari',
      bodyUz:
        'Ushbu ilovadan foydalanish orqali ommaviy oferta shartlariga rozilik bildirasiz. Barcha narxlar QQS bilan ko\'rsatilgan.',
    },
  });

  console.log('✅ Seed tugadi.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
