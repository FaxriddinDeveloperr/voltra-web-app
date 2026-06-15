import { Module } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  getCart(@CurrentUser() user: AuthUser) {
    return this.cart.getCart(user.id);
  }

  @Post()
  add(@CurrentUser() user: AuthUser, @Body() dto: AddToCartDto) {
    return this.cart.add(user.id, dto.productId, dto.quantity);
  }

  @Patch(':itemId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cart.updateQuantity(user.id, itemId, dto.quantity);
  }

  @Delete(':itemId')
  remove(@CurrentUser() user: AuthUser, @Param('itemId') itemId: string) {
    return this.cart.remove(user.id, itemId);
  }

  @Delete()
  clear(@CurrentUser() user: AuthUser) {
    return this.cart.clear(user.id);
  }
}

@Module({
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
