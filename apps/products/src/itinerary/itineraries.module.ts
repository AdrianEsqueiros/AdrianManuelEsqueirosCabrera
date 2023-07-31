import { Module } from '@nestjs/common';

import {AuthModule, RmqModule} from "@app/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Itinerary} from "./entities/itinerary.entity";
import {ItinerariesController} from "./itineraries.controller";
import {ItinerarySubscriber} from "./itinerary.subscriber";
import {ItinerariesService} from "./itineraries.service";
import {BussesModule} from "../busses/busses.module";

@Module({
    imports:[
      AuthModule,RmqModule,BussesModule,
      TypeOrmModule.forFeature([Itinerary]),
    ],
    controllers:[ItinerariesController],
    providers: [ItinerarySubscriber, ItinerariesService],
    exports:[ItinerariesService]
})
export class ItinerariesModule {}
