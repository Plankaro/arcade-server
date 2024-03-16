import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ConfirmBookingDto, ReleaseBookingDto } from './dto/confirm-booking.dto';
import { ReturnMessage } from 'src/utils/returnType';
import { Prisma, Property } from '@prisma/client';
import { PropertyDto, PropertyTypes } from './dto/property.dto';
import { SkipJwt } from 'src/auth/decorators/jwt/skip-jwt.decorator';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @SkipJwt()
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

    @SkipJwt()
    @Post("/property")
    addProperty(@Body() details: PropertyDto): Promise<ReturnMessage> {
        return this.adminService.addProperty(details)
    }
    @SkipJwt()
    @Get("/details")
    getAllDetails(): Promise<any> {
        return this.adminService.getAllDetails()
    }
    

    @SkipJwt()
    @Get("/:type")
    getAllProperty(@Param() PropertyType: PropertyTypes): Promise<any> {
        return this.adminService.getAllProperty(PropertyType)
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
