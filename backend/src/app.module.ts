import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SmsModule } from './common/sms/sms.module';
import { TelegramModule } from './common/telegram/telegram.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { BannersModule } from './banners/banners.module';
import { ProductsModule } from './products/products.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ServicesModule } from './services/services.module';
import { ApplicationsModule } from './applications/applications.module';
import { ContentModule } from './content/content.module';
import { RegionsModule } from './regions/regions.module';
import { PriceSyncModule } from './price-sync/price-sync.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SmsModule,
    TelegramModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    BrandsModule,
    BannersModule,
    ProductsModule,
    FavoritesModule,
    CartModule,
    OrdersModule,
    ServicesModule,
    ApplicationsModule,
    ContentModule,
    RegionsModule,
    PriceSyncModule,
    AdminModule,
  ],
})
export class AppModule {}
