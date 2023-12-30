import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
// import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
  providers: [
    PrismaService,
    // {
    //   provide: APP_FILTER,
    //   useClass: PrismaClientExceptionFilter,
    // },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
