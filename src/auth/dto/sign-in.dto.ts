import {
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SignInDto {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  username: string;


  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  password: string;
}
