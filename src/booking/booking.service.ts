import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prismaORM/prisma.service";
import { BookingDto } from "./dto/booking.dto";
import { v4 as uuidv4 } from "uuid";

import { ReturnMessage } from "src/utils/returnType";



@Injectable()
export class BookingService {
    constructor(private readonly prisma: PrismaService) { }

    async bookRoom(details: BookingDto): Promise<ReturnMessage> {
        try {

            //check if room is already booked or not
            const isAlreasyBoooked = await this.prisma.booking.findUnique({
                where: {
                    propertyType: details.propertyType,
                    floor: details.floor,
                    room: details.room,
                },
            });

            //if already booked then throw exception
            if (isAlreasyBoooked) {
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
