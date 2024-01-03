import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { RoleType } from '@prisma/client';
import { Image } from '../../dto/image.dto';
import { Transform, Type } from 'class-transformer';

export class UpsertUserParamRoleDto {
  @IsEnum(RoleType)
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  role: RoleType;
}

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "User's first name", example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'User mobile number', example: '+1234567890' })
  @IsMobilePhone('en-IN', {}, { message: 'Mobile Number is not valid' })
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty({ description: 'User country', example: 'USA' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'User region', example: 'India' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({
    description: 'User image',
    example: { url: 'https://example.com/profile.jpg' },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  @IsNotEmpty()
  image: Image;

  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Password is too weak',
    },
  )
  @IsString()
  @IsNotEmpty()
  password: string;
}
