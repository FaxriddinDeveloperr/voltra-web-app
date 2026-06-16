# Voltra — Solar E-commerce (Telegram Mini App)

Quyosh energiyasi jihozlari uchun e-commerce.
**Backend:** NestJS + Prisma + PostgreSQL · **Frontend:** React + Vite (Telegram Mini App).

## Struktura

```
voltra-app/
├── backend/            # NestJS REST API (/api/v1) + webapp/dist'ni serving
├── webapp/             # React + Vite Telegram Mini App
├── docker-compose.yml  # PostgreSQL 16 (host port 5433)
└── QUYOSHLI_CLONE_SPEC.md  # dastlabki spetsifikatsiya (tarixiy)
```

## Web (Telegram Mini App) ishga tushirish

```bash
cd webapp
npm install
npm run build        # -> webapp/dist (backend shuni beradi)
# dev: npm run dev   (Vite, /api backendga proxy)
```

Narxlar Google Sheets'dan jonli sinxronlanadi (`PRICE_SHEET_CSV_URL`),
backend har ~60s yangilaydi. Qo'lda: `POST /api/v1/price-sync`.

## Backend ishga tushirish

```bash
# 1. PostgreSQL (Docker)
docker compose up -d

# 2. Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev          # sxema -> DB
npx ts-node prisma/seed.ts      # demo ma'lumotlar (kategoriya, brend, mahsulot...)
npm run start:dev               # http://localhost:3000/api/v1
```

- Swagger: <http://localhost:3000/api/docs>
- DB ulanishi `.env` ichida (`DATABASE_URL`, port **5433**).
- **Dev OTP rejimi:** `OTP_DEV_MODE=true` — SMS yuborilmaydi, kod **123456** (log'da ham ko'rinadi).

### Auth oqimi (tez sinov)

```bash
B=http://localhost:3000/api/v1
curl -X POST $B/auth/send-otp -H 'Content-Type: application/json' -d '{"phone":"+998940196141"}'
curl -X POST $B/auth/verify-otp -H 'Content-Type: application/json' -d '{"phone":"+998940196141","code":"123456"}'
# -> { accessToken, refreshToken, user, isNewProfile }
```

## Telegram bot

Bot menu tugmasi Mini App'ni public HTTPS manzilda ochadi (dev: cloudflared tunnel).
Narx jadvalini tahrirlasangiz — ilovada ~1 daqiqada yangilanadi.

## Texnik stek

| Qatlam | Texnologiya |
|--------|-------------|
| Backend | NestJS 11, Prisma 6, PostgreSQL 16, JWT (access+refresh), Swagger |
| Auth | Telefon + OTP (Eskiz.uz placeholder), bcrypt hashing |
| Frontend | React + Vite + TypeScript, zustand, Telegram Web App SDK |
| Narx | Google Sheets CSV → jonli sync (PriceSyncService) |
