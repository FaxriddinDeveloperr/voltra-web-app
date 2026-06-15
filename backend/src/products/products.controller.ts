import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findMany(@Query() q: ProductQueryDto) {
    return this.products.findMany(q);
  }

  @Get('hot')
  hot(@Query() q: ProductQueryDto) {
    return this.products.hot(q);
  }

  @Get('new')
  newest(@Query() q: ProductQueryDto) {
    return this.products.newest(q);
  }

  @Get('best-sellers')
  bestSellers(@Query() q: ProductQueryDto) {
    return this.products.bestSellers(q);
  }

  @Get('search')
  search(@Query('q') term: string, @Query() q: ProductQueryDto) {
    return this.products.search(term ?? '', q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }
}
