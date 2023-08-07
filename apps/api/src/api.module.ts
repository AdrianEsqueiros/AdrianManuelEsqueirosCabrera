import { Module } from '@nestjs/common';
import { AUTH, RmqModule, SharedModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './controllers/billing.controller';
import { BookingsController } from './controllers/bookings.controller';
import { BussesController } from './controllers/busses.controller';
import { ItinerariesController } from './controllers/itineraries.controller';
import { BILLING, BOOKING, BUS, ITINERARY } from '@app/common';
import { UsersController } from './controllers/users.controller';
import { BILLING_SERVICE, BOOKING_SERVICE } from '@app/common/rmq/services';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', AUTH),
    SharedModule.registerRmq('BOOKING_SERVICE', BOOKING),
    SharedModule.registerRmq('BILLING_SERVICE', BILLING),
    SharedModule.registerRmq('BUS_SERVICE', BUS),
    SharedModule.registerRmq('ITINERARIES_SERVICE', ITINERARY),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api/.env',
    }),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
    RmqModule.register({
      name: BOOKING_SERVICE,
    }),
  ],
  controllers: [
    BillingController,
    BookingsController,
    BussesController,
    ItinerariesController,
    UsersController,
  ],
  providers: [],
})
export class ApiModule {}
