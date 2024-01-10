import { BookingStatusType, Prisma, PropertyType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class GetBookingDto {
    @IsNotEmpty()
    @IsEnum(PropertyType)
    propertyType: PropertyType;

    @IsString()
    bookingId: string

    @IsNotEmpty()
    @IsString()
    floor: string;

    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsEnum(BookingStatusType)
    isBooked: BookingStatusType


    @IsNotEmpty()
    @IsEmail()
    userEmail: string;

}
