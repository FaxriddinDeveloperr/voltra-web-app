import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    const map = new Map(products.map((p) => [p.id, p]));

    let itemsTotal = new Prisma.Decimal(0); // chegirmasiz (eski narx yig'indisi)
    let grandTotal = new Prisma.Decimal(0); // hozirgi narx yig'indisi

    const lines = items
      .filter((i) => map.has(i.productId))
      .map((i) => {
        const p = map.get(i.productId)!;
        const price = p.price;
        const base = p.oldPrice ?? p.price;
        const lineTotal = price.mul(i.quantity);
        itemsTotal = itemsTotal.add(base.mul(i.quantity));
        grandTotal = grandTotal.add(lineTotal);
        return {
          id: i.id,
          productId: i.productId,
          quantity: i.quantity,
          product: p,
          lineTotal,
        };
      });

    const discountTotal = itemsTotal.sub(grandTotal);

    return {
      items: lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      itemsTotal,
      discountTotal,
      grandTotal,
    };
  }

  async add(userId: string, productId: string, quantity = 1) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    if (quantity < 1) throw new BadRequestException("Miqdor noto'g'ri");

    await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });
    return this.getCart(userId);
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity < 1) throw new BadRequestException("Miqdor noto'g'ri");
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });
    if (!item) throw new NotFoundException('Savat elementi topilmadi');
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    return this.getCart(userId);
  }

  async remove(userId: string, itemId: string) {
    await this.prisma.cartItem.deleteMany({ where: { id: itemId, userId } });
    return this.getCart(userId);
  }

  async clear(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return this.getCart(userId);
  }
}
