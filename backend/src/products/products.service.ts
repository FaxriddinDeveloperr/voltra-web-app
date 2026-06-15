import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(q: ProductQueryDto) {
    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 20));

    const where: Prisma.ProductWhereInput = {};
    if (q.category) where.categoryId = q.category;
    if (q.brand) where.brandId = q.brand;
    if (q.isHot === 'true') where.isHot = true;
    if (q.isNew === 'true') where.isNew = true;
    if (q.isBestSeller === 'true') where.isBestSeller = true;
    if (q.search) {
      where.OR = [
        { nameUz: { contains: q.search, mode: 'insensitive' } },
        { nameRu: { contains: q.search, mode: 'insensitive' } },
        { descriptionUz: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { images: { orderBy: { sortOrder: 'asc' } }, brand: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        brand: true,
        category: true,
      },
    });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    return product;
  }

  hot(q: ProductQueryDto) {
    return this.findMany({ ...q, isHot: 'true' });
  }
  newest(q: ProductQueryDto) {
    return this.findMany({ ...q, isNew: 'true' });
  }
  bestSellers(q: ProductQueryDto) {
    return this.findMany({ ...q, isBestSeller: 'true' });
  }
  search(term: string, q: ProductQueryDto) {
    return this.findMany({ ...q, search: term });
  }
}
