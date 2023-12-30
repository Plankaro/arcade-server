import { PropertyType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class BookingDto {
    @IsNotEmpty()
    @IsEnum(PropertyType)
    propertyType: PropertyType;

    @IsNotEmpty()
    @IsString()
    floor: string;

    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    userEmail: string;
}
