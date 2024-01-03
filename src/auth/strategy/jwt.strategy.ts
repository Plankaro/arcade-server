import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TokenCookie } from '../interfaces/jwt-session.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          console.log('-> req', req?.headers?.authorization);
          // console.log(req)
          return (
            req?.cookies?.token || req?.headers?.authorization?.split(' ')[1]
          );
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenCookie) {
    const { sid, role } = payload;
    console.log(payload.role)
    return await this.authService.getSession(role, sid);
    // const { sid } = payload;
    // return await this.authService.getSession(sid);
  }
}
