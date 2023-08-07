import {Body, Controller, Get, Inject, Post, Req, UseGuards} from '@nestjs/common';
import {BookingsService} from "./bookings.service";
import {JwtAuthGuard} from "@app/common";
import {CreateBookingDto} from "./dto/create-booking.dto";
import {CurrentUser} from "../../../auth/src/current-user.decorator";
import {User} from "../../../auth/src/users/schemas/user.schema";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {SharedServiceInterface} from "@app/common/interface/services/shared.service.interface";
import {Booking} from "./entities/booking.entity";

@Controller('bookings')
export class BookingsController {

    constructor(
        private readonly bookingService:BookingsService,
        @Inject('SharedServiceInterface')
        private sharedService: SharedServiceInterface,
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
    @MessagePattern({ cmd: 'create_booking' })
    async createSeat(
        @Ctx() ctx: RmqContext,
        @Payload() dto: CreateBookingDto,user:User,authentication:string
    ): Promise<Booking> {
        this.sharedService.acknowledgeMessage(ctx);
        return await this.bookingService.createBooking(dto, user, authentication);
    }
}
