import { Module } from '@nestjs/common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PriceSyncService } from '../price-sync/price-sync.service';
import { PriceSyncModule } from '../price-sync/price-sync.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { AdminGuard } from './admin.guard';

type Body0 = Record<string, unknown>;

/** Faqat ruxsat etilgan kalitlarni oladi (qolganlarini tashlab yuboradi). */
function pick<T extends Body0>(body: T, keys: string[]): Body0 {
  const out: Body0 = {};
  for (const k of keys) if (body[k] !== undefined) out[k] = body[k];
  return out;
}

const dec = (v: unknown) =>
  v === null || v === undefined || v === ''
    ? null
    : new Prisma.Decimal(v as Prisma.Decimal.Value);

// ── Rasm yuklash (multer) sozlamasi ──────────────────────────
const UPLOAD_SUBDIR = 'products';
const UPLOAD_DIR = join(process.cwd(), process.env.UPLOADS_DIR ?? 'uploads', UPLOAD_SUBDIR);
const imageStorage = diskStorage({
  destination: (_req, _file, cb) => {
    if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = (extname(file.originalname) || '.jpg').toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
interface MulterFile { filename: string }

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly priceSync: PriceSyncService,
  ) {}

  // ── Dashboard ────────────────────────────────────────────────
  async stats() {
    const [
      products,
      hiddenProducts,
      categories,
      brands,
      banners,
      services,
      users,
      orders,
      ordersByStatus,
      apps,
      appsByStatus,
      revenueAgg,
      recentOrders,
      recentApps,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { hidden: true } }),
      this.prisma.category.count(),
      this.prisma.brand.count(),
      this.prisma.banner.count(),
      this.prisma.service.count(),
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.application.count(),
      this.prisma.application.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.order.aggregate({
        _sum: { grandTotal: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { items: true },
      }),
      this.prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ]);

    const statusMap = (
      arr: { status: string; _count: { _all: number } }[],
    ): Record<string, number> =>
      arr.reduce((a, x) => ({ ...a, [x.status]: x._count._all }), {});

    return {
      counts: {
        products,
        hiddenProducts,
        categories,
        brands,
        banners,
        services,
        users,
        orders,
        applications: apps,
      },
      ordersByStatus: statusMap(ordersByStatus),
      appsByStatus: statusMap(appsByStatus),
      revenue: Number(revenueAgg._sum.grandTotal ?? 0),
      recentOrders,
      recentApps,
    };
  }

  // ── Products ─────────────────────────────────────────────────
  async products(q: {
    search?: string;
    category?: string;
    brand?: string;
    hidden?: string;
    page?: string;
    limit?: string;
  }) {
    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 24));
    const where: Prisma.ProductWhereInput = {};
    if (q.category) where.categoryId = q.category;
    if (q.brand) where.brandId = q.brand;
    if (q.hidden === 'true') where.hidden = true;
    if (q.hidden === 'false') where.hidden = false;
    if (q.search)
      where.OR = [
        { nameUz: { contains: q.search, mode: 'insensitive' } },
        { slug: { contains: q.search, mode: 'insensitive' } },
      ];
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { brand: true, category: true, images: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateProduct(id: string, body: Body0) {
    const data = pick(body, [
      'nameUz',
      'descriptionUz',
      'stock',
      'isHot',
      'isNew',
      'isBestSeller',
      'isXit',
      'hidden',
      'categoryId',
      'brandId',
      'discountPct',
      'shortFeatures',
    ]);
    if (body.price !== undefined) data.price = dec(body.price);
    if (body.priceUsd !== undefined) data.priceUsd = dec(body.priceUsd);
    if (body.oldPrice !== undefined) data.oldPrice = dec(body.oldPrice);
    await this.exists('product', id);
    return this.prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: string) {
    await this.exists('product', id);
    return this.prisma.product.delete({ where: { id } });
  }

  // Mahsulot rasmlari
  async addImage(productId: string, url: string) {
    if (!url) throw new BadRequestException('url majburiy');
    await this.exists('product', productId);
    const max = await this.prisma.productImage.aggregate({
      where: { productId },
      _max: { sortOrder: true },
    });
    return this.prisma.productImage.create({
      data: { productId, url, sortOrder: (max._max.sortOrder ?? -1) + 1 },
    });
  }

  async removeImage(imageId: string) {
    await this.exists('productImage', imageId);
    return this.prisma.productImage.delete({ where: { id: imageId } });
  }

  // ── Orders ───────────────────────────────────────────────────
  orders(q: { status?: string; search?: string }) {
    const where: Prisma.OrderWhereInput = {};
    if (q.status) where.status = q.status as Prisma.OrderWhereInput['status'];
    if (q.search)
      where.OR = [
        { orderNumber: { contains: q.search, mode: 'insensitive' } },
        { phone: { contains: q.search } },
        { fullName: { contains: q.search, mode: 'insensitive' } },
        { orgName: { contains: q.search, mode: 'insensitive' } },
      ];
    return this.prisma.order.findMany({
      where,
      include: { items: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async orderStatus(id: string, status: string) {
    await this.exists('order', id);
    return this.prisma.order.update({
      where: { id },
      data: { status: status as Prisma.OrderUpdateInput['status'] },
      include: { items: true },
    });
  }

  async deleteOrder(id: string) {
    await this.exists('order', id);
    return this.prisma.order.delete({ where: { id } });
  }

  // ── Applications ─────────────────────────────────────────────
  applications(q: { status?: string; type?: string }) {
    const where: Prisma.ApplicationWhereInput = {};
    if (q.status) where.status = q.status;
    if (q.type) where.type = q.type as Prisma.ApplicationWhereInput['type'];
    return this.prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 300,
    });
  }

  async appStatus(id: string, status: string) {
    await this.exists('application', id);
    return this.prisma.application.update({ where: { id }, data: { status } });
  }

  async deleteApp(id: string) {
    await this.exists('application', id);
    return this.prisma.application.delete({ where: { id } });
  }

  // ── Banners ──────────────────────────────────────────────────
  banners() {
    return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  }
  createBanner(b: Body0) {
    return this.prisma.banner.create({
      data: pick(b, ['imageUrl', 'title', 'link', 'type', 'sortOrder', 'isActive']) as Prisma.BannerCreateInput,
    });
  }
  async updateBanner(id: string, b: Body0) {
    await this.exists('banner', id);
    return this.prisma.banner.update({
      where: { id },
      data: pick(b, ['imageUrl', 'title', 'link', 'type', 'sortOrder', 'isActive']),
    });
  }
  async deleteBanner(id: string) {
    await this.exists('banner', id);
    return this.prisma.banner.delete({ where: { id } });
  }

  // ── Categories ───────────────────────────────────────────────
  categories() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }
  createCategory(b: Body0) {
    return this.prisma.category.create({
      data: pick(b, ['nameUz', 'nameRu', 'imageUrl', 'parentId', 'sortOrder']) as Prisma.CategoryCreateInput,
    });
  }
  async updateCategory(id: string, b: Body0) {
    await this.exists('category', id);
    return this.prisma.category.update({
      where: { id },
      data: pick(b, ['nameUz', 'nameRu', 'imageUrl', 'parentId', 'sortOrder']),
    });
  }
  async deleteCategory(id: string) {
    await this.exists('category', id);
    return this.prisma.category.delete({ where: { id } });
  }

  // ── Brands ───────────────────────────────────────────────────
  brands() {
    return this.prisma.brand.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }
  createBrand(b: Body0) {
    return this.prisma.brand.create({
      data: pick(b, ['name', 'logoUrl', 'sortOrder']) as Prisma.BrandCreateInput,
    });
  }
  async updateBrand(id: string, b: Body0) {
    await this.exists('brand', id);
    return this.prisma.brand.update({
      where: { id },
      data: pick(b, ['name', 'logoUrl', 'sortOrder']),
    });
  }
  async deleteBrand(id: string) {
    await this.exists('brand', id);
    return this.prisma.brand.delete({ where: { id } });
  }

  // ── Services ─────────────────────────────────────────────────
  services() {
    return this.prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
  }
  createService(b: Body0) {
    return this.prisma.service.create({
      data: pick(b, ['nameUz', 'nameRu', 'isActive', 'comingSoon', 'hasPowerField', 'sortOrder']) as Prisma.ServiceCreateInput,
    });
  }
  async updateService(id: string, b: Body0) {
    await this.exists('service', id);
    return this.prisma.service.update({
      where: { id },
      data: pick(b, ['nameUz', 'nameRu', 'isActive', 'comingSoon', 'hasPowerField', 'sortOrder']),
    });
  }
  async deleteService(id: string) {
    await this.exists('service', id);
    return this.prisma.service.delete({ where: { id } });
  }

  // ── Pickup points ────────────────────────────────────────────
  pickupPoints() {
    return this.prisma.pickupPoint.findMany();
  }
  createPickup(b: Body0) {
    return this.prisma.pickupPoint.create({
      data: pick(b, ['name', 'city', 'lat', 'lng']) as Prisma.PickupPointCreateInput,
    });
  }
  async updatePickup(id: string, b: Body0) {
    await this.exists('pickupPoint', id);
    return this.prisma.pickupPoint.update({
      where: { id },
      data: pick(b, ['name', 'city', 'lat', 'lng']),
    });
  }
  async deletePickup(id: string) {
    await this.exists('pickupPoint', id);
    return this.prisma.pickupPoint.delete({ where: { id } });
  }

  // ── Content ──────────────────────────────────────────────────
  content() {
    return this.prisma.appContent.findMany();
  }
  upsertContent(key: string, b: Body0) {
    const data = pick(b, ['titleUz', 'bodyUz', 'bodyRu', 'bodyEn']);
    return this.prisma.appContent.upsert({
      where: { key },
      create: { key, ...data } as Prisma.AppContentCreateInput,
      update: data,
    });
  }

  // ── Users ────────────────────────────────────────────────────
  users() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: { _count: { select: { orders: true, applications: true } } },
    });
  }

  // ── Price sync ───────────────────────────────────────────────
  runPriceSync() {
    return this.priceSync.sync();
  }

  // ── helper ───────────────────────────────────────────────────
  private async exists(model: string, id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const found = await (this.prisma as any)[model].findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Topilmadi');
  }
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats') stats() {
    return this.admin.stats();
  }

  // Products
  @Get('products') products(@Query() q: Body0) {
    return this.admin.products(q as never);
  }
  @Patch('products/:id') updateProduct(@Param('id') id: string, @Body() b: Body0) {
    return this.admin.updateProduct(id, b);
  }
  @Delete('products/:id') deleteProduct(@Param('id') id: string) {
    return this.admin.deleteProduct(id);
  }

  // Rasm yuklash (qurilmadan) — /uploads/products/... URL qaytaradi
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imageStorage,
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) =>
        cb(null, /^image\//.test(file.mimetype)),
    }),
  )
  upload(@UploadedFile() file?: MulterFile) {
    if (!file) throw new BadRequestException('Rasm yuborilmadi (faqat rasm, ≤10MB)');
    return { url: `/uploads/${UPLOAD_SUBDIR}/${file.filename}` };
  }

  @Post('products/:id/images') addImage(@Param('id') id: string, @Body() b: Body0) {
    return this.admin.addImage(id, String(b.url ?? ''));
  }
  @Delete('products/:id/images/:imageId') removeImage(@Param('imageId') imageId: string) {
    return this.admin.removeImage(imageId);
  }

  // Orders
  @Get('orders') orders(@Query() q: Body0) {
    return this.admin.orders(q as never);
  }
  @Patch('orders/:id/status') orderStatus(@Param('id') id: string, @Body() b: Body0) {
    return this.admin.orderStatus(id, String(b.status));
  }
  @Delete('orders/:id') deleteOrder(@Param('id') id: string) {
    return this.admin.deleteOrder(id);
  }

  // Applications
  @Get('applications') applications(@Query() q: Body0) {
    return this.admin.applications(q as never);
  }
  @Patch('applications/:id/status') appStatus(@Param('id') id: string, @Body() b: Body0) {
    return this.admin.appStatus(id, String(b.status));
  }
  @Delete('applications/:id') deleteApp(@Param('id') id: string) {
    return this.admin.deleteApp(id);
  }

  // Banners
  @Get('banners') banners() {
    return this.admin.banners();
  }
  @Post('banners') createBanner(@Body() b: Body0) {
    return this.admin.createBanner(b);
  }
  @Patch('banners/:id') updateBanner(@Param('id') id: string, @Body() b: Body0) {
    return this.admin.updateBanner(id, b);
  }
  @Delete('banners/:id') deleteBanner(@Param('id') id: string) {
    return this.admin.deleteBanner(id);
  }

  // Categories
  @Get('categories') categories() {
    return this.admin.categories();
  }
  @Post('categories') createCategory(@Body() b: Body0) {
    return this.admin.createCategory(b);
  }
  @Patch('categories/:id') updateCategory(@Param('id') id: string, @Body() b: Body0) {
    return this.admin.updateCategory(id, b);
  }
  @Delete('categories/:id') deleteCategory(@Param('id') id: string) {
    return this.admin.deleteCategory(id);
  }

  // Brands
  @Get('brands') brands() {
    return this.admin.brands();
  }
  @Post('brands') createBrand(@Body() b: Body0) {
    return this.admin.createBrand(b);
  }
  @Patch('brands/:id') updateBrand(@Param('id') id: string, @Body() b: Body0) {
    return this.admin.updateBrand(id, b);
  }
  @Delete('brands/:id') deleteBrand(@Param('id') id: string) {
    return this.admin.deleteBrand(id);
  }

  // Services
  @Get('services') services() {
    return this.admin.services();
  }
  @Post('services') createService(@Body() b: Body0) {
    return this.admin.createService(b);
  }
  @Patch('services/:id') updateService(@Param('id') id: string, @Body() b: Body0) {
    return this.admin.updateService(id, b);
  }
  @Delete('services/:id') deleteService(@Param('id') id: string) {
    return this.admin.deleteService(id);
  }

  // Pickup points
  @Get('pickup-points') pickupPoints() {
    return this.admin.pickupPoints();
  }
  @Post('pickup-points') createPickup(@Body() b: Body0) {
    return this.admin.createPickup(b);
  }
  @Patch('pickup-points/:id') updatePickup(@Param('id') id: string, @Body() b: Body0) {
    return this.admin.updatePickup(id, b);
  }
  @Delete('pickup-points/:id') deletePickup(@Param('id') id: string) {
    return this.admin.deletePickup(id);
  }

  // Content
  @Get('content') content() {
    return this.admin.content();
  }
  @Put('content/:key') upsertContent(@Param('key') key: string, @Body() b: Body0) {
    return this.admin.upsertContent(key, b);
  }

  // Users
  @Get('users') users() {
    return this.admin.users();
  }

  // Price sync
  @Post('price-sync') priceSync() {
    return this.admin.runPriceSync();
  }
}

/** Joriy user admin ekanini tekshiradi (faqat JWT kerak — 403 bermaydi). */
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin-check')
export class AdminCheckController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  check(@CurrentUser() user: AuthUser) {
    return { isAdmin: AdminGuard.isAdmin(this.config, user) };
  }
}

@Module({
  controllers: [AdminController, AdminCheckController],
  providers: [AdminService, AdminGuard],
  imports: [PriceSyncModule],
})
export class AdminModule {}
