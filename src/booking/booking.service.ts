import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prismaORM/prisma.service";
import { BookingDto } from "./dto/booking.dto";
import { v4 as uuidv4 } from "uuid";

import { ReturnMessage } from "src/utils/returnType";
import { BookingStatusType } from "@prisma/client";

@Injectable()
export class BookingService {
    constructor(private readonly prisma: PrismaService) { }

    async bookRoom(details: BookingDto): Promise<ReturnMessage> {
        try {
            //check if room is already booked or not
            let isAlreadyBoooked = await this.prisma.booking.findUnique({
                where: {
                    isTrash: false,
                    propertyType: details.propertyType,
                    floor: details.floor,
                    room: details.room,
                    isBooked: {
                        in: [BookingStatusType.confirm, BookingStatusType.pending],
                    },
                },
            });

            //if already booked then throw exception
            if (isAlreadyBoooked) {
                throw new ConflictException("This Room already booked");
            }

            //generate unique id for each room created
            const bookingId = uuidv4();

            //create booking
            await this.prisma.booking.create({
                data: {
                    ...details,
                    bookingId,
                },
            });

            //send response
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
