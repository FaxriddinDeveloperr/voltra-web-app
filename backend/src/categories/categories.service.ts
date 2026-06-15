import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // Parent-child daraxt (faqat ildiz kategoriyalar + bolalari)
  async findTree() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  }
}
