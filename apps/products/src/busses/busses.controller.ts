import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {BussesService} from "./busses.service";
import {JwtAuthGuard} from "@app/common";
import {CreateBusRequest} from "./dto/create-bus.request";

@Controller('busses')
export class BussesController {
    constructor(private readonly bussesService: BussesService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createBuses(@Body() request: CreateBusRequest, @Req() req:any){
        return this.bussesService.createBus(request,req.cookies?.Authentication)
    }
    @Get()
    async getBuses(){
        return this.bussesService.getBuses();
    }
}
