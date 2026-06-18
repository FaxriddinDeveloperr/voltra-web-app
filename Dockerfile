# Voltra Mini App — production image (Node 20).
# Image LOKALDA yig'iladi, serverga tayyor holda uzatiladi (serverda build yo'q).

# ---------- build stage ----------
FROM node:20-slim AS build
WORKDIR /app

# webapp (Vite — Node 20 talab qiladi)
COPY webapp/package*.json ./webapp/
RUN cd webapp && npm ci
COPY webapp ./webapp
RUN cd webapp && npm run build

# backend (NestJS + Prisma)
COPY backend/package*.json ./backend/
RUN cd backend && npm ci
COPY backend ./backend
RUN cd backend && npx prisma generate && npm run build

# ---------- run stage ----------
FROM node:20-slim AS run
WORKDIR /app/backend
ENV NODE_ENV=production
# Prisma query engine uchun openssl
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/prisma ./prisma
COPY --from=build /app/backend/package.json ./package.json
COPY --from=build /app/backend/tsconfig.json ./tsconfig.json
COPY --from=build /app/backend/tsconfig.build.json ./tsconfig.build.json
# main.ts ../webapp/dist dan statik beradi (process.cwd()=/app/backend)
COPY --from=build /app/webapp/dist ../webapp/dist

EXPOSE 3000
# Startda schema'ni sinxronlab, serverni ishga tushiradi
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/main.js"]
