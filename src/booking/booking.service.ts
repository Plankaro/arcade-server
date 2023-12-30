import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prismaORM/prisma.service";
import { BookingDto } from "./dto/booking.dto";

import { v4 as uuidv4 } from "uuid";

interface ReturnMessage {
    success: boolean;
    message: string;
}

@Injectable()
export class BookingService {
    constructor(private readonly prisma: PrismaService) { }

    async bookRoom(details: BookingDto): Promise<ReturnMessage> {
        try {
            const isAlreasyBoooked = await this.prisma.booking.findUnique({
                where: {
                    propertyType: details.propertyType,
                    floor: details.floor,
                    room: details.room,
                },
            });

            if (isAlreasyBoooked) {
                throw new ConflictException("This Room already booked");
            }
            const bookingId = uuidv4();
            await this.prisma.booking.create({
                data: {
                    ...details,
                    bookingId,
                },
            });

            return {
                success: true,
                message: "boooking created successfull",
            };
        } catch (err) {
            return {
                success: true,
                message: err.message ? err.message : "booking creation failed",
            };
        }
    }
}
