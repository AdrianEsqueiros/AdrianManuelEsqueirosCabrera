import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BussesModule } from './busses/busses.module';
import { ItinerariesModule } from './itinerary/itineraries.module';
import { AUTH, DatabaseSQLModule, SharedModule } from '@app/common';
import { ItinerarySubscriber } from './itinerary/itinerary.subscriber';

@Module({
  imports: [
    DatabaseSQLModule,
    BussesModule,
    ItinerariesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/products/.env',
    }),
    SharedModule.registerRmq('AUTH_SERVICE', AUTH),
  ],
  controllers: [],
  providers: [ItinerarySubscriber],
})
export class ProductsModule {}
