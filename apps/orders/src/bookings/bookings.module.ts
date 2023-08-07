import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { AUTH, ITINERARY, RmqModule, SharedModule } from '@app/common';
import { BILLING_SERVICE, BOOKING_SERVICE } from '../constants/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BusSubscriber } from '../../../products/src/busses/bus.subscriber';
import { RmqService } from '@app/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    RmqModule.register({
      name: BOOKING_SERVICE,
    }),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
    SharedModule.registerRmq('ITINERARIES_SERVICE', ITINERARY),
    SharedModule.registerRmq('AUTH_SERVICE', AUTH),
    RmqModule,
  ],
  providers: [
    BookingsService,
    BusSubscriber,
    {
      provide: 'SharedServiceInterface',
      useClass: RmqService,
    },
  ],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
