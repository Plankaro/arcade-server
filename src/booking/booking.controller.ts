import { Body, Controller, Post, Get, Query } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingDto } from "./dto/booking.dto";
import { ReturnMessage } from "src/utils/returnType";
import { FilterDto } from "./dto/filterData.dto";


@Controller("booking")
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Post()
    bookRoom(
        @Body() bookingDetails: BookingDto,
    ): Promise<ReturnMessage> {
       return this.bookingService.bookRoom(bookingDetails)
    }

    @Get()
    getAllPropertyDetails(@Query() filterData: FilterDto):Promise<any>{
        return this.bookingService.getAllPropertyDetails(filterData)
    }
}
