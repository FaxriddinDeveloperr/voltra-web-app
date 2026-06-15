import { Module } from '@nestjs/common';
import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.region.findMany({ orderBy: { nameUz: 'asc' } });
  }
  cities(regionId: string) {
    return this.prisma.city.findMany({
      where: { regionId },
      orderBy: { nameUz: 'asc' },
    });
  }
}

@ApiTags('regions')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regions: RegionsService) {}

  @Get()
  findAll() {
    return this.regions.findAll();
  }

  @Get(':id/cities')
  cities(@Param('id') id: string) {
    return this.regions.cities(id);
  }
}

@Module({
  controllers: [RegionsController],
  providers: [RegionsService],
})
export class RegionsModule {}
