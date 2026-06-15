import { Module } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';

// Pickup punktlari — ochiq endpoint
@Injectable()
export class PickupPointsService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.pickupPoint.findMany();
  }
}

@ApiTags('pickup-points')
@Controller('pickup-points')
export class PickupPointsController {
  constructor(private readonly pickup: PickupPointsService) {}
  @Get()
  findAll() {
    return this.pickup.findAll();
  }
}

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.orders.create(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.orders.list(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.orders.findOne(user.id, id);
  }
}

@Module({
  controllers: [OrdersController, PickupPointsController],
  providers: [OrdersService, PickupPointsService],
})
export class OrdersModule {}
