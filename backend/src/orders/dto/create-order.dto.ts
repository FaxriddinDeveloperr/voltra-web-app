import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  CustomerType,
  DeliveryType,
  InstallationType,
} from '@prisma/client';

export class OrderItemDto {
  @ApiProperty() @IsString() productId!: string;
  @ApiProperty({ default: 1 }) @IsInt() @Min(1) quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ enum: DeliveryType })
  @IsEnum(DeliveryType)
  deliveryType!: DeliveryType;

  @ApiProperty({ enum: CustomerType })
  @IsEnum(CustomerType)
  customerType!: CustomerType;

  @ApiProperty({ example: '+998940196141' })
  @Matches(/^\+998\d{9}$/)
  phone!: string;

  // Jismoniy shaxs
  @ApiPropertyOptional() @IsOptional() @IsString() fullName?: string;

  // Yuridik shaxs
  @ApiPropertyOptional() @IsOptional() @IsString() orgName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() directorName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bank?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mfo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() oked?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() legalAddress?: string;

  // Yetkazib berish
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() house?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() landmark?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pickupPointId?: string;

  @ApiProperty({ enum: InstallationType })
  @IsEnum(InstallationType)
  installation!: InstallationType;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
