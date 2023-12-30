import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BookingController } from "../booking/booking.controller";
import { BookingService } from "../booking/booking.service";
import { BookingModule } from "../booking/booking.module";
import { ConfigModule } from "@nestjs/config";

import { validate } from "../env.validation";
import { PrismaModule } from "src/prismaORM/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
      validate,
    }),
    PrismaModule,
    BookingModule,
  ],
  controllers: [AppController, BookingController],
  providers: [AppService, BookingService],
})
export class AppModule { }
