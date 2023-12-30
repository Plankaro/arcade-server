import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prismaORM/prisma.service";
import { ConfirmBookingDto } from "./dto/confirm-booking.dto";
import { ReturnMessage } from "src/utils/returnType";

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
                message: "Booking Confirm Successfull"
            }
        } catch (err) {
            return {
                success: false,
                message: err.message ? err.message : "booking failed",
            };
        }
    }
}
