import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prismaORM/prisma.service";
import {
  ConfirmBookingDto,
  ReleaseBookingDto,
} from "./dto/confirm-booking.dto";
import { ReturnMessage } from "src/utils/returnType";
import { BookingStatusType, LockedRoomType, Prisma } from "@prisma/client";
import { PropertyDto, PropertyTypes } from "./dto/property.dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllBooking(): Promise<any> {
    return this.prisma.booking.findMany({
      where: {
        isTrash: false,
      },
      include: {
        floors: true,
        rooms: true,
      },
    });
  }

  async getAllBookingHistory(): Promise<any> {
    return await this.prisma.booking.findMany({
      where: {
        isTrash: true,
      },
      include: {
        floors: {
          where: {
            isTrash: false,
          },
        },
        rooms: {
          where: {
            isTrash: false,
          },
        },
      },
    });
  }

  async confirmBooking(details: ConfirmBookingDto): Promise<ReturnMessage> {
    try {
      // console.log(details)
      const { bookingId, roomId, ...rest } = details;
      console.log(details)
      if(details.isBooked !== "locked"){
        // let isAllreadyBooked ;
         
      const  isAllreadyBooked = await this.prisma.booking.findUnique({
         where: {
           isTrash: false,
           id: bookingId,
         },
       });
       if (!isAllreadyBooked) {
         throw new NotFoundException("Booking not found");
       }
      }
      if (details.isBooked === "pending") {
        console.log("called");
        await this.prisma.booking
          .update({
            where: {
              id: bookingId,
            },
            data: {
              isTrash: true,
            },
          })
          .then(async () => {
            await this.prisma.rooms.update({
              where: {
                id: roomId,
              },
              data: {
                isBooked: BookingStatusType.pending,
              },
            });
          });
      } else if (details.isBooked === "cancelled") {
        await this.prisma.rooms
          .update({
            where: {
              isTrash: false,
              id: roomId,
            },
            data: {
              isBooked: BookingStatusType.pending,
            },
          })
          .then(async () => {
            await this.prisma.booking.update({
              where: {
                isTrash: false,
                id: bookingId,
              },
              data: {
                isTrash: true,
                isBooked: BookingStatusType.cancelled,
              },
            });
          });
      } else if (details.isBooked === "locked") {
        await this.prisma.rooms.update({
          where: {
            isTrash: false,
            id: roomId
          }, data: {
            isBooked: BookingStatusType.confirm,
            lock: LockedRoomType.locked
          }
        })


      } else {
        await this.prisma.booking
          .update({
            where: {
              isTrash: false,
              id: bookingId,
            },
            data: {
              ...rest,
            },
          })
          .then(async () => {
            await this.prisma.rooms.update({
              where: {
                isTrash: false,
                id: roomId,
              },
              data: {
                ...rest,
              },
            });
          });
      }

      return {
        success: true,
        message: `Booking ${details.isBooked} Successfull`,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message ? err.message : "booking failed",
      };
    }
  }

  async addProperty(details: PropertyDto): Promise<ReturnMessage> {
    try {
      const { type, floors } = details;
      const createdProperty = await this.prisma.property.create({
        data: {
          type,
          floors: {
            create: floors.map((floor) => ({
              name: floor.name,
              rooms: {
                create: floor.rooms.map((room) => ({
                  name: room.name,
                })),
              },
            })),
          },
        },
        include: {
          floors: {
            include: {
              rooms: true,
            },
          },
        },
      });
      // console.log(createdProperty)
      return {
        success: true,
        message: "Property added successfully",
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: err.message ? err.message : "property Add Failed",
      };
    }
  }

  getAllProperty(PropertyType: PropertyTypes): Promise<any> {
    return this.prisma.property.findMany({
      where: {
        isTrash: false,
        type: PropertyType.type

      },
      select: {
        id: true,
        type: true,
        floors: {
          select: {
            id: true,
            name: true,
            rooms: {
              select: {
                id: true,
                name: true,
                isBooked: true,
                lock: true,
              },
            },
          },
        },
      },
    });
  }

  async getAllDetails(): Promise<any> {
    const totalBooking = await this.prisma.booking.count({
      where: {
        isTrash: false
      }
    })
    const pendingApproval = await this.prisma.booking.count({
      where: {
        isTrash: false,
        isBooked: BookingStatusType.notConfirmed
      }
    })

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const dayBooking = await this.prisma.booking.count({
      where: {
        isTrash: false,
        createdAt: {
          gte: twentyFourHoursAgo
        }
      }
    });

    return {
      totalBooking,
      pendingApproval,
      dayBooking
    };


  }

  async ReleaseBooking(details: ReleaseBookingDto): Promise<ReturnMessage> {
    try {
      const bookings = await this.prisma.booking.findUnique({
        where: {
          isTrash: false,
          id: details.id,
          lock: LockedRoomType.normal,
        },
      });

      if (!bookings) {
        throw new NotFoundException("bookings not found");
      }

      await this.prisma.booking.update({
        where: {
          isTrash: false,
          id: details.id,
          lock: LockedRoomType.normal,
        },
        data: {
          isTrash: true,
          isBooked: BookingStatusType.cancelled,
        },
      });

      return {
        success: true,
        message: "Room Release successfully",
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
          ? err.message
          : "booking update failed deu to server issue",
      };
    }
  }
  async LockBooking(details: ReleaseBookingDto): Promise<ReturnMessage> {
    try {
      const bookings = await this.prisma.rooms.findUnique({
        where: {
          isTrash: false,
          id: details.id,
          lock: LockedRoomType.normal,
        },
      });

      if (!bookings) {
        throw new NotFoundException("bookings not found");
      }

      await this.prisma.rooms.update({
        where: {
          isTrash: false,
          id: details.id,
          lock: LockedRoomType.normal,
        },
        data: {
          isBooked: BookingStatusType.confirm,
          lock: LockedRoomType.locked,
        },
      });

      return {
        success: true,
        message: "Room Locked successfully",
      };
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
