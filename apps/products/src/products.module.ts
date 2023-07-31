import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import {ConfigModule} from "@nestjs/config";
import {BussesModule} from "./busses/busses.module";
import { ItinerariesModule } from './itinerary/itineraries.module';
import {DatabaseSQLModule} from "@app/common/databaseSQL/database.module";
import {RmqModule} from "@app/common";


@Module({
  imports: [
      DatabaseSQLModule,
      BussesModule,
      ItinerariesModule,
      RmqModule,
      ConfigModule.forRoot({
        isGlobal:true,
        envFilePath: './apps/products/.env'
      })
  ],
  controllers: [],
  providers: [],
})
export class ProductsModule {}
