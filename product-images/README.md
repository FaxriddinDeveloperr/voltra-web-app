# Mahsulot rasmlari (33 ta guruh → 145 mahsulot)

Har bir rasm `<group-slug>.png` deb nomlangan. `image-groups.json` qaysi rasm qaysi
mahsulotlarga tegishlini belgilaydi (1 rasm → bir nechta o'xshash mahsulot).
Frontendda `objectFit: contain` + oq fon bilan ko'rsatiladi (qirqilmaydi).

## Serverga qayta yuklash (yangi muhitda)
```bash
# 1. Rasmlarni uploads volume'iga ko'chirish
docker exec voltra-mini-app mkdir -p /app/backend/uploads/products
docker cp product-images/. voltra-mini-app:/app/backend/uploads/products/

# 2. Mappingni yaratish (productSlug -> url)
node -e 'const fs=require("fs");const g=JSON.parse(fs.readFileSync("image-groups.json"));const m={};for(const[k,a]of Object.entries(g))for(const s of a)m[s]="/uploads/products/"+k+".png";fs.writeFileSync("/tmp/img-map.json",JSON.stringify(m))'
docker cp /tmp/img-map.json voltra-mini-app:/tmp/img-map.json

# 3. DBda biriktirish (idempotent — rasmi yo'q mahsulotlarga qo'shadi)
docker cp scripts/attach-product-images.js voltra-mini-app:/app/backend/attach-product-images.js
docker exec -w /app/backend voltra-mini-app node attach-product-images.js
```
