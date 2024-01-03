import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ConfirmBookingDto, ReleaseBookingDto } from './dto/confirm-booking.dto';
import { ReturnMessage } from 'src/utils/returnType';
import { Prisma } from '@prisma/client';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get()
    getAllBooking(): Promise<Prisma.BookingCreateInput[]> {
        return this.adminService.getAllBooking()
    }
    @Post()
    confirmBooking(@Body() details: ConfirmBookingDto): Promise<ReturnMessage> {
        return this.adminService.confirmBooking(details)
    }

    @Put()
    ReleaseBooking(@Body() id: ReleaseBookingDto): Promise<ReturnMessage> {
        return this.adminService.ReleaseBooking(id)
    }


}
