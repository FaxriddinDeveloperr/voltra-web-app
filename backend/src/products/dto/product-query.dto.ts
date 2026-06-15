import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() brand?: string;
  @ApiPropertyOptional() @IsOptional() @IsBooleanString() isHot?: string;
  @ApiPropertyOptional() @IsOptional() @IsBooleanString() isNew?: string;
  @ApiPropertyOptional() @IsOptional() @IsBooleanString() isBestSeller?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10) || 1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10) || 20)
  limit?: number = 20;
}
