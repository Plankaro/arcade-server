import { PropertyType } from "@prisma/client";
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BookingDto {
    @IsNotEmpty()
    @IsEnum(PropertyType)
    type: PropertyType;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    floorId: string;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    roomId: string;

    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
