import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccountProviderType, RoleType } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../env.validation';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { capitalize } from 'lodash';
import {
  GetUserByDto,
  GetUserByRoleDto,
  GetUserFromWebsocket,
} from './dto/get-user.dto';
import { DeleteUsersDto } from './dto/delete-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPassword } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SessionUser } from '../auth/interfaces/user.interface';
import { PrismaService } from 'src/prismaORM/prisma.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private config: ConfigService<EnvironmentVariables>,
    private cloudinary: CloudinaryService,
    private readonly emailservice: EmailService,
  ) { }

  async createUser(role: RoleType, data: CreateUserDto) {
    const { email, firstName, mobileNumber, image, password, ...rest } = data;

    let tempPassword: string;
    const saltRounds = genSaltSync(this.config.get('BCRYPT_SALT_ROUNDS'));
    if (password) {
      tempPassword = password;
    } else {
      const tempFirstName = capitalize(
        firstName.substring(0, firstName.length > 4 ? 4 : firstName.length),
      );
      const tempMobileNumber = mobileNumber.substring(
        mobileNumber.length -
        (tempFirstName.length >= 4 ? 4 : 4 + (4 - tempFirstName.length)),
        mobileNumber.length,
      );
      tempPassword = `${tempFirstName}@${tempMobileNumber}`;
    }

    console.log('-> tempPassword', tempPassword);

    return this.prisma.user
      .findUnique({
        where: {
          mobileNumber,
          email
        },
        select: {
          id: true,
        },
      })
      .then(async (value) => {
        if (value) {
          throw new ConflictException({
            msg: 'user already registered 👌',
          });
        }
        const imageUpload = (await this.cloudinary.uploadFiles(image))[0];
        return this.prisma.user.create({
          data: {
            email,
            firstName,
            mobileNumber,
            ...(imageUpload &&
              imageUpload.url && {
              image: {
                set: {
                  name: imageUpload.original_filename,
                  url: imageUpload.url,
                },
              },
            }),
            ...rest,
            roles: RoleType.ADMIN,
            accounts: {
              create: {
                provider: AccountProviderType.CREDENTIAL,
                providerId: AccountProviderType.CREDENTIAL,
                email,
                mobileNumber,
                username: mobileNumber,
                passwordHash: hashSync(tempPassword, saltRounds),
              },
            },
          },
          include: {
            accounts: true,
          },
        });
      });
  }

  async updateUser(role: RoleType, data: UpdateUserDto) {
    const { id, image, ...rest } = data;
    console.log("called")
    const imageUpload = image
      ? (await this.cloudinary.uploadFiles(image))[0]
      : undefined;
    return this.prisma.user.update({
      where: {
        id,
        isTrash: false,
        // roles: {
        //   some: {
        //     name: role,
        //   },
        // },
      },
      data: {
        ...rest,
        ...(image &&
          imageUpload &&
          imageUpload.url && {
          image: {
            set: {
              name: imageUpload.original_filename,
              url: imageUpload.url,
            },
          },
        }),
      },
    });
  }



  getAllUsers(params: GetUserByRoleDto) {
    const { role } = params;
    return this.prisma.user.findMany({
      where: {
        isTrash: false,
        // roles: {
        //   some: {
        //     name: role,
        //   },
        // },
      },
      // include: {
      //   roles: {
      //     select: {
      //       id: true,
      //       name: true,
      //       description: true,
      //       createdAt: true,
      //       updatedAt: true,
      //     },
      //   },
      // },
      // orderBy: {
      //   createdAt: 'desc',
      // },
    });
  }

  async sendOtp(email: string) {
    try {
      const otpData = await this.prisma.otp.findFirst({
        where: {
          email,
        },
      });
      if (otpData) {
        await this.prisma.otp.delete({
          where: {
            email,
          },
        });
      }

      function generateSixDigitOTP(): number {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const otp: number = generateSixDigitOTP();
      await this.emailservice.sendOTPEmail(email, otp);
      await this.prisma.otp.create({
        data: {
          email,
          otp,
        },
      });
      return {
        success: true,
        message: 'otp send sucessfully',
      };
    } catch (err) {
      return new InternalServerErrorException({
        success: false,
        message: 'otp send failed',
      });
    }
  }

  async verifyOtp(email: string, otp: number): Promise<any> {
    try {
      const otpData = await this.prisma.otp.findFirst({
        where: {
          AND: [{ email }, { otp }],
        },
      });
      if (!otpData) {
        throw new NotFoundException({ message: 'No otp found' });
      }

      return {
        success: true,
        message: 'otp successfully verified',
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async forgotPassword(data: ForgotPassword): Promise<any> {
    try {
      const { email, newPassword } = data;
      const saltRounds = genSaltSync(this.config.get('BCRYPT_SALT_ROUNDS'));
      return this.prisma.account.updateMany({
        where: {
          email,
          isTrash: false,
          provider: AccountProviderType.CREDENTIAL,
        },
        data: {
          passwordHash: hashSync(newPassword, saltRounds),
        },
      });
    } catch (err: any) {
      return new InternalServerErrorException(err.message);
    }
  }

  async changePassword(data: ChangePasswordDto, session: SessionUser) {
    const { oldPassword, newPassword } = data;
    const { userId } = session;
    const saltRounds = genSaltSync(this.config.get('BCRYPT_SALT_ROUNDS'));

    return this.prisma.user
      .findUnique({
        where: {
          id: userId,
        },
        include: {
          accounts: {
            where: {
              isTrash: false,
              provider: AccountProviderType.CREDENTIAL,
            },
          },
        },
      })
      .then((value) => {
        if (!value) {
          throw new NotFoundException({
            msg: "User isn't found",
          });
        } else {
          const { accounts } = value;
          const account = accounts[0];
          if (!account) {
            throw new NotFoundException({
              msg: "Account isn't found",
            });
          } else {
            const { id, passwordHash } = account;
            if (passwordHash && compareSync(oldPassword, passwordHash)) {
              return this.prisma.account.update({
                where: {
                  id,
                },
                data: {
                  passwordHash: hashSync(newPassword, saltRounds),
                },
              });
            } else {
              throw new NotFoundException({
                msg: 'Old Password is incorrect',
              });
            }
          }
        }
      });
  }

  async deleteUser(body: DeleteUsersDto) {
    const { ids } = body;
    return this.prisma.user
      .updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          isTrash: true,
        },
      })
      .then(({ count }) => {
        return {
          count,
          message: `Deleted ${count} users`,
        };
      });
  }

  getUserById(params: GetUserByDto) {
    const { id } = params;
    return this.prisma.user.findUnique({
      where: {
        id,
        isTrash: false,
      },
    });
  }

}
