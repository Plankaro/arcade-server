import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prismaORM/prisma.service';
import { AccountProviderType, RoleType } from '@prisma/client';
import { filter } from 'lodash';
import { compareSync } from 'bcrypt';
import { Request, Response } from 'express';
import { LocalUser, SessionUser } from './interfaces/user.interface';
import { addDays } from 'date-fns';
import { GoogleProfileInterface } from './interfaces/google-profile.interface';
import { ConfigService } from '@nestjs/config';

import * as dotenv from 'dotenv';
import { EnvironmentVariables } from '../env.validation';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) { }

  async signIn(role: RoleType, _: SignInDto, res: Response, user: LocalUser) {
    const { id } = user;
    const User = await this.prisma.user.findUnique({
      where: {
        id,
      }, include: {
        roles: true
      }

    });
    console.log(role)
    if (!User?.roles) {
      console.log('No roles found for the user');
      throw new UnauthorizedException('Login to the dashboard is not allowed');
    }

    const userRole = User.roles.find((userRole) => userRole.name === role);
    // console.log(userRole);
    if (!userRole || role !== userRole.name) {
      console.log('Unauthorized role');
      throw new UnauthorizedException('Login to the dashboard is not allowed');
    }
    const expiryAt = addDays(new Date(), 7).toISOString();
    this.prisma.session
      .create({
        data: {
          expiryAt,
          role,
          user: {
            connect: {
              id,
            },
          },
        },
      })
      .then((session) => {
        const token = this.jwt.sign({ sid: session.id, role: session.role });
        res.cookie('token', token, {
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.status(201).json({
          // id:id,
          isActive: session.isActive,
        });
      });
  }

  async validateUser(payload: SignInDto) {
    const { username, password } = payload;
    return this.prisma.user
      .findUnique({
        where: {
          mobileNumber: username,
          isTrash: false,
          accounts: {
            some: {
              provider: AccountProviderType.CREDENTIAL,
              isTrash: false,
              passwordHash: {
                not: null,
              },
              OR: [
                {
                  username: {
                    equals: username,
                  },
                },
                {
                  email: {
                    equals: username,
                  },
                },
                {
                  mobileNumber: {
                    equals: username,
                  },
                },
              ],
            },
          },
        },
        select: {
          id: true,
          mobileNumber: true,
          accounts: {
            where: {
              isTrash: false,
              provider: AccountProviderType.CREDENTIAL,
            },
          },
        },
      })
      .then((user) => {
        if (!user) throw new NotFoundException();
        const { accounts } = user;
        const isPasswordValid = filter(accounts).some((account) => {
          const { passwordHash } = account;
          if (!passwordHash) return false;
          return compareSync(password, passwordHash);
        });
        if (!isPasswordValid) throw new UnauthorizedException();
        return user;
      });
  }

  async validateGoogleLoginUser(profile: GoogleProfileInterface) {
    const { emails, id } = profile;
    const email = emails[0].value;
    try {
      const user: any = await this.prisma.user.findUnique({
        where: {
          email,
          isTrash: false,
        },
      });
      if (!user) {
        return false;
      }
      return user;

    } catch (err: any) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  async getSession(Userrole: RoleType, id: string) {
    return this.prisma.session
      .findUnique({
        where: {
          id,
          isActive: true,
          user: {
            isNot: undefined,
          },
        },
        include: {
          user: {
            include: {
              studyMaterial: {
                where: {
                  isTrash: false,
                },
              },
              reviews: {
                where: {
                  isTrash: false,
                },
              },
              purchase: {
                where: {
                  isTrash: false,
                },
              },
              studentProgress: {
                where: {
                  isTrash: false,
                },
              },
              teacherProgress: {
                where: {
                  isTrash: false,
                },
              },
              roles: true,
              studyCourses: {
                where: {
                  isTrash: false,
                },
                include: {
                  categories: {
                    where: {
                      isTrash: false,
                    },
                  },
                  reviews: {
                    where: {
                      isTrash: false,
                    },
                  },
                  module: {
                    where: {
                      isTrash: false,
                    },
                    include: {
                    lectures:{
                      include:{
                        live:true
                      }
                    }
                    },
                  },
                },
              },
              teachCourses: {
                where: {
                  isTrash: false,
                },
              },
            },
          },
        },
      })
      .then((session) => {
        if (!session) throw new NotFoundException();
        const role = session?.role
        // console.log({session, role});
        if (Userrole !== role) {
          console.log({ Userrole, role });
          throw new BadRequestException(`please logged in to ${role} dashboard`);
        }

        return session;
      });
  }

  async googleLogin(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new NotFoundException("User isn't found");
    }
    const user: any = req.user;
    console.log(user.data);
    const isProd = process.env.NODE_ENV === 'production';
    const redirectUrl = !isProd
      ? 'http://localhost:3000'
      : 'https://gpftpsconline.com';

    if (user.isExistingUser) {
      // const account = user.data;
      const { id } = user.data;
      const expiryAt = addDays(new Date(), 7).toISOString();
      this.prisma.session
        .create({
          data: {
            expiryAt,
            role: RoleType.STUDENT,
            user: {
              connect: {
                id,
              },
            },
          },
        })
        .then((session) => {
          const token = this.jwt.sign({ sid: session.id, role: session.role });
          // console.log('-> token', token);
          res
            .cookie('token', token, {
              sameSite: 'strict',
              secure: isProd,
              maxAge: 1000 * 60 * 60 * 24 * 7,
            })
            .redirect(redirectUrl);
        });
    } else {
      res.redirect("https://gpftpsconline.com/register")
      // res.send(
      //   `<h1>Please sign up first </h1> </br> <a href="${redirectUrl}">Go Home</a>`,
      // );
    }
  }

  async signOut(res: Response, session: SessionUser) {
    const { id } = session;
    this.prisma.session
      .update({
        where: {
          id,
        },
        data: {
          isActive: false,
        },
      })
      .then(({ isActive }) => {
        res.clearCookie('token');
        res.status(201).json({
          isActive,
        });
      });
  }
}
