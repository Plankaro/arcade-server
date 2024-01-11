import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
  imports: [AdminModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
