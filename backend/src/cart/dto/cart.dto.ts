import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty()
  @IsString()
  productId!: string;

  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  quantity = 1;
}

export class UpdateCartDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;
}
