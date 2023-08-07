import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseSQLModule } from '@app/common';
import { BookingsModule } from './bookings/bookings.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orders/.env',
    }),
    DatabaseSQLModule,
    BookingsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BOOKING_QUEUE: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class OrdersModule {}
