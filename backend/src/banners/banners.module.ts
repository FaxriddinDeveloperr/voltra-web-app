import { Module } from '@nestjs/common';
import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(type?: string) {
    return this.prisma.banner.findMany({
      where: { isActive: true, ...(type ? { type } : {}) },
      orderBy: { sortOrder: 'asc' },
    });
  }
}

@ApiTags('banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly banners: BannersService) {}
  @Get()
  findAll(@Query('type') type?: string) {
    return this.banners.findAll(type);
  }
}

@Module({
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
