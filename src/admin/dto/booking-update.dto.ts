import { IsOptional, IsString, IsEmail } from "class-validator";

export class updateBookingDto {
    @IsOptional()
    @IsString()
    floor: string;

    @IsOptional()
    @IsString()
    room: string;

    @IsOptional()
    @IsString()
    userName: string;

    @IsOptional()
    @IsEmail()
    userEmail: string;
}
