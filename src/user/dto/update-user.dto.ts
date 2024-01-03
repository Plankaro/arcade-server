import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Image } from '../../dto/image.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's first name", example: 'John' })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User mobile number', example: '+1234567890' })
  @IsOptional()
  @IsMobilePhone('en-IN', {}, { message: 'Mobile Number is not valid' })
  @IsString()
  @Type(() => String)
  mobileNumber: string;

  @ApiProperty({ description: 'User country', example: 'USA' })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({ description: 'User region', example: 'India' })
  @IsOptional()
  @IsString()
  region: string;

  @ApiProperty({
    description: 'User image',
    example: { url: 'https://example.com/profile.jpg' },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image: Image;
}
