import { ApiProperty } from '@nestjs/swagger';

export class verifyOtpDto {
  @ApiProperty()
  phone: string;
  @ApiProperty()
  otp: string;
}
