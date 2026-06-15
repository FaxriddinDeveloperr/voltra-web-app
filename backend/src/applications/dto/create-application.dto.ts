import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { AppType } from '@prisma/client';

export class CreateApplicationDto {
  @ApiProperty({ enum: AppType })
  @IsEnum(AppType)
  type!: AppType;

  @ApiPropertyOptional() @IsOptional() @IsString() serviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() power?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fullName?: string;

  @ApiProperty({ example: '+998940196141' })
  @Matches(/^\+998\d{9}$/)
  phone!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() servicePrice?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
}
