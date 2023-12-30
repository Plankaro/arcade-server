import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';
import { ReturnMessage } from 'src/utils/returnType';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    confirmBooking(@Body() details: ConfirmBookingDto): Promise<ReturnMessage> {
        return this.adminService.confirmBooking(details)

    }


}
