import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ConfirmBookingDto, ReleaseBookingDto } from './dto/confirm-booking.dto';
import { ReturnMessage } from 'src/utils/returnType';
import { Prisma, Property } from '@prisma/client';
import { PropertyDto } from './dto/property.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get()
    getAllBooking(): Promise<any> {
        return this.adminService.getAllBooking()
    }
    @Get("history")
    getAllBookingHistory(): Promise<any> {
        return this.adminService.getAllBookingHistory()
    }
    @Post()
    confirmBooking(@Body() details: ConfirmBookingDto): Promise<ReturnMessage> {
        return this.adminService.confirmBooking(details)
    }

    @Post("/property")
    addProperty(@Body() details: PropertyDto): Promise<ReturnMessage> {
        return this.adminService.addProperty(details)
    }
    @Get("/property")
    getAllProperty(): Promise<any> {
        return this.adminService.getAllProperty()
    }



    @Put()
    ReleaseBooking(@Body() id: ReleaseBookingDto): Promise<ReturnMessage> {
        return this.adminService.ReleaseBooking(id)
    }
    @Put("/lock")
    LockBooking(@Body() id: ReleaseBookingDto): Promise<ReturnMessage> {
        return this.adminService.LockBooking(id)
    }


}
