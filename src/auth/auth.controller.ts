import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { LocalGuard } from './gaurd/local.guard';
import { SkipJwt } from './decorators/jwt/skip-jwt.decorator';
import { Request, Response } from 'express';
import {
  UserFromLocalStrategy,
  UserSessionFromJwtStrategy,
} from './decorators/session/user.decorator';
import { LocalUser, SessionUser } from './interfaces/user.interface';
import { GoogleAuthGuards } from './gaurd/geegle.guard';
import { RoleType } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  ) { }

  @SkipJwt()
  @UseGuards(LocalGuard)
  @Post('sign-in')
  signIn(
    @Query('role') role: RoleType,
    @Body() body: SignInDto,
    @UserFromLocalStrategy() user: LocalUser,
    @Res() res: Response,
  ) {
    return this.authService.signIn(role, body, res, user);
  }

  @Get('session')
  getSession(
    @Query("role") role: RoleType,
    @UserSessionFromJwtStrategy() session: SessionUser
  ) {
    return this.authService.getSession(role, session.id);
  }

  @SkipJwt()
  @Get('/google')
  @UseGuards(GoogleAuthGuards)
  async googleAuth() { }
  

  // google login redirect page
  @SkipJwt()
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuards)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.googleLogin(req, res);
  }

  @Post('sign-out')
  signOut(
    @Res() res: Response,
    @UserSessionFromJwtStrategy() session: SessionUser,
  ) {
    return this.authService.signOut(res, session);
  }
}
