# Deploy — mini.voltraenergy.uz

Image **lokalda** yig'iladi, serverga tayyor holda uzatiladi (serverda build yo'q — RAM tejaladi).

## 1. Lokalda image yig'ish
```bash
docker build -t voltra-mini:latest .
```

## 2. Serverga uzatish
```bash
docker save voltra-mini:latest | gzip | \
  sshpass -p '***' ssh root@46.225.57.246 'gunzip | docker load'
```

## 3. Serverda (/opt/voltra-mini)
Joylashtiriladi: `docker-compose.prod.yml`, `.env` (DB_PASSWORD), `backend/.env.production`.
```bash
cd /opt/voltra-mini
docker compose -f docker-compose.prod.yml up -d        # build YO'Q, tayyor image
docker compose -f docker-compose.prod.yml exec app npx prisma db seed   # birinchi marta
```

## 4. Nginx (yangi sayt, mavjudlarga tegmaydi)
`/etc/nginx/sites-available/mini.voltraenergy.uz` → `proxy_pass http://127.0.0.1:3010;`
```bash
ln -s /etc/nginx/sites-available/mini.voltraenergy.uz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

## 5. SSL
```bash
certbot --nginx -d mini.voltraenergy.uz
```

## 6. Telegram (bot menu + webhook → https://mini.voltraenergy.uz)

## Yangilash (keyingi safar)
```bash
docker build -t voltra-mini:latest .
docker save voltra-mini:latest | gzip | sshpass -p '***' ssh root@46.225.57.246 'gunzip | docker load'
sshpass -p '***' ssh root@46.225.57.246 'cd /opt/voltra-mini && docker compose -f docker-compose.prod.yml up -d'
```
