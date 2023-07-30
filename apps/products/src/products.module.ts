import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import {ConfigModule} from "@nestjs/config";
import { ProductsController } from './products.controller';
import {BussesModule} from "./busses/busses.module";
import { ItinerariesModule } from './itinerary/itineraries.module';

@Module({
  imports: [
      BussesModule,
      ItinerariesModule,
      ConfigModule.forRoot({
        isGlobal:true,
        validationSchema: Joi.object({
          MONGODB_URI: Joi.string().required(),
          PORT: Joi.number().required()
        }),
        envFilePath: './apps/products/.env'
      })
  ],
  controllers: [ProductsController],
  providers: [],
})
export class ProductsModule {}
