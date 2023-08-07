import { Module } from '@nestjs/common';
import { BussesService } from './busses.service';
import { BussesController } from './busses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusSubscriber } from './bus.subscriber';
import { Bus } from './entities/bus.entity';
import { AUTH, RmqService, SharedModule } from '@app/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bus]),
    SharedModule.registerRmq('AUTH_SERVICE', AUTH),
  ],
  controllers: [BussesController],
  providers: [
    BussesService,
    BusSubscriber,
    {
      provide: 'SharedServiceInterface',
      useClass: RmqService,
    },
  ],
  exports: [BussesService],
})
export class BussesModule {}
