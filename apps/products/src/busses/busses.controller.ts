import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {BussesService} from "./busses.service";
import {JwtAuthGuard, RmqService} from "@app/common";
import {CreateBusDto} from "./dto/create-bus.dto";

@Controller('busses')
export class BussesController {
    constructor(
        private readonly bussesService: BussesService,
        private readonly rmqService: RmqService
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
}
