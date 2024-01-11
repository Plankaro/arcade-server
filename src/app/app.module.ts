import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BookingController } from "../booking/booking.controller";
import { BookingService } from "../booking/booking.service";
import { BookingModule } from "../booking/booking.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EnvironmentVariables, validate } from "../env.validation";
import { PrismaModule } from "src/prismaORM/prisma.module";
import { AdminModule } from "src/admin/admin.module";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { EmailModule } from "src/email/email.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

const config = new ConfigService<EnvironmentVariables>()

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath:
        config.get("NODE_ENV") === "production" ? ".env" : ".env.local",
      cache: true,
      validate,
    }),
    PrismaModule,
    CloudinaryModule,

    UserModule,
    BookingModule,
    AdminModule,
    EmailModule
  ],
  controllers: [AppController, BookingController],
  providers: [AppService, BookingService],
})
export class AppModule { }
