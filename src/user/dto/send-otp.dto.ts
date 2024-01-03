import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty()
  phone: string;
}
