import {Body, Controller, Get, Inject, Post, Req, UseGuards} from '@nestjs/common';
import {BussesService} from "./busses.service";
import {JwtAuthGuard, RmqService} from "@app/common";
import {CreateBusDto} from "./dto/create-bus.dto";
import {BookingsService} from "../../../orders/src/bookings/bookings.service";
import {SharedServiceInterface} from "@app/common/interface/services/shared.service.interface";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateBookingDto} from "../../../orders/src/bookings/dto/create-booking.dto";
import {User} from "../../../auth/src/users/schemas/user.schema";
import {Booking} from "../../../orders/src/bookings/entities/booking.entity";
import {Bus} from "./entities/bus.entity";

@Controller('busses')
export class BussesController {
    constructor(
        private readonly bussesService: BussesService,
        private readonly rmqService: RmqService,
        @Inject('SharedServiceInterface')
        private sharedService: SharedServiceInterface,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createBuses(@Body() request: CreateBusDto){
        return await this.bussesService.createBus(request);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getBuses(){
        return this.bussesService.getBuses();
    }

    @MessagePattern({ cmd: 'create_buses' })
    async createBooking(
        @Ctx() ctx: RmqContext,
        @Payload() request: CreateBusDto
    ): Promise<Bus> {
        this.sharedService.acknowledgeMessage(ctx);
        return await this.bussesService.createBus(request);
    }
}
