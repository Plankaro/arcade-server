import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prismaORM/prisma.service";
import {
    ConfirmBookingDto,
    ReleaseBookingDto,
} from "./dto/confirm-booking.dto";
import { ReturnMessage } from "src/utils/returnType";
import { BookingStatusType } from "@prisma/client";

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    async confirmBooking(details: ConfirmBookingDto): Promise<ReturnMessage> {
        try {
            const { bookingId, bookingStatus } = details;
            const isBooked = await this.prisma.confirmBooking.findUnique({
                where: {
                    isTrash: false,
                    bookingId,
                },
            });
            if (isBooked) {
                throw new ConflictException("Already Booked");
            }
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);
            await this.prisma.confirmBooking.create({
                data: {
                    bookingStatus,
                    expiresAt,
                    bookedRoom: {
                        connect: {
                            id: bookingId,
                        },
                    },
                },
            });

            return {
                success: true,
                message: "Booking Confirm Successfull",
            };
        } catch (err) {
            return {
                success: false,
                message: err.message ? err.message : "booking failed",
            };
        }
    }

    async ReleaseBooking(details: ReleaseBookingDto): Promise<ReturnMessage> {
        try {
            await this.prisma.confirmBooking.update({
                where: {
                    isTrash: false,
                    bookingId: details.bookingId,
                }, data: {
                    bookingStatus: BookingStatusType.cancled,
                    isTrash: true,
                }
            });

            await this.prisma.booking.update({
                where: {
                    isTrash: false,
                    id: details.bookingId,
                },
                data: {
                    isTrash: true,
                    isBooked: BookingStatusType.cancled,
                    floor: "",
                    room: "",
                    bookingId: ""
                }
            })



        } catch (err) {
            return {
                success: false,
                message: err.message
                    ? err.message
                    : "booking update failed deu to server issue",
            };
        }
    }
}
