import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prismaORM/prisma.service";
import { BookingDto } from "./dto/booking.dto";
import { v4 as uuidv4 } from "uuid";

import { ReturnMessage } from "src/utils/returnType";
import { BookingStatusType } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "src/env.validation";
import { FilterDto } from "./dto/filterData.dto";
import lodash, { kebabCase } from "lodash";

@Injectable()
export class BookingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService<EnvironmentVariables, true>,
    ) { }

    async bookRoom(details: BookingDto): Promise<ReturnMessage> {
        try {
            const { floorId, roomId, ...rest } = details;
            if (!floorId || !roomId) {
                throw new NotFoundException("Room Not Found");
            }
            //check if room is already booked or not
            let isAlreadyBoooked = await this.prisma.rooms.findUnique({
                where: {
                    isTrash: false,
                    id: roomId,
                    isBooked: {
                        in: [BookingStatusType.confirm, BookingStatusType.notConfirmed, BookingStatusType.cancelled, BookingStatusType.locked],
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

                    ...rest,
                    isBooked: BookingStatusType.notConfirmed,
                    bookingId,
                    floor: {
                        connect: {
                            id: floorId,
                        },
                    },
                    room: {
                        connect: {
                            id: roomId,
                        },
                    },
                },
            }).then(async () => {
                await this.prisma.rooms.update({
                    where: {
                        isTrash: false,
                        id: roomId,
                    },
                    data: {
                        isBooked: BookingStatusType.notConfirmed
                    }
                })
            })

            //send response
            return {
                success: true,
                message: "boooking created successfull",
            };
        } catch (err) {
            // console.log(err)
            return {
                success: false,
                message: err.message ? err.message : "booking creation failed",
            };
        }
    }
 

    async getAllPropertyDetails(filterData: FilterDto): Promise<any> {
        try {
            const { type, floor, room } = filterData;
            const Type = type === "block-a" ? "Commercial" : "Residential";
            // const roomName = room.split("-").join(" ")
            console.log(type, floor, Type, room);

            const capitalizeFloor = (floor) => {
                return floor.toLowerCase().replace(/(^|-)([a-z])/g, (match, boundary, letter) => {
                  return boundary + letter.toUpperCase();
                });
              };
            
console.log(kebabCase("floor-1"))
console.log(capitalizeFloor("floor-1"))

            return await this.prisma.property.findMany({
                where: {
                    isTrash: false,
                    type: Type,
                },
                select: {
                    id: true,
                    isTrash: true,
                    type: true,
                    floors: {
                        where: {
                            isTrash: false,
                            name: capitalizeFloor(floor),
                        },
                        select: {
                            isTrash: true,
                            name: true,
                            id: true,
                            rooms: {
                                where: {
                                    isTrash: false,
                                    name: room,
                                },
                                select: {
                                    id: true,
                                    isTrash: true,
                                    name: true,
                                    isBooked: true,
                                    lock: true,
                                },
                            },
                        },
                    },
                },
            });
        } catch (err) {
            console.error(err);
            return {
                success: false,
                message:
                    this.configService.get("NODE_ENV") === "production"
                        ? "failed request"
                        : err?.message,
            };
        }
    }
}
