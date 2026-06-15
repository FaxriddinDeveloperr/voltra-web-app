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

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

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
    const orderItems = dto.items.map((i) => {
      const p = map.get(i.productId)!;
      const base = p.oldPrice ?? p.price;
      itemsTotal = itemsTotal.add(base.mul(i.quantity));
      grandTotal = grandTotal.add(p.price.mul(i.quantity));
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
    return order;
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
