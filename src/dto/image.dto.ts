import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Image {
  @ApiProperty({ description: 'The name of the image' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The URL of the image' })
  @IsString()
  @IsNotEmpty()
  data: string;
}
