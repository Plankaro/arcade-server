import { AsyncReturnType } from 'type-fest';
import { AuthService } from '../auth.service';

export type LocalUser = AsyncReturnType<
  typeof AuthService.prototype.validateUser
>;

export type SessionUser = AsyncReturnType<
  typeof AuthService.prototype.getSession
>;

declare module 'express' {
  interface Request {
    user?: SessionUser;
  }
}
