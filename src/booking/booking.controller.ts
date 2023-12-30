import { Body, Controller, Post } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingDto } from "./dto/booking.dto";

interface ReturnMessage {
    success: boolean;
    message: string;
}

@Controller("booking")
export class BookingController {
    constructor(private readonly bookService: BookingService) { }

    @Post()
    bookRoom(
        @Body() bookingDetails: BookingDto,
    ): Promise<ReturnMessage> {
       return this.bookService.bookRoom(bookingDetails)
    }
}
