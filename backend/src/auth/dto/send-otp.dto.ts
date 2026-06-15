import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: '+998940196141' })
  @Matches(/^\+998\d{9}$/, {
    message: "Telefon raqami +998 va 9 ta raqamdan iborat bo'lishi kerak",
  })
  phone!: string;
}
