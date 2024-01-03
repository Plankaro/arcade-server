import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import * as dotenv from 'dotenv';
import { AuthService } from 'auth/auth.service';
import { GoogleProfileInterface } from '../interfaces/google-profile.interface';

dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private readonly authService: AuthService) {
    // console.log("hello world!");
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? 'https://gpftpsconline.com/api/auth/google/callback'
          : 'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfileInterface,
    done: VerifyCallback,
  ) {
    try {
      const { name, emails, photos } = profile;
      const email = emails[0].value;

      const data = {
        name,
        image: photos,
        email,
      };
      // console.log(data);

      const existingUser =
        await this.authService.validateGoogleLoginUser(profile);

      if (!!existingUser) {
        // console.log("use existing user")
        const data = {
          isExistingUser: true,
          data: existingUser,
        };
        done(null, data);
      } else {
        // console.log("use not found user")
        const newUser = {
          isExistingUser: false,
          data,
        };
        done(null, newUser);
      }
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      done(new UnauthorizedException('Authentication failed'), false);
    }
  }
}
