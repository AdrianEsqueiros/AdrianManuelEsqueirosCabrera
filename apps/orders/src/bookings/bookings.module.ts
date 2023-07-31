import { Module} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import {AuthModule, RmqModule} from "@app/common";
import {BILLING_SERVICE, BOOKING_SERVICE} from "../constants/services";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Booking} from "./entities/booking.entity";
import {BusSubscriber} from "../../../products/src/busses/bus.subscriber";
import {ItineraryService} from "./service/itinerary.service";

@Module({
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([Booking]),
    RmqModule.register({
        name:BOOKING_SERVICE
      }),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
  ],
  providers: [BookingsService,BusSubscriber,ItineraryService],
  controllers: [BookingsController],
  exports:[BookingsService]
})
export class BookingsModule {}
