import { Module } from '@nestjs/common';
import { Controller, Get, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
  }
}

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}
  @Get()
  findAll() {
    return this.services.findAll();
  }
}

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
