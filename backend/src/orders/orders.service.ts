import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CustomerType,
  DeliveryType,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TelegramService } from '../common/telegram/telegram.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    if (!dto.items?.length) {
      throw new BadRequestException("Buyurtmada mahsulot yo'q");
    }

    // Yuridik / jismoniy shaxs validatsiyasi
    if (dto.customerType === CustomerType.INDIVIDUAL && !dto.fullName) {
      throw new BadRequestException('Jismoniy shaxs uchun F.I.Sh. majburiy');
    }
    if (dto.customerType === CustomerType.LEGAL && (!dto.orgName || !dto.inn)) {
      throw new BadRequestException(
        'Yuridik shaxs uchun tashkilot nomi va STIR majburiy',
      );
    }
    // Yetkazib berish manzili / pickup validatsiyasi
    if (dto.deliveryType === DeliveryType.DELIVERY) {
      if (!dto.region || !dto.city || !dto.address) {
        throw new BadRequestException('Yetkazib berish manzili to\'liq emas');
      }
    } else if (!dto.pickupPointId) {
      throw new BadRequestException('Olib ketish punkti tanlanmagan');
    }

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const map = new Map(products.map((p) => [p.id, p]));
    if (map.size !== new Set(productIds).size) {
      throw new NotFoundException('Ba\'zi mahsulotlar topilmadi');
    }

    let itemsTotal = new Prisma.Decimal(0);
    let grandTotal = new Prisma.Decimal(0);
    let usdTotal = 0;
    const lines: { name: string; qty: number; usd: number }[] = [];
    const orderItems = dto.items.map((i) => {
      const p = map.get(i.productId)!;
      const base = p.oldPrice ?? p.price;
      itemsTotal = itemsTotal.add(base.mul(i.quantity));
      grandTotal = grandTotal.add(p.price.mul(i.quantity));
      const usd = p.priceUsd ? Number(p.priceUsd) : 0;
      usdTotal += usd * i.quantity;
      lines.push({ name: p.nameUz, qty: i.quantity, usd });
      return {
        productId: p.id,
        productName: p.nameUz,
        price: p.price,
        quantity: i.quantity,
      };
    });
    const discountTotal = itemsTotal.sub(grandTotal);
    const deliveryFee = new Prisma.Decimal(0); // hozircha bepul

    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.genOrderNumber(),
        userId,
        deliveryType: dto.deliveryType,
        customerType: dto.customerType,
        fullName: dto.fullName,
        phone: dto.phone,
        orgName: dto.orgName,
        inn: dto.inn,
        directorName: dto.directorName,
        bank: dto.bank,
        mfo: dto.mfo,
        oked: dto.oked,
        legalAddress: dto.legalAddress,
        region: dto.region,
        city: dto.city,
        address: dto.address,
        house: dto.house,
        landmark: dto.landmark,
        pickupPointId: dto.pickupPointId,
        installation: dto.installation,
        itemsTotal,
        discountTotal,
        deliveryFee,
        grandTotal: grandTotal.add(deliveryFee),
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Buyurtma berilgach savatni tozalash
    await this.prisma.cartItem.deleteMany({ where: { userId } });

    // Guruhga bildirishnoma (fire-and-forget)
    void this.telegram.send(
      this.buildOrderMessage(order, dto, lines, usdTotal),
    );
    return order;
  }

  private buildOrderMessage(
    order: { orderNumber: string; grandTotal: Prisma.Decimal },
    dto: CreateOrderDto,
    lines: { name: string; qty: number; usd: number }[],
    usdTotal: number,
  ): string {
    const e = TelegramService.escape;
    const money = (n: number) =>
      n.toLocaleString('en-US').replace(/,/g, ' ');
    const usd = (n: number) =>
      n === Math.round(n) ? `$${money(n)}` : `$${n.toFixed(2)}`;

    const rows: string[] = [];
    rows.push(`🧾 <b>Yangi buyurtma</b>  <code>${e(order.orderNumber)}</code>`);
    rows.push('');

    // Mijoz
    if (dto.customerType === CustomerType.LEGAL) {
      rows.push(`🏢 <b>Yuridik shaxs</b>`);
      rows.push(`• Tashkilot: ${e(dto.orgName ?? '')}`);
      rows.push(`• STIR: ${e(dto.inn ?? '')}`);
      if (dto.directorName) rows.push(`• Direktor: ${e(dto.directorName)}`);
      if (dto.bank) rows.push(`• Bank: ${e(dto.bank)} / MFO: ${e(dto.mfo ?? '')}`);
    } else {
      rows.push(`👤 <b>${e(dto.fullName ?? '')}</b> (jismoniy shaxs)`);
    }
    rows.push(`📞 <a href="tel:${e(dto.phone)}">${e(dto.phone)}</a>`);
    rows.push('');

    // Yetkazib berish
    if (dto.deliveryType === DeliveryType.DELIVERY) {
      rows.push('🚚 <b>Yetkazib berish</b>');
      const addr = [dto.region, dto.city, dto.address, dto.house, dto.landmark]
        .filter(Boolean)
        .map((x) => e(String(x)))
        .join(', ');
      rows.push(`📍 ${addr}`);
    } else {
      rows.push('📦 <b>Olib ketish</b>');
    }
    rows.push(
      dto.installation === 'WITH_INSTALL'
        ? '🔧 O‘rnatish bilan'
        : '🔧 O‘zi o‘rnatadi',
    );
    rows.push('');

    // Mahsulotlar
    rows.push('🛒 <b>Mahsulotlar:</b>');
    for (const l of lines) {
      rows.push(`• ${e(l.name)} × ${l.qty} — <b>${usd(l.usd * l.qty)}</b>`);
    }
    rows.push('');
    rows.push(`💰 <b>Jami: ${usd(usdTotal)}</b>  (≈ ${money(Number(order.grandTotal))} so‘m)`);

    return rows.join('\n');
  }

  list(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    return order;
  }

  private genOrderNumber(): string {
    const ts = Date.now().toString().slice(-8);
    const rnd = Math.floor(Math.random() * 900 + 100);
    return `QS-${ts}${rnd}`;
  }
}
