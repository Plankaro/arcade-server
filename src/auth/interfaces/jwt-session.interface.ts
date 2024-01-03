import { RoleType } from "@prisma/client";

export interface TokenCookie {
  sid: string;
  iat: number;
  exp: number;
  role: RoleType
}
