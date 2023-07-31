import { Module } from '@nestjs/common';
import {BussesService} from "./busses.service";
import {BussesController} from "./busses.controller";
import {AuthModule} from "@app/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BusSubscriber} from "./bus.subscriber";
import {Bus} from "./entities/bus.entity";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Bus]),
    ],
    controllers: [BussesController],
    providers: [BussesService,BusSubscriber],
    exports: [BussesService],
})
export class BussesModule {}
