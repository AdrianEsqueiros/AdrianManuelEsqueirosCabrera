import { Module } from '@nestjs/common';
import {
  RmqModule,
  DatabaseModule,
  RmqService,
  SharedModule,
  AUTH,
} from '@app/common';
import * as Joi from 'joi';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { ConfigModule } from '@nestjs/config';
import { BillingsRepository } from './billings.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Billing, BillingSchema } from './schemas/billing.schema';

@Module({
  imports: [
    DatabaseModule,
    RmqModule,
    MongooseModule.forFeature([{ name: Billing.name, schema: BillingSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
    }),
    SharedModule.registerRmq('AUTH_SERVICE', AUTH),
  ],
  controllers: [BillingController],
  providers: [
    BillingService,
    BillingsRepository,
    {
      provide: 'SharedServiceInterface',
      useClass: RmqService,
    },
  ],
})
export class BillingModule {}
