import { Module } from '@nestjs/common';
import {
  Controller,
  Get,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}
  async byKey(key: string) {
    const content = await this.prisma.appContent.findUnique({ where: { key } });
    if (!content) throw new NotFoundException('Kontent topilmadi');
    return content;
  }
}

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get(':key')
  byKey(@Param('key') key: string) {
    return this.content.byKey(key);
  }
}

@Module({
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
