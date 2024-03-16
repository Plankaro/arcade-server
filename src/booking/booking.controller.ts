import { Body, Controller, Post, Get, Query } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingDto } from "./dto/booking.dto";
import { ReturnMessage } from "src/utils/returnType";
import { FilterDto } from "./dto/filterData.dto";
import { SkipJwt } from "src/auth/decorators/jwt/skip-jwt.decorator";


@Controller("booking")
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }
    
    @SkipJwt()
    @Post()
    bookRoom(
        @Body() bookingDetails: BookingDto,
    ): Promise<ReturnMessage> {
       return this.bookingService.bookRoom(bookingDetails)
    }
   

    @SkipJwt()
    @Get()
    getAllPropertyDetails(@Query() filterData: FilterDto):Promise<any>{
        return this.bookingService.getAllPropertyDetails(filterData)
    }
}
