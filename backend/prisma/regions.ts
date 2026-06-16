import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// O'zbekiston — 14 hudud (12 viloyat + Toshkent shahri + Qoraqalpog'iston),
// har birida tuman va shaharlar.
export const REGIONS: Record<string, string[]> = {
  'Toshkent shahri': [
    'Bektemir', 'Chilonzor', 'Mirobod', 'Mirzo Ulug\'bek', 'Olmazor',
    'Sergeli', 'Shayxontohur', 'Uchtepa', 'Yakkasaroy', 'Yashnobod',
    'Yunusobod', 'Yangihayot',
  ],
  'Toshkent viloyati': [
    'Nurafshon (shahar)', 'Angren (shahar)', 'Bekobod (shahar)',
    'Chirchiq (shahar)', 'Olmaliq (shahar)', 'Ohangaron (shahar)',
    'Yangiyo\'l (shahar)', 'Bekobod tumani', 'Bo\'ka', 'Bo\'stonliq',
    'Chinoz', 'Qibray', 'Ohangaron tumani', 'Oqqo\'rg\'on', 'Parkent',
    'Piskent', 'Quyi Chirchiq', 'O\'rta Chirchiq', 'Yuqori Chirchiq',
    'Yangiyo\'l tumani', 'Zangiota', 'Toshkent tumani', 'Chinoz tumani',
  ],
  'Andijon': [
    'Andijon (shahar)', 'Xonobod (shahar)', 'Andijon tumani', 'Asaka',
    'Baliqchi', 'Bo\'z', 'Buloqboshi', 'Izboskan', 'Jalaquduq', 'Marhamat',
    'Oltinko\'l', 'Paxtaobod', 'Qo\'rg\'ontepa', 'Shahrixon', 'Ulug\'nor',
    'Xo\'jaobod',
  ],
  'Buxoro': [
    'Buxoro (shahar)', 'Kogon (shahar)', 'Buxoro tumani', 'G\'ijduvon',
    'Jondor', 'Kogon tumani', 'Olot', 'Peshku', 'Qorako\'l', 'Qorovulbozor',
    'Romitan', 'Shofirkon', 'Vobkent',
  ],
  'Farg\'ona': [
    'Farg\'ona (shahar)', 'Marg\'ilon (shahar)', 'Qo\'qon (shahar)',
    'Quvasoy (shahar)', 'Farg\'ona tumani', 'Oltiariq', 'Bag\'dod',
    'Beshariq', 'Buvayda', 'Dang\'ara', 'Furqat', 'Quva', 'Qo\'shtepa',
    'Rishton', 'So\'x', 'Toshloq', 'Uchko\'prik', 'O\'zbekiston tumani',
    'Yozyovon',
  ],
  'Jizzax': [
    'Jizzax (shahar)', 'Sharof Rashidov tumani', 'Arnasoy', 'Baxmal',
    'Do\'stlik', 'Forish', 'G\'allaorol', 'Mirzacho\'l', 'Paxtakor',
    'Yangiobod', 'Zafarobod', 'Zarbdor', 'Zomin',
  ],
  'Xorazm': [
    'Urganch (shahar)', 'Xiva (shahar)', 'Urganch tumani', 'Xiva tumani',
    'Bog\'ot', 'Gurlan', 'Hazorasp', 'Xonqa', 'Qo\'shko\'pir', 'Shovot',
    'Yangiariq', 'Yangibozor', 'Tuproqqal\'a',
  ],
  'Namangan': [
    'Namangan (shahar)', 'Namangan tumani', 'Chortoq', 'Chust', 'Kosonsoy',
    'Mingbuloq', 'Norin', 'Pop', 'To\'raqo\'rg\'on', 'Uchqo\'rg\'on', 'Uychi',
    'Yangiqo\'rg\'on', 'Davlatobod',
  ],
  'Navoiy': [
    'Navoiy (shahar)', 'Zarafshon (shahar)', 'Karmana', 'Konimex',
    'Navbahor', 'Nurota', 'Qiziltepa', 'Tomdi', 'Uchquduq', 'Xatirchi',
    'G\'ozg\'on',
  ],
  'Qashqadaryo': [
    'Qarshi (shahar)', 'Shahrisabz (shahar)', 'Qarshi tumani', 'Chiroqchi',
    'Dehqonobod', 'G\'uzor', 'Kasbi', 'Kitob', 'Koson', 'Mirishkor',
    'Muborak', 'Nishon', 'Qamashi', 'Shahrisabz tumani', 'Yakkabog\'',
    'Ko\'kdala',
  ],
  'Samarqand': [
    'Samarqand (shahar)', 'Kattaqo\'rg\'on (shahar)', 'Samarqand tumani',
    'Bulung\'ur', 'Ishtixon', 'Jomboy', 'Kattaqo\'rg\'on tumani', 'Qo\'shrabot',
    'Narpay', 'Nurobod', 'Oqdaryo', 'Pastdarg\'om', 'Paxtachi', 'Payariq',
    'Toyloq', 'Urgut',
  ],
  'Sirdaryo': [
    'Guliston (shahar)', 'Yangiyer (shahar)', 'Shirin (shahar)',
    'Guliston tumani', 'Boyovut', 'Mirzaobod', 'Oqoltin', 'Sardoba',
    'Sayxunobod', 'Sirdaryo tumani', 'Xovos',
  ],
  'Surxondaryo': [
    'Termiz (shahar)', 'Termiz tumani', 'Angor', 'Bandixon', 'Boysun',
    'Denov', 'Jarqo\'rg\'on', 'Qiziriq', 'Qumqo\'rg\'on', 'Muzrabot',
    'Oltinsoy', 'Sariosiyo', 'Sherobod', 'Sho\'rchi', 'Uzun',
  ],
  'Qoraqalpog\'iston Respublikasi': [
    'Nukus (shahar)', 'Nukus tumani', 'Amudaryo', 'Beruniy', 'Chimboy',
    'Ellikqal\'a', 'Kegeyli', 'Mo\'ynoq', 'Qonliko\'l', 'Qo\'ng\'irot',
    'Qorao\'zak', 'Shumanay', 'Taxtako\'pir', 'To\'rtko\'l', 'Xo\'jayli',
    'Bo\'zatov',
  ],
};

async function main() {
  console.log('🗺  Viloyat/tumanlar yangilanmoqda...');
  await prisma.city.deleteMany();
  await prisma.region.deleteMany();
  const order = Object.keys(REGIONS);
  for (let i = 0; i < order.length; i++) {
    const name = order[i];
    await prisma.region.create({
      data: {
        nameUz: name,
        cities: { create: REGIONS[name].map((c) => ({ nameUz: c })) },
      },
    });
  }
  const r = await prisma.region.count();
  const c = await prisma.city.count();
  console.log(`✅ ${r} hudud, ${c} tuman/shahar qo'shildi.`);
}

if (require.main === module) {
  main()
    .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => void prisma.$disconnect());
}
