import {
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Type } from 'class-transformer';
import { strongPasswordMsgGenerator } from '../../utils/password.helper';

export class SignInDto {
  @IsMobilePhone('en-IN', {}, { message: 'Mobile Number is not valid' })
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  username: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: (validationArguments) => {
        const { value, constraints } = validationArguments;
        const constraint = constraints[0];
        return value
          ? strongPasswordMsgGenerator(value, constraint)
          : 'Enter a password';
      },
    },
  )
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  password: string;
}
