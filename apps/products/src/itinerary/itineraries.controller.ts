import {BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ItinerariesService} from "./itineraries.service";
import {JwtAuthGuard, RmqService} from "@app/common";
import {CreateItineraryDto} from "./dto/create-itinerary.dto";
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";
import {Column} from "typeorm";
import {IsInt, IsNotEmpty} from "class-validator";
// import {CreateItineraryRequest} from "./dto/create-itinerary.dto";
//
@Controller('itineraries')
export class ItinerariesController {
//
    constructor(
        private readonly itinerariesService: ItinerariesService,
        private readonly rmqService: RmqService
    ) {}
//
    @Post()
    @UseGuards(JwtAuthGuard)
    async createItineraries(@Body() request: CreateItineraryDto){
        return this.itinerariesService.createItinerary(request)
    }
    @Get()
    async getItineraries(){
        return this.itinerariesService.getItineraries();
    }
    @Get('/search')
    async searchItineraries(
        @Query('originCity') originCity: string,
        @Query('destinationCity') destinationCity: string,
    ) {
        return this.itinerariesService.searchItineraries(originCity, destinationCity);
    }
    @Get(':id')
    async getItineraryById(@Param ('id')id:number){
        try {
            const itinerary= await this.itinerariesService.findBy(id);
            if(itinerary){
                return itinerary
            }
            else    {
                throw new BadRequestException(`No se encontro Itinerario.`);
            }
        } catch (e){
            throw e
        }
    }
    @Patch(':id')
    async updateItinerary(@Param('id') id: number, @Body() request: CreateItineraryDto){
        return this.itinerariesService.update(id,request)
    }

    @EventPattern('booking_created')
    async itineraryUpdated(@Payload() data: any, @Ctx() context: RmqContext){
        const itinerary = await this.itinerariesService.findBy(data.itinerary_id)
        const seatsRemain =itinerary.available_seats - data.seats_count
        if (seatsRemain < 0) {
            throw new BadRequestException('No hay suficientes asientos disponibles.');
        }
        try {
            await this.itinerariesService.updateSeats(data.itinerary_id,{
                available_seats:seatsRemain
            })
        }
        catch (e)
        {
            throw e;
        }

    }

}
