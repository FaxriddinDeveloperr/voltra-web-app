# Quyoshli — Solar E-commerce (klon)

Quyosh energiyasi jihozlari uchun B2B/B2C e-commerce ilovasi.
**Backend:** NestJS + Prisma + PostgreSQL · **Mobile:** Flutter.

Spetsifikatsiya: [`QUYOSHLI_CLONE_SPEC.md`](./QUYOSHLI_CLONE_SPEC.md).

## Struktura

```
voltra-app/
├── backend/            # NestJS REST API (/api/v1)
├── mobile/             # Flutter ilova
├── docker-compose.yml  # PostgreSQL 16 (host port 5433)
└── QUYOSHLI_CLONE_SPEC.md
```

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

## Mobile ishga tushirish

```bash
cd mobile
flutter pub get
flutter run            # qurilma/emulyator yoki -d chrome
```

`lib/core/network/api_endpoints.dart` ichidagi `baseUrl` backend manziliga moslangan
(emulyatorda Android uchun `10.0.2.2:3000`).

## Texnik stek

| Qatlam | Texnologiya |
|--------|-------------|
| Backend | NestJS 11, Prisma 6, PostgreSQL 16, JWT (access+refresh), Swagger |
| Auth | Telefon + OTP (Eskiz.uz placeholder), bcrypt hashing |
| Mobile | Flutter, Riverpod, dio, go_router, freezed |
