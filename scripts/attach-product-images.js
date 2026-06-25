const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const p = new PrismaClient();
(async () => {
  const map = JSON.parse(fs.readFileSync('/tmp/img-map.json', 'utf8'));
  let created = 0, skipped = 0, missing = [];
  for (const [slug, url] of Object.entries(map)) {
    const prod = await p.product.findUnique({ where: { slug }, include: { images: true } });
    if (!prod) { missing.push(slug); continue; }
    if (prod.images.length > 0) { skipped++; continue; }
    await p.productImage.create({ data: { url, sortOrder: 0, productId: prod.id } });
    created++;
  }
  console.log('Yangi rasm biriktirildi:', created);
  console.log('Allaqachon rasmi bor (tegilmadi):', skipped);
  console.log('Topilmagan slug:', missing.length, missing.join(', '));
  const withImg = await p.product.count({ where: { images: { some: {} } } });
  console.log('Endi rasmi bor mahsulot:', withImg, '/ 145');
  await p.$disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });
