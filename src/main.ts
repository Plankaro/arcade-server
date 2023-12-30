import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

import * as CookieParser from "cookie-parser";
import { json, urlencoded } from "express";

import { yellow } from "@nestjs/common/utils/cli-colors.util";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./env.validation";

const globalPrefix = "api/v1";
const port = process.env.PORT || 5000;
const logger = new Logger("Main");

const config = new ConfigService<EnvironmentVariables, true>();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.use(CookieParser());
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(port);
}
const start = Date.now();
bootstrap().then(() => {
  const end = Date.now();
  logger.log(`🚀 Application started in ${yellow(end - start + "ms")}`);
  logger.log(
    `${config.get("NODE_ENV") || "Development"
    } Application running in  http://localhost:${port}/${globalPrefix} 🚀🚀`,
  );
});
