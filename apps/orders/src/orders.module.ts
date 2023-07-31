import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {  AuthModule } from '@app/common';
import {DatabaseSQLModule} from "@app/common/databaseSQL/database.module";
import {BookingsModule} from "./bookings/bookings.module";

@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true,

      envFilePath: './apps/orders/.env',
    }),
      DatabaseSQLModule,
      BookingsModule,
      AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class OrdersModule {}
