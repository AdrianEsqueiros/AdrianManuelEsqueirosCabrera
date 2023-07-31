import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {BookingsService} from "./bookings.service";
import {JwtAuthGuard} from "@app/common";
import {CreateBookingDto} from "./dto/create-booking.dto";
import {CurrentUser} from "../../../auth/src/current-user.decorator";
import {User} from "../../../auth/src/users/schemas/user.schema";

@Controller('bookings')
export class BookingsController {

    constructor(
        private readonly bookingService:BookingsService,
    ) {
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    async createBooking(@Body() request: CreateBookingDto,@CurrentUser() user: User,@Req() req: any) {
        try {
            return await this.bookingService.createBooking(request,user, req.cookies?.Authentication);
        }catch (e) {
            throw e
        }
    }

}
