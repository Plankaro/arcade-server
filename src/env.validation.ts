import { Type, plainToInstance } from "class-transformer";
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUrl,
    ValidateIf,
    validateSync,
} from "class-validator";

export enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
    Provision = "provision",
}

export class EnvironmentVariables {
    @IsOptional()
    @IsEnum(Environment)
    @IsNotEmpty()
    NODE_ENV: Environment;

    @ValidateIf((o) => o.NODE_ENV === Environment.Production)
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    PORT: number;

    @IsUrl({ protocols: ["mongodb+srv"] })
    @IsNotEmpty()
    DATABASE_URL: string;

    @IsNotEmpty()
    JWT_SECRET: string;

    @IsNotEmpty()
    JWT_EXPIRATION_TIME: string;

    @Type(() => Number)
    @IsNotEmpty()
    COOKIE_EXPIRATION_TIME: number;

    @IsNotEmpty()
    BCRYPT_SALT_ROUNDS: number;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
