import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserByDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}

export class GetUserFromWebsocket {
  @ApiProperty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  courseSlug: string;

  // @IsOptional()
  // @IsString()
  // role: RoleType
}

export class GetUserByRoleDto {
  @IsEnum(RoleType)
  @Transform(({ value }) => value.toUpperCase())
  @IsNotEmpty()
  role: RoleType;
}
