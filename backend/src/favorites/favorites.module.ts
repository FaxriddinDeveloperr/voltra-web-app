import { Module } from '@nestjs/common';
import {
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const favs = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    const ids = favs.map((f) => f.productId);
    return this.prisma.product.findMany({
      where: { id: { in: ids } },
      include: { images: { orderBy: { sortOrder: 'asc' } }, brand: true },
    });
  }

  async add(userId: string, productId: string) {
    await this.prisma.favorite.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });
    return { success: true };
  }

  async remove(userId: string, productId: string) {
    await this.prisma.favorite.deleteMany({ where: { userId, productId } });
    return { success: true };
  }
}

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.favorites.list(user.id);
  }

  @Post(':productId')
  add(@CurrentUser() user: AuthUser, @Param('productId') productId: string) {
    return this.favorites.add(user.id, productId);
  }

  @Delete(':productId')
  remove(@CurrentUser() user: AuthUser, @Param('productId') productId: string) {
    return this.favorites.remove(user.id, productId);
  }
}

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
