import { BookingStatusType, LockedRoomType } from "@prisma/client";
import { IsNotEmpty, IsDateString, IsString, IsMongoId, IsEnum, IsOptional } from "class-validator";

export class ConfirmBookingDto {

  @IsOptional()
  @IsEnum(BookingStatusType)
  isBooked?: BookingStatusType;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  bookingId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  roomId: string;

}

export class ReleaseBookingDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  id: string;
}