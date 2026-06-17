import { Module } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PriceSyncService } from './price-sync.service';

@ApiTags('price-sync')
@Controller('price-sync')
export class PriceSyncController {
  constructor(private readonly sync: PriceSyncService) {}

  // Jadvalni darhol qayta o'qish (qo'lda)
  @Post()
  run() {
    return this.sync.sync();
  }
}

@Module({
  controllers: [PriceSyncController],
  providers: [PriceSyncService],
  exports: [PriceSyncService],
})
export class PriceSyncModule {}
