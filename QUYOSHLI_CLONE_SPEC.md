# Quyoshli — Solar E-commerce ilovasi: To'liq klon spetsifikatsiyasi

> **Maqsad:** Ushbu hujjat "Quyoshli" mobil ilovasining (quyosh panellari va solar jihozlar sotuvchi e-commerce) to'liq, professional klonini yaratish uchun Claude Code'ga step-by-step yo'riqnoma. Frontend (Flutter) + Backend (NestJS + PostgreSQL) to'liq qamrab olingan. UI/UX detallari videodan kadrlab tahlil qilingan.
>
> **Claude Code uchun ko'rsatma:** Quyidagi fazalarni TARTIB BILAN, BIRMA-BIR bajaring. Har bir faza tugagach, "✅ Faza N tugadi" deb yozing va keyingisiga o'ting. Hech bir fazani o'tkazib yubormang. Kod yozishdan oldin tegishli skill/best-practice'ni o'qing.

---

## 0. UMUMIY KO'RINISH (App Overview)

**Ilova nomi:** Quyoshli
**Tur:** B2B/B2C e-commerce (quyosh energiyasi jihozlari)
**Til:** O'zbek (asosiy), Rus, Ingliz (ko'p tilli)
**Platforma:** Flutter (Android + iOS)
**Versiya (originalda):** 2.0.9

