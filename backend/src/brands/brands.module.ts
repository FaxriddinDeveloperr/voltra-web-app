import { Module } from '@nestjs/common';
import { Controller, Get, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.brand.findMany({ orderBy: { sortOrder: 'asc' } });
  }
}

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brands: BrandsService) {}
  @Get()
  findAll() {
    return this.brands.findAll();
  }
}

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
