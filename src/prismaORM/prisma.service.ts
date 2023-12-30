import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { Environment, EnvironmentVariables } from "../env.validation";
import * as util from "util";

const configService = new ConfigService<EnvironmentVariables>();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      errorFormat:
        configService.get("NODE_ENV", { infer: true }) ===
        Environment.Production
          ? "minimal"
          : "colorless",
    });
  }

  async onModuleInit() {
    this.logger.log("Initializing Prisma");
    await this.$connect()
      .then(() => {
        this.logger.log("Prisma Connected");
      })
      .catch((err) => {
        this.logger.error("Prisma Connection Error", err.message);
      });

    this.$extends({
      query: {
        $allOperations: async ({ query, operation, model, args }) => {
          const before = Date.now();
          const result = await query(args);
          const after = Date.now();
          const time = after - before;
          this.logger.log(
            util.inspect(
              {
                model,
                operation,
                args,
                time,
              },
              { depth: null, colors: true },
            ),
          );
          return result;
        },
      },
    });
  }

}
