import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: '+998940196141' })
  @Matches(/^\+998\d{9}$/)
  phone!: string;

  @ApiProperty({ example: '123456' })
  @Length(4, 6)
  code!: string;
}
