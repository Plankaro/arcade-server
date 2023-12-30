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
    BookingModule,
    AdminModule
  ],
  controllers: [AppController, BookingController],
  providers: [AppService, BookingService],
})
export class AppModule { }
