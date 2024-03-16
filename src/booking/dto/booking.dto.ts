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

    @IsOptional()
    @IsString()
    mobileNumber?: string;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    roomId: string;

    @IsOptional()
    @IsString()
    userName?: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    email: string;
}
