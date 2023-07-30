import { Module } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import {ItinerariesRepository} from "./itineraries.repository";
import {ItinerariesController} from "./itineraries.controller";
import {AuthModule, DatabaseModule} from "@app/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Itinerary, ItinerarySchema} from "./schemas/itinerary.schema";
import {BussesRepository} from "../busses/busses.reporsitory";
import {Bus, BusSchema} from "../busses/schemas/bus.schema";

@Module({
  imports:[
      DatabaseModule,
      AuthModule,
      MongooseModule.forFeature([{name: Itinerary.name, schema: ItinerarySchema},{name: Bus.name,schema:BusSchema}])
  ],
  controllers:[ItinerariesController],
  providers: [ItinerariesService, ItinerariesRepository, BussesRepository]
})
export class ItinerariesModule {}
