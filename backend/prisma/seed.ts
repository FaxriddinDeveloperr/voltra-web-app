import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Placeholder rasm generatori (brendlangan aktivlar yo'q — spec yakuniy eslatmasi)
const img = (seed: string, w = 600, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

async function main() {
  console.log('🌱 Seed boshlandi...');

  // Tozalash (idempotent dev seed)
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

  // ── Kategoriyalar (2.5) ───────────────────────────────────────────────
  const categoryNames = [
    'Inverter',
    'Akkumulyator',
    'Metall konstruktsiya',
    'QS uchun materiallar',
    'Quyosh ko\'cha yoritgichlari',
    'Instrumentlar',
    'Zaryadlash stansiyasi',
    'Quyosh stansiyasi',
  ];
  const categories = [];
  for (let i = 0; i < categoryNames.length; i++) {
    categories.push(
      await prisma.category.create({
        data: {
          nameUz: categoryNames[i],
          imageUrl: img(`cat-${i}`, 200, 200),
          sortOrder: i,
        },
      }),
    );
  }
  const catInverter = categories[0];
  const catBattery = categories[1];
  const catStation = categories[7];

  // ── Brendlar ─────────────────────────────────────────────────────────
  const brandNames = [
    'Jinko Solar',
    'SUNGROW',
    'TTN',
    'Get-Green Energy',
    'LONGi',
    'SOFAR',
  ];
  const brands = [];
  for (let i = 0; i < brandNames.length; i++) {
    brands.push(
      await prisma.brand.create({
        data: {
          name: brandNames[i],
          logoUrl: img(`brand-${brandNames[i]}`, 200, 120),
          sortOrder: i,
        },
      }),
    );
  }
  const [bJinko, bSungrow, bTtn, , bLongi, bSofar] = brands;

  // ── Mahsulotlar (videodan) ───────────────────────────────────────────
  type Spec = { icon: string; label: string; value: string };
  interface ProductSeed {
    nameUz: string;
    slug: string;
    price: number;
    oldPrice?: number;
    priceUsd?: number;
    discountPct?: number;
    stock: number;
    descriptionUz: string;
    shortFeatures: string[];
    specs: Spec[];
    datasheet?: boolean;
    categoryId?: string;
    brandId?: string;
    flags?: Partial<{
      isHot: boolean;
      isNew: boolean;
      isBestSeller: boolean;
      isXit: boolean;
    }>;
    images: number;
  }

  const products: ProductSeed[] = [
    {
      nameUz: 'SOFAR 5KTLM-G3 1 fazalik invertor',
      slug: 'sofar-5ktlm-g3',
      price: 4114000,
      oldPrice: 4240000,
      priceUsd: 340,
      discountPct: 3,
      stock: 100,
      descriptionUz:
        'SOFAR 5KTLM-G3 — uy va kichik biznes uchun mo\'ljallangan ishonchli bir fazali tarmoq inverteri. Yuqori samaradorlik va keng kirish kuchlanish diapazoni.',
      shortFeatures: [
        'O\'rnatilgan nol eksport funksiyasi',
        'Qo\'shimcha AFCI funksiyasi',
        'Kompakt dizayn, yengil vazn',
        'Maksimal samaradorlik 98,4%',
      ],
      specs: [
        { icon: 'bolt', label: 'Quvvat', value: '5 kW' },
        { icon: 'sine', label: 'Faza', value: '1' },
        { icon: 'mppt', label: 'MPPT', value: '2 trekera' },
        { icon: 'shield', label: 'Himoya', value: 'IP65' },
        { icon: 'wifi', label: 'Monitoring', value: 'Wi-Fi/RS485' },
      ],
      datasheet: true,
      categoryId: catInverter.id,
      brandId: bSofar.id,
      flags: { isHot: true, isBestSeller: true, isXit: true },
      images: 4,
    },
    {
      nameUz: 'Jinko Tiger Neo 655W N-type panel',
      slug: 'jinko-tiger-neo-655w',
      price: 1850000,
      oldPrice: 2170000,
      priceUsd: 153,
      discountPct: 15,
      stock: 250,
      descriptionUz:
        'Jinko Tiger Neo 655W — N-type TOPCon texnologiyasidagi yuqori unumdor monokristall quyosh paneli. Past haroratli koeffitsient va uzoq xizmat muddati.',
      shortFeatures: [
        'N-type TOPCon hujayralar',
        'Yuqori samaradorlik 22,5%',
        '30 yillik ishlab chiqarish kafolati',
        'Past yorug\'likda yaxshi ishlash',
      ],
      specs: [
        { icon: 'bolt', label: 'Quvvat', value: '655 Wp' },
        { icon: 'efficiency', label: 'Samaradorlik', value: '22,5%' },
        { icon: 'cells', label: 'Hujayra', value: 'N-type' },
      ],
      datasheet: true,
      categoryId: categories[3].id,
      brandId: bJinko.id,
      flags: { isHot: true, isNew: true, isXit: true },
      images: 3,
    },
    {
      nameUz: 'SUNGROW SG5.0RS 1 fazalik invertor',
      slug: 'sungrow-sg5-0rs',
      price: 4980000,
      oldPrice: 5100000,
      priceUsd: 411,
      discountPct: 3,
      stock: 60,
      descriptionUz:
        'SUNGROW SG5.0RS — smart string inverter, integratsiyalashgan PID tiklash va Wi-Fi monitoring.',
      shortFeatures: [
        'Maksimal samaradorlik 98,4%',
        'Integratsiyalashgan PID tiklash',
        'Smart monitoring (iSolarCloud)',
      ],
      specs: [
        { icon: 'bolt', label: 'Quvvat', value: '5 kW' },
        { icon: 'sine', label: 'Faza', value: '1' },
        { icon: 'mppt', label: 'MPPT', value: '2' },
      ],
      datasheet: true,
      categoryId: catInverter.id,
      brandId: bSungrow.id,
      flags: { isNew: true, isBestSeller: true },
      images: 3,
    },
    {
      nameUz: 'LONGi Hi-MO X10 580W panel',
      slug: 'longi-himo-x10-580w',
      price: 1620000,
      oldPrice: 1900000,
      priceUsd: 134,
      discountPct: 15,
      stock: 180,
      descriptionUz:
        'LONGi Hi-MO X10 — HPBC 2.0 texnologiyasidagi yuqori unumli panel, estetik to\'liq qora dizayn.',
      shortFeatures: [
        'HPBC 2.0 hujayralar',
        'To\'liq qora dizayn',
        'Yuqori energiya hosildorligi',
      ],
      specs: [
        { icon: 'bolt', label: 'Quvvat', value: '580 Wp' },
        { icon: 'efficiency', label: 'Samaradorlik', value: '23,0%' },
      ],
      datasheet: true,
      categoryId: categories[3].id,
      brandId: bLongi.id,
      flags: { isHot: true, isNew: true },
      images: 3,
    },
    {
      nameUz: 'Akkumulyator LiFePO4 5kWh 51.2V',
      slug: 'lifepo4-5kwh',
      price: 9800000,
      oldPrice: 11200000,
      priceUsd: 810,
      discountPct: 12,
      stock: 40,
      descriptionUz:
        'Devorga o\'rnatiladigan LiFePO4 akkumulyator bloki, 5 kWh sig\'im, 6000+ tsikl.',
      shortFeatures: [
        '6000+ zaryad tsikli',
        'BMS himoyasi',
        'Devorga o\'rnatish',
      ],
      specs: [
        { icon: 'battery', label: 'Sig\'im', value: '5 kWh' },
        { icon: 'bolt', label: 'Kuchlanish', value: '51.2 V' },
      ],
      datasheet: true,
      categoryId: catBattery.id,
      flags: { isBestSeller: true },
      images: 2,
    },
    {
      nameUz: 'DC Solar kabel 6mm² (qora, 100m)',
      slug: 'dc-solar-kabel-6mm',
      price: 1250000,
      priceUsd: 103,
      stock: 500,
      descriptionUz:
        'UV-bardosh ikki qatlamli izolyatsiyali quyosh DC kabeli, 6mm², 100 metrlik g\'altak.',
      shortFeatures: ['UV-bardosh', 'Ikki qatlamli izolyatsiya', 'TUV sertifikati'],
      specs: [
        { icon: 'cable', label: 'Kesim', value: '6 mm²' },
        { icon: 'length', label: 'Uzunlik', value: '100 m' },
      ],
      categoryId: categories[3].id,
      flags: { isNew: true },
      images: 2,
    },
    {
      nameUz: 'TTN gibrid invertor 8kW 3 fazalik',
      slug: 'ttn-gibrid-8kw',
      price: 12400000,
      oldPrice: 13100000,
      priceUsd: 1025,
      discountPct: 5,
      stock: 25,
      descriptionUz:
        'TTN 8kW uch fazali gibrid invertor — akkumulyator ulash imkoniyati bilan.',
      shortFeatures: [
        'Gibrid (akkumulyator ulanadi)',
        '3 fazali',
        'Uy va biznes uchun',
      ],
      specs: [
        { icon: 'bolt', label: 'Quvvat', value: '8 kW' },
        { icon: 'sine', label: 'Faza', value: '3' },
      ],
      datasheet: true,
      categoryId: catInverter.id,
      brandId: bTtn.id,
      flags: { isHot: true, isBestSeller: true },
      images: 3,
    },
    {
      nameUz: 'Quyosh ko\'cha chirog\'i 100W LED',
      slug: 'quyosh-kocha-chiroq-100w',
      price: 890000,
      oldPrice: 1050000,
      priceUsd: 73,
      discountPct: 15,
      stock: 300,
      descriptionUz:
        'Integratsiyalashgan quyosh ko\'cha chirog\'i, harakat sensori va masofadan boshqaruv bilan.',
      shortFeatures: ['Harakat sensori', 'Masofadan boshqaruv', 'IP66 himoya'],
      specs: [
        { icon: 'bolt', label: 'Quvvat', value: '100 W' },
        { icon: 'shield', label: 'Himoya', value: 'IP66' },
      ],
      categoryId: categories[4].id,
      flags: { isNew: true },
      images: 2,
    },
  ];

  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        nameUz: p.nameUz,
        slug: p.slug,
        descriptionUz: p.descriptionUz,
        shortFeatures: p.shortFeatures,
        price: new Prisma.Decimal(p.price),
        oldPrice: p.oldPrice ? new Prisma.Decimal(p.oldPrice) : null,
        priceUsd: p.priceUsd ? new Prisma.Decimal(p.priceUsd) : null,
        discountPct: p.discountPct ?? null,
        stock: p.stock,
        vatIncluded: true,
        datasheetUrl: p.datasheet ? '/uploads/datasheets/sample.pdf' : null,
        specs: p.specs as unknown as Prisma.InputJsonValue,
        categoryId: p.categoryId,
        brandId: p.brandId,
        isHot: p.flags?.isHot ?? false,
        isNew: p.flags?.isNew ?? false,
        isBestSeller: p.flags?.isBestSeller ?? false,
        isXit: p.flags?.isXit ?? false,
        images: {
          create: Array.from({ length: p.images }, (_, idx) => ({
            url: img(`${p.slug}-${idx}`),
            sortOrder: idx,
          })),
        },
      },
    });
    console.log(`  + mahsulot: ${created.nameUz}`);
  }

  // ── Bannerlar ────────────────────────────────────────────────────────
  const banners = [
    { title: 'TOPCON N-type panellar', seed: 'banner-topcon' },
    { title: 'LONGi Hi-MO X10', seed: 'banner-longi' },
    { title: 'DC Solar Kabel aksiyasi', seed: 'banner-cable' },
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

  // ── Xizmatlar (2.9) ──────────────────────────────────────────────────
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

  // ── Pickup punktlari ─────────────────────────────────────────────────
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

  // ── Viloyatlar / shaharlar ───────────────────────────────────────────
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

  // ── Statik kontent ───────────────────────────────────────────────────
  await prisma.appContent.create({
    data: {
      key: 'about',
      titleUz: 'Biz haqimizda',
      bodyUz:
        'Quyoshli — O\'zbekistondagi quyosh energiyasi jihozlarining yetakchi yetkazib beruvchisi. Biz panellar, invertorlar, akkumulyatorlar va to\'liq quyosh stansiyalarini taklif etamiz.\n\nVersiya: 2.0.9',
    },
  });
  await prisma.appContent.create({
    data: {
      key: 'offer',
      titleUz: 'Oferta va foydalanish shartlari',
      bodyUz:
        'Ushbu ilovadan foydalanish orqali siz ommaviy oferta shartlariga rozilik bildirasiz. Barcha narxlar QQS bilan ko\'rsatilgan.',
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
