import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      session: true,
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(
    username: SignInDto['username'],
    password: SignInDto['password'],
  ) {
    return await this.authService.validateUser({ username, password });
  }
}
