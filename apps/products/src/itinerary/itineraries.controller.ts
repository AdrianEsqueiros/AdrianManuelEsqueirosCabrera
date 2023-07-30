import {Body, Controller, Get, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ItinerariesService} from "./itineraries.service";
import {JwtAuthGuard} from "@app/common";
import {CreateItineraryRequest} from "./dto/create-itinerary.request";

@Controller('itineraries')
export class ItinerariesController {

    constructor(private readonly itinerariesService: ItinerariesService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createItineraries(@Body() request: CreateItineraryRequest, @Req() req:any){
        return this.itinerariesService.createItinerary(request,req.cookies?.Authentication)
    }
    @Get()
    async getItineraries(){
        return this.itinerariesService.getItinerary();
    }
    @Get('/search')
    async searchItineraries(
        @Query('originCity') originCity: string,
        @Query('destinationCity') destinationCity: string,
    ) {
        return this.itinerariesService.searchItineraries(originCity, destinationCity);
    }

}