### Asosiy funksiyalar
1. Mahsulot katalogi (kategoriyalar, brendlar, qidiruv, sevimlilar)
2. Mahsulot detali (galereya, narx, chegirma, datasheet yuklab olish)
3. Savat va checkout (yetkazib berish / olib ketish, jis./yur. shaxs, o'rnatish xizmati)
4. Xizmatlar (panel tozalash, diagnostika, loyiha va h.k.) — ariza topshirish
5. Hamkorlik (Dilerlar, Savdo vakillari, Ustalar uchun) — ariza topshirish
6. Profil (buyurtmalar, arizalar, til, biz haqimizda, oferta)
7. Telefon raqami orqali autentifikatsiya (OTP/SMS)

### Navigatsiya strukturasi
Pastki navigatsiya (Bottom Navigation Bar) — 4 ta tab:
- **Asosiy** (Home) — ikonka: uy
- **Katalog** — ikonka: 4 ta kvadrat (grid)
- **Savat** (Cart) — ikonka: savat (badge bilan, mahsulot soni)
- **Profil** — ikonka: shaxs (avatar)

Aktiv tab: turkuaz/mint fonli pill (yumaloq) + qora ikonka/matn.

---

## 1. DIZAYN TIZIMI (Design System) — UI/UX

> Bu bo'lim videodan piksel darajasida tahlil qilingan. Barcha ranglar, shriftlar, spacing'ni AYNAN shu tarzda qo'llang.

### 1.1 Rang palitrasi

| Rol | HEX | Tavsif |
|-----|-----|--------|
| Primary (asosiy) | `#0F4A3F` | To'q yashil (dark teal) — asosiy tugmalar (Savatga, Buyurtma berish), avatar matn |
| Primary Accent | `#3DD6C0` / `#4ECDC4` | Turkuaz/mint — logo foni, ikonkalar, aktiv elementlar, "Hammasi" havola |
| Primary Light | `#D4F5F0` / `#C5F2EB` | Och mint — aktiv tab foni, avatar doira foni, tanlangan radio foni |
| Teal Text | `#1A9E8F` | Narx matni (yashil-turkuaz), "Hammasi >", "To'liq tavsif" matni |
| Discount Red | `#E63946` / `#EF3B3B` | Chegirma badge foni (-3%, 15%, 56%) |
| New/Soon Green | `#3AAA35` / `#34A853` | "Tez kunda", "Yangi" badge foni |
| Danger Red | `#E03131` | "Profilni o'chirish", "Chiqish" matni |
| Background | `#FFFFFF` | Asosiy fon (oq) |
| Surface/Card BG | `#F5F5F5` / `#F2F2F2` | Input maydonlari, quick-action karta fonlari |
| Image Placeholder | `#E0E0E0` / `#DEDEDE` | Rasm yuklanmaganda kulrang placeholder |
| Text Primary | `#1A1A1A` / `#212121` | Sarlavhalar, mahsulot nomi |
| Text Secondary | `#757575` / `#888888` | "Sotuvda mavjud", eski narx (chizilgan), hint text |
| Strikethrough | `#9E9E9E` | Eski narx (chegirmadan oldingi) — chizilgan |
| In-stock Green | `#2E9E4F` | "100 dona" (mavjud miqdor matni) |
| Border | `#E0E0E0` | Input/karta chegaralari (juda nozik) |

### 1.2 Tipografiya

- **Shrift oilasi:** System default (san-serif, Roboto-ga o'xshash). Tavsiya: `Inter` yoki `Roboto`.
- **Sarlavha (Screen title):** 24-26sp, Bold (`w700`) — masalan "Quyosh panelini tozalash", "Biz haqimizda"
- **AppBar title:** 20sp, Bold — masalan "Savat", "Xizmatlar"
- **Mahsulot nomi:** 15-16sp, Regular/Medium (`w400`/`w500`), 2 qator (ellipsis)
- **Narx (asosiy):** 18-20sp, Bold — masalan "4 114 000 so'm"
- **Eski narx:** 14sp, Regular, strikethrough, kulrang
- **Section sarlavha:** 18sp, Bold — "Qaynoq narxlar!!", "Yangi mahsulotlar"
- **Tugma matni:** 16sp, Bold/Medium, oq rang (primary tugmalar)
- **Hint/label:** 13-14sp, Regular, secondary rang

### 1.3 Spacing va o'lchamlar

- **Ekran chekkasi padding:** 16px (gorizontal)
- **Karta radius:** 12-16px (border-radius)
- **Tugma radius:** 12px; quvurli (pill) tugmalar: 24-28px
- **Input radius:** 12px
- **Section'lar orasidagi vertikal masofa:** 24px
- **Quick action ikonka karta:** ~80x80px, radius 12px, och kulrang fon
- **Bottom nav balandligi:** ~64px

### 1.4 Komponentlar (qayta ishlatiladigan)

1. **ProductCard** (gorizontal listda) — kenglik ~160px:
   - Yuqorida: kvadrat rasm (radius 12), chap-pastda chegirma badge (qizil pill, ⚙ ikonka + "%"), o'ng-yuqorida like (heart) tugma
   - Pastda: mahsulot nomi (2 qator), eski narx (chizilgan), yangi narx (bold qora)

2. **ProductGridCard** (grid 2-ustun) — "Qaynoq narxlar" to'liq ekrani, qidiruv natijalari uchun

3. **DiscountBadge** — qizil pill, ⚙(gear/sun) ikonka + foiz. Variant: `-3%` yoki `15 %`

4. **XitBadge** — "Xit" yorlig'i (olov ikonka 🔥 + "Xit"), turkuaz yoki ko'k-gradient fon, mahsulot rasmida

5. **QuickActionButton** — och kulrang kvadrat karta, markazda turkuaz ikonka, pastda nom. "Yangi" badge (yashil) qo'shilishi mumkin

6. **SectionHeader** — chapda bold sarlavha, o'ngda "Hammasi >" (turkuaz)

7. **PrimaryButton** — to'q yashil fon, oq matn, to'liq kenglik, radius 12. Disabled holatda och kulrang.

8. **CustomDropdown** — och kulrang fon, o'ngda chevron (down arrow), radius 12 — Viloyat, Shahar/Tuman, Quvvat uchun

9. **CustomTextField** — och kulrang fon, label suzuvchi yoki ichida hint, radius 12

10. **QuantitySelector** — `(−)  1  (+)` doira tugmalar (chegara bilan, turkuaz)

11. **EmptyState** — markazda chiziqli ikonka + matn (masalan bo'sh savat, "Arizalar yo'q :(")

12. **SkeletonLoader** — shimmer effekt, kulrang bloklar (asosiy ekran yuklanayotganda)

### 1.5 Splash screen
- Oq fon, markazda turkuaz (radius ~24) kvadrat ichida oq logo (zigzag/yashin shaklidagi 2 ta plitka — solar panel uslubida).

### 1.6 Mikro-interaksiyalar
- Like (heart) bosilganda: outline → to'ldirilgan qizil, kichik scale animatsiya
- Quantity +/−: darhol narx yangilanadi (debounce yo'q, optimistik)
- Tab o'tish: pill fon smooth o'tadi
- Sahifa o'tishlari: standart Cupertino/Material slide
- Banner: avto-aylanuvchi karusel (PageView, 3-4 sek interval), pastda nuqta indikator

---

## 2. EKRANLAR (Screens) — to'liq tahlil

> Har bir ekran videodan aniqlangan. Layout, elementlar va xatti-harakatlar tavsiflangan.

### 2.1 Splash Screen
- Oq fon, markazda turkuaz logo kvadrati. 1.5-2 sek ko'rsatiladi, keyin token tekshiriladi → Home yoki Login.

### 2.2 Asosiy ekran (Home) — `Asosiy`
**AppBar:** chapda logo + "Quyoshli" (bold), o'ngda qidiruv (🔍) va sevimlilar (♡) ikonkalari.

**Body (scrollable, yuqoridan pastga):**
1. **Banner karusel** — kenglik bo'yicha rasm karusel (PageView), avto-scroll. Bannerlar: TOPCON N-type panel, LONGi Hi-MO X10, DC Solar Kabel reklamalari. Pastda nuqta indikator.
2. **Quick Actions** (4 ta gorizontal) — Katalog, Xizmatlar, Hamkorlik, Foydali. Och kulrang kvadrat kartalar, turkuaz ikonkalar. ("Yangi" badge bo'lishi mumkin.)
3. **"Qaynoq narxlar!!"** section — SectionHeader + gorizontal ProductCard listi. (Chegirmali mahsulotlar.)
4. **"Yangi mahsulotlar"** section — gorizontal list.
5. **"Ko'p sotilgan mahsulotlar"** section — gorizontal list.
6. **"Brendlar"** section — gorizontal list (brend logo kartalari: Jinko, Get-Green Energy, SUNGROW, TTN...).

**Loading holati:** Skeleton/shimmer (banner bloki, 4 ta quick action bloki, mahsulot bloklari).

**Tap harakatlari:**
- Quick action "Katalog" → Katalog tab
- "Xizmatlar" → Xizmatlar ekrani
- "Hamkorlik" → Hamkorlik ekrani
- "Foydali" → Foydali menyu (Biz haqimizda, Mening arizalarim va h.k.)
- SectionHeader "Hammasi >" → tegishli to'liq ro'yxat ekrani (masalan "Qaynoq narxlar!!" to'liq grid)
- ProductCard tap → Mahsulot detali
- Brend tap → Brend bo'yicha mahsulotlar ekrani (masalan "Jinko Solar")

### 2.3 Mahsulotlar ro'yxati (kategoriya/brend/qaynoq narxlar)
**AppBar:** chapda ortga (←), markazda sarlavha (masalan "Qaynoq narxlar!!", "Jinko Solar", "SUNGROW", "TTN").
**Body:** 2 ustunli grid (GridView), ProductGridCard'lar. Har birida: rasm, chegirma badge, like, nom (2 qator), eski narx (chizilgan), yangi narx.

### 2.4 Qidiruv (Search)
**AppBar:** chapda ortga (←), markazda qidiruv input (matn), o'ngda tozalash (✕).
**Body:** klaviatura ochiq, real-time qidiruv natijalari 2 ustunli grid. Bo'sh holatda — tavsiya yoki bo'sh ekran.
**Xatti-harakat:** debounced search (300-500ms), natijalar grid'da.

### 2.5 Katalog ekrani — `Katalog`
**AppBar:** "Katalog" (bold sarlavha, AppBar emas balki body ichida ham bo'lishi mumkin).
**Body:** Kategoriyalar ro'yxati — har biri: chapda kichik rasm (radius 8), markazda nom (bold), o'ngda chevron (↓ accordion). Bosilganda kengayadi (expand) yoki sub-kategoriya/mahsulotlarga o'tadi.
**Aniqlangan kategoriyalar:**
- Inverter
- Akkumulyator
- Metall konstruktsiya
- QS uchun materiallar
- Quyosh ko'cha yoritgichlari
- Instrumentlar
- Zaryadlash stansiyasi
- Quyosh stansiyasi
**Loading:** Skeleton (kategoriya bloklari).

### 2.6 Mahsulot detali (Product Detail)
**AppBar:** chapda ortga (←), o'ngda like (♡/♥ to'ldirilgan).
**Body (scrollable):**
1. **Rasm galereyasi** — gorizontal PageView (karusel), pastda nuqta indikator (turkuaz aktiv nuqta). Rasm ustida texnik xususiyat tablari bo'lishi mumkin (himoya, samaradorlik, Wi-Fi ikonkalari).
2. **Texnik xususiyatlar bloki** — ikonka + label:value (masalan: ⚡ Quvvat: 5 kW, ∿ Faza: 1, MPPT: 2 trekera, Himoya: IP65, Monitoring: Wi-Fi/RS485, Uy va biznes uchun).
3. **Mahsulot nomi** (bold, 22-24sp) — masalan "SOFAR 5KTLM-G3 1 fazalik".
4. **Narx bloki:** eski narx (chizilgan) + chegirma badge (qizil -3%), katta yangi narx (turkuaz, bold) + "QQS bilan", pastda valyuta ekvivalenti "340 y.e." (US dollar).
5. **Mavjudlik:** "Sotuvda mavjud: **100 dona**" (dona soni yashil).
6. **Xususiyatlar matni** (bullet'siz, qator-qator): "O'rnatilgan nol eksport funksiyasi", "Qo'shimcha AFCI funksiyasi", "Kompakt dizayn, yengil vazn", "Maksimal samaradorlik 98,4%" va h.k.
7. **"To'liq tavsif"** tugma (outlined, turkuaz matn) → to'liq tavsif sahifasi/modal.
8. **"Datasheet'ni yuklab olish"** tugma (outlined, ikonka + matn) → PDF datasheet yuklab oladi.

**Fixed bottom bar:** chapda eski narx + yangi narx, o'ngda **"🛒 Savatga"** tugma (to'q yashil). Bosilganda savatga qo'shadi + savat badge yangilanadi.

### 2.7 Savat (Cart) — `Savat`
**Header:** "Savat" (bold).
**Body (mahsulot bor holatda):**
- **"Tayyor yechimlar"** sarlavha (yoki kategoriya nomi).
- **CartItem** karta: chapda mahsulot rasmi, o'ngda nom, eski narx (chizilgan), narx, "Sotuvda mavjud: 100 dona". Pastida: QuantitySelector `(−) 1 (+)`, qator summasi (narx × miqdor), o'ng tomonda o'chirish (🗑 trash, turkuaz).
- **"Sizning buyurtmangiz"** xulosa:
  - "N ta maxsulot" → umumiy summa (chegirmasiz)
  - "Maxsulotlarga chegirma" → −summa (qizil/manfiy)
  - Ajratuvchi chiziq
  - **"Jami:"** → katta bold yakuniy summa
- **"Buyurtma berish"** tugma (to'liq kenglik, to'q yashil).

**Bo'sh holat:** markazda savat ikonkasi (chiziqli, turkuaz) + "Savatingizda hali biror narsa yo'q" + "Asosiy sahifadan boshlang yoki kerakli mahsulotni toping" + **"Bosh sahifa"** tugma.

**Xatti-harakat:** miqdor o'zgarganda summalar darhol qayta hisoblanadi. Bottom nav savat ikonkasida qizil badge (mahsulot soni).

### 2.8 Buyurtma berish (Checkout)
**AppBar:** chapda ortga (←), markazda "Buyurtma berish".
**Body (scrollable):**
1. **Yetkazib berish turi** (2 ta tab/segment): **"🚚 Yetkazib berish"** | **"📦 Olib ketish"**. Aktiv tab — oq fon + turkuaz matn.
2. **"Mijoz"** bloki — turi segment: **"Jis. shaxs"** | **"Yur. shaxs"**.
   - **Jismoniy shaxs:** F.I.Sh., Telefon raqamingiz (+998 prefiks).
   - **Yuridik shaxs:** Tashkilot nomi, STIR, Direktorning F.I.Sh., Bank, MFO, OKED, Yuridik manzil, Telefon raqami.
3. **Yetkazib berish tanlangan bo'lsa:** "Yetkazib berish manzili:" — Viloyat (dropdown), Shahar/Tuman (dropdown), Manzil, Uy, Mo'ljal (matn maydonlari).
4. **Olib ketish tanlangan bo'lsa:** "Buyurtmani qabul qilish punkti" — radio tanlov (masalan: "Toshkent shahri, Iftixor ko'chasi 1-uy").
5. **"O'rnatish"** bloki — radio:
   - "O'zim o'rnatib olaman"
   - "O'rnatish bilan" (tanlanganda turkuaz chegara + och fon)
6. **"Sizning buyurtmangiz"** xulosa: mahsulotlar (1x nom → narx), Yetkazib berish (0 so'm yoki summa), **Jami:**.

**Fixed bottom bar:** chapda jami summa, o'ngda **"Buyurtma berish"** tugma (forma to'liq bo'lguncha disabled — och kulrang).

### 2.9 Xizmatlar (Services)
**AppBar:** chapda ortga (←), markazda "Xizmatlar".
**Body:** 2 ustunli grid, oq kartalar (soya bilan, radius 16). Har birida markazda xizmat nomi. Ba'zilarida yuqorida yashil **"Tez kunda"** badge.
**Xizmatlar ro'yxati:**
- Quyosh panelini tozalash (faol)
- Diagnostika (faol)
- Loyiha (Tez kunda)
- Quyoshli xonadon (Tez kunda)
- Elektr zaryadlash stantsiyalari (Tez kunda)

**Tap:** faol xizmat → xizmat ariza formasi. "Tez kunda" → disabled/info.

### 2.10 Xizmat ariza formasi (masalan "Quyosh panelini tozalash")
**AppBar:** chapda ortga (←).
**Body:**
- Sarlavha (xizmat nomi, katta bold)
- **"Xizmat tafsilotlari"** bo'limi: Quvvat (dropdown), Izoh (multi-line textarea).
- **"Manzil"** bo'limi: Viloyat (dropdown), Shahar/Tuman (dropdown).
- **"Mijoz"** bo'limi: (F.I.Sh., Telefon va h.k.).
**Fixed bottom:** **"Arizani yuboring"** tugma (forma to'lguncha disabled).

### 2.11 Hamkorlik (Partnership)
Asosiy ekran banner/menyu orqali: turlar — **"Dilerlar uchun"**, **"Savdo vakillari uchun"**, **"Ustalar uchun"**.

**Dilerlar uchun forma:**
- Sarlavha "Dilerlar uchun"
- "Ma'lumot" bo'limi: Viloyat (dropdown), Shahar/Tuman (dropdown), Telefon raqamingiz (+998), F.I.Sh., Izoh (textarea).
- **"Arizani yuboring"** tugma.

**Ustalar uchun forma:** Dilerlar bilan bir xil + qo'shimcha **"Xizmat narxi (1 kVt uchun)"** maydoni.

**Savdo vakillari uchun forma:** Dilerlar bilan o'xshash (mos maydonlar).

### 2.12 Profil — `Profil`
**Body:**
- Yuqorida: avatar doira (turkuaz fon, shaxs ikonka) + telefon raqami (+998 94 019 61 41, bold) + chevron (>) → Profilni tahrirlash.
- Menyu ro'yxati (ikonka + nom + chevron):
  - 🛍 Mening buyurtmalarim
  - 📋 Mening arizalarim
  - 🎧 Biz bilan bog'lanish
- **"Sozlamalar"** bo'limi:
  - 🌐 Til
  - ℹ️ Ilova haqida
  - 📄 Oferta va foydalanish shartlari
- **"Chiqish"** (qizil matn, markazda).

### 2.13 Profilni tahrirlash
Modal/sahifa: AppBar "Profilni tahrirlash", markazda avatar (turkuaz doira). Maydonlar: Familiya, Ism, Sharif, Telefon raqamingiz. Pastda **"Profilni o'chirish"** (qizil). Eng pastda: **"Bekor qilish"** (outlined) | **"Saqlash"** (to'q yashil).

### 2.14 Mening arizalarim / Mening buyurtmalarim
Ro'yxat ekrani. Bo'sh holat: markazda ikonka (4 kvadrat) + "Arizalar yo'q :(". To'lgan holat: ariza/buyurtma kartalari (status bilan).

### 2.15 Biz haqimizda (Foydali → About)
Matn sahifasi: AppBar ortga, sarlavha "Biz haqimizda", uzun tavsif matni, pastda "Versiya: 2.0.9".

### 2.16 Til tanlash
Modal/sahifa: O'zbek, Русский, English radio/list.

### 2.17 Autentifikatsiya (videoda foydalanuvchi login bo'lgan)
**Taxminiy oqim (standart UZ e-commerce pattern):**
- Telefon raqami kiritish (+998 __ ___ __ __)
- "Davom etish" → SMS OTP yuborish
- OTP kodni kiritish (4-6 raqam)
- Tasdiqlangach → token saqlanadi → Home.
- Profil bo'sh bo'lsa → Familiya/Ism so'raydi.

---

## 3. TEXNIK STEK (Tech Stack)

### Frontend (Flutter)
- **Flutter** 3.x (stable), **Dart** 3.x
- **State management:** `flutter_bloc` (BLoC/Cubit) yoki `riverpod`. Tavsiya: **Riverpod** (oddiy, scalable).
- **Networking:** `dio` + `retrofit` (yoki `pretty_dio_logger` debug uchun)
- **Routing:** `go_router`
- **DI:** `get_it` + `injectable`
- **Local storage:** `flutter_secure_storage` (token), `shared_preferences` (til, sozlamalar)
- **Image:** `cached_network_image`, `shimmer` (skeleton)
- **Forms:** `flutter_form_builder` yoki o'z validatsiya
- **Localization:** `flutter_localizations` + `intl` (uz/ru/en .arb fayllar)
- **Carousel:** `carousel_slider` yoki o'z `PageView`
- **PDF/Download:** `dio` download + `open_filex` (datasheet ochish)
- **JSON:** `freezed` + `json_serializable` (model'lar)
- **Phone input:** `intl_phone_field` (yoki maska bilan `mask_text_input_formatter`)

### Backend (NestJS — tavsiya)
- **NestJS** (TypeScript) — modular, scalable
- **Database:** **PostgreSQL** + **Prisma ORM** (yoki TypeORM)
- **Auth:** JWT (access + refresh) + SMS OTP (Eskiz.uz yoki Play Mobile SMS provayder — UZ uchun)
- **File storage:** mahalliy yoki S3/MinIO (mahsulot rasmlari, datasheet PDF)
- **Validation:** `class-validator` + `class-transformer`
- **Admin:** alohida admin panel (keyingi faza) yoki NestJS + AdminJS
- **Docs:** Swagger (`@nestjs/swagger`)

> **Muqobil backend:** Agar tezroq bo'lishi kerak bo'lsa — **Supabase** (PostgreSQL + Auth + Storage + Edge Functions) yoki **Firebase**. Lekin to'liq nazorat va UZ SMS integratsiyasi uchun NestJS+PostgreSQL tavsiya etiladi.

---

## 4. MA'LUMOTLAR BAZASI SXEMASI (Database Schema)

> PostgreSQL + Prisma sintaksisida. Claude Code: `schema.prisma` faylini shunga muvofiq yarating.

```prisma
// Foydalanuvchi
model User {
  id          String   @id @default(uuid())
  phone       String   @unique          // +998940196141
  firstName   String?
  lastName    String?
  middleName  String?                    // Sharif
  isVerified  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orders      Order[]
  applications Application[]
  favorites   Favorite[]
  cart        CartItem[]
}

// OTP kodlar
model OtpCode {
  id        String   @id @default(uuid())
  phone     String
  code      String                       // hashlanган
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
}

// Kategoriya (accordion, parent-child)
model Category {
  id        String     @id @default(uuid())
  nameUz    String
  nameRu    String?
  nameEn    String?
  imageUrl  String?
  parentId  String?
  parent    Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryTree")
  sortOrder Int        @default(0)
  products  Product[]
}

// Brend
model Brand {
  id        String    @id @default(uuid())
  name      String                       // Jinko, SUNGROW, TTN, Get-Green Energy
  logoUrl   String?
  sortOrder Int       @default(0)
  products  Product[]
}

// Mahsulot
model Product {
  id            String   @id @default(uuid())
  nameUz        String
  nameRu        String?
  nameEn        String?
  slug          String   @unique
  descriptionUz String?  @db.Text        // To'liq tavsif
  descriptionRu String?  @db.Text
  shortFeatures String[]                  // qisqa xususiyatlar ro'yxati (qator-qator)
  price         Decimal  @db.Decimal(14,2) // so'mda
  oldPrice      Decimal? @db.Decimal(14,2) // chegirmadan oldingi
  priceUsd      Decimal? @db.Decimal(10,2) // y.e. (340 y.e.)
  discountPct   Int?                      // 3, 15, 56
  currency      String   @default("UZS")
  stock         Int      @default(0)      // Sotuvda mavjud: 100 dona
  vatIncluded   Boolean  @default(true)   // QQS bilan
  datasheetUrl  String?                   // PDF datasheet
  isHot         Boolean  @default(false)  // Qaynoq narxlar
  isNew         Boolean  @default(false)  // Yangi mahsulotlar
  isBestSeller  Boolean  @default(false)  // Ko'p sotilgan
  isXit         Boolean  @default(false)  // Xit badge
  specs         Json?                     // texnik xususiyatlar: [{icon, label, value}]
  categoryId    String?
  category      Category? @relation(fields: [categoryId], references: [id])
  brandId       String?
  brand         Brand?   @relation(fields: [brandId], references: [id])
  images        ProductImage[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ProductImage {
  id        String  @id @default(uuid())
  url       String
  sortOrder Int     @default(0)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

// Banner (asosiy ekran karusel)
model Banner {
  id        String   @id @default(uuid())
  imageUrl  String
  title     String?
  link      String?                       // mahsulot/kategoriya/url
  type      String?                        // "diler", "sotuvchi", "usta" segmentlari uchun ham
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
}

// Savat elementi
model CartItem {
  id        String  @id @default(uuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  quantity  Int     @default(1)
  createdAt DateTime @default(now())
  @@unique([userId, productId])
}

// Sevimlilar
model Favorite {
  id        String  @id @default(uuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  createdAt DateTime @default(now())
  @@unique([userId, productId])
}

// Buyurtma
model Order {
  id              String   @id @default(uuid())
  orderNumber     String   @unique
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  deliveryType    DeliveryType                // DELIVERY | PICKUP
  customerType    CustomerType                // INDIVIDUAL | LEGAL
  // Jismoniy shaxs
  fullName        String?
  phone           String
  // Yuridik shaxs
  orgName         String?
  inn             String?                     // STIR
  directorName    String?
  bank            String?
  mfo             String?
  oked            String?
  legalAddress    String?
  // Yetkazib berish
  region          String?                     // Viloyat
  city            String?                     // Shahar/Tuman
  address         String?
  house           String?                     // Uy
  landmark        String?                     // Mo'ljal
  pickupPointId   String?                     // olib ketish punkti
  installation    InstallationType            // SELF | WITH_INSTALL
  itemsTotal      Decimal  @db.Decimal(14,2)
  discountTotal   Decimal  @db.Decimal(14,2)
  deliveryFee     Decimal  @db.Decimal(14,2) @default(0)
  grandTotal      Decimal  @db.Decimal(14,2)
  status          OrderStatus @default(NEW)
  items           OrderItem[]
  createdAt       DateTime @default(now())
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  productName String
  price     Decimal @db.Decimal(14,2)
  quantity  Int
}

// Olib ketish punktlari
model PickupPoint {
  id      String @id @default(uuid())
  name    String                          // "Toshkent shahri, Iftixor ko'chasi 1-uy"
  city    String                          // "Toshkent shahri"
  lat     Float?
  lng     Float?
}

// Xizmat turlari
model Service {
  id        String  @id @default(uuid())
  nameUz    String                        // Quyosh panelini tozalash
  nameRu    String?
  isActive  Boolean @default(true)        // false = "Tez kunda"
  comingSoon Boolean @default(false)
  hasPowerField Boolean @default(false)   // Quvvat dropdown kerakmi
  sortOrder Int     @default(0)
}

// Ariza (xizmat va hamkorlik)
model Application {
  id          String   @id @default(uuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  type        AppType                     // SERVICE | DEALER | SELLER | MASTER
  serviceId   String?                     // SERVICE bo'lsa
  power        String?                    // Quvvat
  region      String?                     // Viloyat
  city        String?                     // Shahar/Tuman
  fullName    String?
  phone       String
  servicePrice String?                    // Ustalar uchun: 1 kVt narxi
  comment     String?  @db.Text           // Izoh
  status      String   @default("NEW")
  createdAt   DateTime @default(now())
}

// Statik kontent
model AppContent {
  id      String @id @default(uuid())
  key     String @unique                 // "about", "offer"
  titleUz String?
  bodyUz  String? @db.Text
  bodyRu  String? @db.Text
  bodyEn  String? @db.Text
}

enum DeliveryType { DELIVERY PICKUP }
enum CustomerType { INDIVIDUAL LEGAL }
enum InstallationType { SELF WITH_INSTALL }
enum OrderStatus { NEW CONFIRMED PROCESSING SHIPPED DELIVERED CANCELLED }
enum AppType { SERVICE DEALER SELLER MASTER }
```

---

## 5. API ENDPOINTLAR (Backend REST API)

> Base URL: `/api/v1`. Barcha himoyalangan endpointlar `Authorization: Bearer <accessToken>` talab qiladi.

### Auth
| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| POST | `/auth/send-otp` | `{ phone }` → SMS OTP yuboradi |
| POST | `/auth/verify-otp` | `{ phone, code }` → `{ accessToken, refreshToken, user }` |
| POST | `/auth/refresh` | `{ refreshToken }` → yangi tokenlar |
| POST | `/auth/logout` | tokenni bekor qiladi |

### Profil
| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| GET | `/me` | Joriy foydalanuvchi |
| PATCH | `/me` | `{ firstName, lastName, middleName, phone }` profil yangilash |
| DELETE | `/me` | Profilni o'chirish |

### Katalog / Mahsulotlar
| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| GET | `/categories` | Kategoriyalar (parent-child daraxt) |
| GET | `/brands` | Brendlar ro'yxati |
| GET | `/banners` | Asosiy ekran bannerlari |
| GET | `/products` | Filtr: `?category=&brand=&isHot=&isNew=&isBestSeller=&search=&page=&limit=` |
| GET | `/products/:id` | Mahsulot detali (rasmlar, specs, datasheet bilan) |
| GET | `/products/hot` | Qaynoq narxlar |
| GET | `/products/new` | Yangi mahsulotlar |
| GET | `/products/best-sellers` | Ko'p sotilgan |
| GET | `/products/search?q=` | Qidiruv |

### Sevimlilar
| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| GET | `/favorites` | Foydalanuvchi sevimlilari |
| POST | `/favorites/:productId` | Qo'shish |
| DELETE | `/favorites/:productId` | O'chirish |

### Savat
| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| GET | `/cart` | Savat (items + jami hisoblar) |
| POST | `/cart` | `{ productId, quantity }` qo'shish |
| PATCH | `/cart/:itemId` | `{ quantity }` miqdor yangilash |
| DELETE | `/cart/:itemId` | Elementni o'chirish |
| DELETE | `/cart` | Savatni tozalash |

### Buyurtma
| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| GET | `/pickup-points` | Olib ketish punktlari |
| POST | `/orders` | Buyurtma yaratish (checkout body) |
| GET | `/orders` | Mening buyurtmalarim |
| GET | `/orders/:id` | Buyurtma detali |

### Xizmatlar va arizalar
| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| GET | `/services` | Xizmatlar ro'yxati (Tez kunda flag bilan) |
| POST | `/applications` | Ariza yuborish (SERVICE/DEALER/SELLER/MASTER) |
| GET | `/applications` | Mening arizalarim |

### Statik
| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| GET | `/content/about` | Biz haqimizda |
| GET | `/content/offer` | Oferta va shartlar |
| GET | `/regions` | Viloyatlar ro'yxati |
| GET | `/regions/:id/cities` | Shahar/tumanlar |

### Checkout body namunasi (POST /orders)
```json
{
  "deliveryType": "DELIVERY",
  "customerType": "INDIVIDUAL",
  "fullName": "Aliyev Vali",
  "phone": "+998940196141",
  "region": "Toshkent",
  "city": "Yunusobod",
  "address": "...",
  "house": "12",
  "landmark": "...",
  "installation": "WITH_INSTALL",
  "items": [{ "productId": "uuid", "quantity": 2 }]
}
```

---

## 6. FRONTEND PAPKA STRUKTURASI (Flutter)

> Feature-first + Clean Architecture (lite). Claude Code: shu strukturani yarating.

```
lib/
├── main.dart
├── app.dart                          # MaterialApp.router, theme, localization
├── core/
│   ├── theme/
│   │   ├── app_colors.dart           # 1.1 rang palitrasi
│   │   ├── app_typography.dart       # 1.2 tipografiya
│   │   ├── app_theme.dart            # ThemeData (light)
│   │   └── app_spacing.dart          # 1.3 spacing konstantalar
│   ├── network/
│   │   ├── dio_client.dart           # Dio + interceptors (auth token, refresh)
│   │   └── api_endpoints.dart
│   ├── router/
│   │   └── app_router.dart           # go_router konfiguratsiyasi
│   ├── di/
│   │   └── injection.dart            # get_it + injectable
│   ├── storage/
│   │   ├── secure_storage.dart       # token
│   │   └── prefs.dart                # til, sozlamalar
│   ├── localization/                 # uz.arb, ru.arb, en.arb
│   ├── utils/
│   │   ├── formatters.dart           # narx formatlash (4 114 000 so'm), telefon maska
│   │   └── validators.dart
│   └── widgets/                      # umumiy widgetlar (1.4 komponentlar)
│       ├── primary_button.dart
│       ├── custom_text_field.dart
│       ├── custom_dropdown.dart
│       ├── product_card.dart
│       ├── product_grid_card.dart
│       ├── discount_badge.dart
│       ├── xit_badge.dart
│       ├── quick_action_button.dart
│       ├── section_header.dart
│       ├── quantity_selector.dart
│       ├── empty_state.dart
│       └── skeleton_loader.dart
├── features/
│   ├── splash/
│   ├── auth/                         # phone input, otp, profil to'ldirish
│   │   ├── data/ (datasource, repo_impl, models)
│   │   ├── domain/ (entities, repo, usecases)
│   │   └── presentation/ (screens, widgets, providers/cubits)
│   ├── home/                         # banner, quick actions, sections
│   ├── catalog/                      # kategoriyalar accordion
│   ├── products/                     # ro'yxat, grid, detail
│   ├── search/
│   ├── favorites/
│   ├── cart/
│   ├── checkout/
│   ├── services/                     # xizmatlar + ariza forma
│   ├── partnership/                  # diler/sotuvchi/usta formalari
│   ├── orders/                       # mening buyurtmalarim
│   ├── applications/                 # mening arizalarim
│   └── profile/                      # profil, tahrirlash, sozlamalar, about, offer, til
└── l10n/
```

---

## 7. BAJARISH FAZALARI (Step-by-Step — Claude Code uchun)

> **MUHIM:** Fazalarni TARTIB BILAN bajaring. Har faza oxirida nima qilinganini qisqacha yozing va keyingisiga o'ting. Backend va Frontend parallel emas — avval backend asosi, keyin frontend.

### 🔹 FAZA 0 — Loyiha tayyorgarligi
1. Monorepo yoki 2 ta papka: `backend/` (NestJS) va `mobile/` (Flutter).
2. Backend: `nest new backend`, Prisma o'rnatish, PostgreSQL ulanish (`.env` da `DATABASE_URL`).
3. Frontend: `flutter create mobile --org uz.quyoshli`, asosiy paketlarni `pubspec.yaml`ga qo'shish (3-bo'limdagi stek).
4. Git init, `.gitignore`.
**Tekshiruv:** ikkala loyiha ishga tushadi (`nest start`, `flutter run`).

### 🔹 FAZA 1 — Backend: ma'lumotlar bazasi va auth
1. `schema.prisma`ni 4-bo'limdagidek yarating, `prisma migrate dev`.
2. Seed fayl: kategoriyalar (2.5 ro'yxat), brendlar (Jinko, SUNGROW, TTN, Get-Green Energy), bir nechta mahsulot (SOFAR 5KTLM-G3, Jinko Tiger Neo 655W va h.k. — videodan narxlar bilan), bannerlar, xizmatlar (2.9), pickup point, viloyatlar.
3. Auth modul: `send-otp`, `verify-otp` (OTP'ni DB'da hashlab saqlash, dev rejimda kodni log qilish; UZ uchun Eskiz.uz integratsiyasini placeholder qilib qoldiring), JWT access+refresh, refresh strategiya, guard.
4. Swagger yoqish (`/api/docs`).
**Tekshiruv:** Swagger'da OTP oqimi ishlaydi, token qaytadi.

### 🔹 FAZA 2 — Backend: katalog, mahsulot, banner, brend
1. `categories`, `brands`, `banners`, `products` modullari (CRUD + public GET endpointlar, 5-bo'lim).
2. Mahsulot filtrlash, qidiruv, hot/new/best-sellers.
3. Mahsulot rasmlari va datasheet uchun statik fayl serving (yoki upload).
**Tekshiruv:** Swagger'da mahsulotlar, kategoriyalar, bannerlar qaytadi.

### 🔹 FAZA 3 — Backend: savat, sevimlilar, buyurtma, ariza
1. `cart`, `favorites` modullari (auth bilan).
2. `orders` modul: checkout logikasi (jami, chegirma, yetkazib berish, jis/yur shaxs validatsiyasi).
3. `services`, `applications` modullari.
4. `content` (about/offer), `regions`.
**Tekshiruv:** to'liq checkout oqimi Swagger orqali ishlaydi.

### 🔹 FAZA 4 — Frontend: poydevor (core)
1. `core/theme` — 1.1, 1.2, 1.3 bo'yicha AppColors, AppTypography, AppTheme, AppSpacing.
2. `core/network` — Dio client + auth interceptor (token qo'shish, 401 da refresh).
3. `core/router` — go_router (splash, auth, shell route + 4 tab, detail, checkout va h.k.).
4. `core/di`, `core/storage`, `core/localization` (uz/ru/en arb).
5. `core/widgets` — 1.4 dagi BARCHA umumiy komponentlarni yarating (PrimaryButton, CustomDropdown, ProductCard, DiscountBadge, XitBadge, QuickActionButton, SectionHeader, QuantitySelector, EmptyState, SkeletonLoader). Bu komponentlar 1-bo'limdagi dizayn tizimiga AYNAN mos bo'lsin.
**Tekshiruv:** bo'sh ekranlar router orqali ochiladi, theme qo'llanadi, widget'lar storybook/demo'da ko'rinadi.

### 🔹 FAZA 5 — Frontend: Splash + Auth
1. Splash (1.5) — logo, token tekshirish → Home yoki phone.
2. Telefon kiritish ekrani (+998 maska).
3. OTP kiritish ekrani (4-6 katak).
4. Profil to'ldirish (Familiya/Ism) agar bo'sh bo'lsa.
5. Auth state (Riverpod/BLoC), token saqlash.
**Tekshiruv:** to'liq login oqimi backend bilan ishlaydi.

### 🔹 FAZA 6 — Frontend: Asosiy ekran (Home)
1. AppBar (logo, qidiruv, sevimlilar).
2. Banner karusel (avto-scroll + nuqta indikator).
3. Quick actions (4 ta).
4. 3 ta section (Qaynoq narxlar, Yangi, Ko'p sotilgan) — gorizontal listlar + "Hammasi >".
5. Brendlar section.
6. **Skeleton loading** (2.2 — shimmer) yuklanayotganda.
**Tekshiruv:** Home backend ma'lumotlari bilan to'liq ko'rinadi, 2.2/frame'larga mos.

### 🔹 FAZA 7 — Frontend: Katalog + Mahsulotlar ro'yxati + Qidiruv
1. Katalog accordion (2.5) — rasm + nom + chevron.
2. Mahsulotlar grid ekrani (kategoriya/brend/hammasi) (2.3).
3. Qidiruv ekrani (2.4) — debounced, grid natijalar, ✕ tozalash.
**Tekshiruv:** kategoriya → mahsulotlar, brend → mahsulotlar, qidiruv ishlaydi.

### 🔹 FAZA 8 — Frontend: Mahsulot detali
1. Rasm galereyasi (karusel + nuqta).
2. Texnik xususiyatlar bloki (ikonka + label:value).
3. Narx bloki (eski/yangi/chegirma/QQS/y.e.), mavjudlik.
4. Xususiyatlar matni, "To'liq tavsif", "Datasheet'ni yuklab olish" (PDF download + ochish).
5. Like toggle.
6. Fixed bottom "Savatga" tugma (2.6).
**Tekshiruv:** detal frame 47/49/51 ga mos, savatga qo'shish ishlaydi.

### 🔹 FAZA 9 — Frontend: Savat + Sevimlilar
1. Savat ekrani (2.7) — CartItem, QuantitySelector, xulosa, "Buyurtma berish".
2. Bo'sh savat holati (2.7).
3. Bottom nav savat badge (mahsulot soni).
4. Sevimlilar ekrani (like'langanlar).
**Tekshiruv:** miqdor o'zgarishi summalarni yangilaydi, badge ishlaydi.

### 🔹 FAZA 10 — Frontend: Checkout (Buyurtma berish)
1. Yetkazib berish / Olib ketish tab (2.8).
2. Jis. shaxs / Yur. shaxs segment + tegishli maydonlar (yuridik: STIR, MFO, OKED va h.k.).
3. Manzil (Viloyat/Shahar dropdownlar) yoki pickup point radio.
4. O'rnatish radio (O'zim / O'rnatish bilan).
5. Buyurtma xulosasi + fixed "Buyurtma berish" (validatsiya bilan disabled).
6. Muvaffaqiyat ekrani/modal.
**Tekshiruv:** to'liq buyurtma yaratiladi, backend'da saqlanadi.

### 🔹 FAZA 11 — Frontend: Xizmatlar + Hamkorlik + Arizalar
1. Xizmatlar grid (2.9) — "Tez kunda" badge.
2. Xizmat ariza formasi (2.10).
3. Hamkorlik formalari: Dilerlar, Savdo vakillari, Ustalar (2.11).
4. Mening arizalarim (2.14) — bo'sh holat bilan.
**Tekshiruv:** ariza yuboriladi, "Mening arizalarim"da ko'rinadi.

### 🔹 FAZA 12 — Frontend: Profil
1. Profil ekrani (2.12) — avatar, telefon, menyu, sozlamalar, Chiqish.
2. Profilni tahrirlash (2.13) — maydonlar, Saqlash, Profilni o'chirish.
3. Mening buyurtmalarim.
4. Til tanlash (2.16), Biz haqimizda (2.15), Oferta.
5. Biz bilan bog'lanish.
**Tekshiruv:** profil to'liq, til o'zgaradi, chiqish ishlaydi.

### 🔹 FAZA 13 — Localization (3 til)
1. uz/ru/en .arb fayllarni to'ldirish (barcha matnlar).
2. Til tanlash → butun ilova qayta render.
**Tekshiruv:** 3 tilda to'liq ishlaydi.

### 🔹 FAZA 14 — Sayqallash (Polish)
1. Animatsiyalar (1.6) — like scale, tab pill o'tishi, banner avto-scroll.
2. Xato holatlari (network error, empty states).
3. Pull-to-refresh.
4. Loading skeletonlar barcha ekranlarda.
5. App ikonka + splash (native), nom "Quyoshli".
**Tekshiruv:** ilova videodagi tajribaga maksimal yaqin.

---

## 8. MUHIM TAFSILOTLAR (Claude Code diqqatiga)

1. **Narx formati:** `4 114 000 so'm` — har 3 raqamda bo'sh joy (NBSP), oxirida " so'm". Formatter yozing.
2. **Telefon:** `+998 94 019 61 41` formatida ko'rsatish, kiritishda maska.
3. **Chegirma badge:** ⚙/quyosh shaklidagi kichik ikonka + foiz. Variant: detalda `-3%`, kartalarda `15 %`.
4. **Valyuta:** narx so'mda + qavsda/ostida `y.e.` (USD ekvivalenti, masalan 340 y.e.). Backend ikkalasini ham qaytaradi.
5. **QQS bilan:** narx yonida "QQS bilan" matni (VAT included).
6. **Disabled tugmalar:** forma to'lmaguncha "Arizani yuboring"/"Buyurtma berish" och kulrang (disabled).
7. **Skeleton:** Home va Katalog yuklanayotganda shimmer (frame 70 ga qarang) — bu MUHIM UX detali.
8. **Bottom nav aktiv:** och mint pill fon + ikonka. Savat tabida qizil badge.
9. **"Tez kunda" / "Yangi" badge:** yashil pill, oq matn.
10. **Sevimlilar (heart):** har ProductCard'da yuqori-o'ng burchakda, toggle.

---

## 9. TEST VA TOPSHIRISH
- Backend: Swagger orqali barcha endpointlar test.
- Frontend: har faza oxirida `flutter run` bilan vizual tekshiruv (frame'larga solishtiring).
- E2E oqim: ro'yxatdan o'tish → mahsulot ko'rish → savatga → checkout → buyurtma; xizmat arizasi; hamkorlik arizasi.

---

> **Yakuniy eslatma Claude Code'ga:** Bu spec videodagi "Quyoshli" ilovasining vizual va funksional tahlilidan tuzilgan. Original brendlangan rasm/logo aktivlari sizda yo'q — placeholder yoki ochiq litsenziyali aktivlardan foydalaning, dizayn tizimini (ranglar, layout, oqim) esa AYNAN takrorlang. Har bir fazani tugatgach natijani vizual tekshiring. Omad!
