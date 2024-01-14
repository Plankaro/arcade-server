import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpsertUserParamRoleDto } from './dto/create-user.dto';
import { GetUserByDto, GetUserByRoleDto } from './dto/get-user.dto';
import { DeleteUsersDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPassword } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserSessionFromJwtStrategy } from '../auth/decorators/session/user.decorator';
import { SessionUser } from '../auth/interfaces/user.interface';
import { EmailService } from '../email/email.service';
import { SkipJwt } from 'src/auth/decorators/jwt/skip-jwt.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private emailService: EmailService,
  ) {}

  @SkipJwt()
  @Post('sendotp')
  sendOtp(@Body('email') email: string): Promise<any> {
    return this.userService.sendOtp(email);
  }

  @SkipJwt()
  @Post('verifyotp')
  verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: number,
  ): Promise<any> {
    return this.userService.verifyOtp(email, otp);
  }



  @SkipJwt()
  @Post('/:role')
  createUser(
    @Param() params: UpsertUserParamRoleDto,
    @Body() data: CreateUserDto,
  ) {
    return this.userService.createUser(params.role, data);
  }

  @Put('/:role')
  updateUser(
    @Param() params: UpsertUserParamRoleDto,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.updateUser(params.role, data);
  }

  @SkipJwt()
  @Patch('forgotpassword')
  forgotPassword(@Body() data: ForgotPassword): Promise<any> {
    return this.userService.forgotPassword(data);
  }

  @Patch('change-password')
  changePassword(
    @Body() data: ChangePasswordDto,
    @UserSessionFromJwtStrategy() user: SessionUser,
  ) {
    return this.userService.changePassword(data, user);
  }

  @SkipJwt()
  @Get('/all/:role?')
  getAllUsers(@Param() params: GetUserByRoleDto) {
    return this.userService.getAllUsers(params);
  }

  @Delete()
  deleteUser(@Body() body: DeleteUsersDto) {
    return this.userService.deleteUser(body);
  }

  
  @Get('/:id')
  getUserById(@Param() params: GetUserByDto) {
    return this.userService.getUserById(params);
  }


}
