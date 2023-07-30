import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Bus, BusSchema} from "./schemas/bus.schema";
import {BussesService} from "./busses.service";
import {BussesRepository} from "./busses.reporsitory";
import {BussesController} from "./busses.controller";
import {AuthModule, DatabaseModule} from "@app/common";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        MongooseModule.forFeature([{name: Bus.name, schema: BusSchema}]),
    ],
    controllers: [BussesController],
    providers: [BussesService,BussesRepository],
    exports: [BussesService,BussesRepository],
})
export class BussesModule {}
