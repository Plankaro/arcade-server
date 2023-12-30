import { BookingStatusType } from "@prisma/client";
import { IsNotEmpty, IsDateString, IsString, IsMongoId, IsEnum } from "class-validator";

export class ConfirmBookingDto {

  @IsNotEmpty()
  @IsEnum(BookingStatusType)
  bookingStatus: BookingStatusType;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  bookingId: string;

}

export class ReleaseBookingDto{
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  bookingId: string;
}