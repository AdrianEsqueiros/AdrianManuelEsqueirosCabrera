import { Module } from '@nestjs/common';

import { AUTH, RmqModule, SharedModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { ItinerariesController } from './itineraries.controller';
import { ItinerarySubscriber } from './itinerary.subscriber';
import { ItinerariesService } from './itineraries.service';
import { BussesModule } from '../busses/busses.module';
import { RmqService } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    RmqModule,

    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BOOKING_QUEUE: Joi.string().required(),
      }),
    }),
    BussesModule,
    TypeOrmModule.forFeature([Itinerary]),
    SharedModule.registerRmq('AUTH_SERVICE', AUTH),
  ],
  controllers: [ItinerariesController],
  providers: [
    ItinerarySubscriber,
    ItinerariesService,
    {
      provide: 'SharedServiceInterface',
      useClass: RmqService,
    },
  ],
  exports: [ItinerariesService],
})
export class ItinerariesModule {}
