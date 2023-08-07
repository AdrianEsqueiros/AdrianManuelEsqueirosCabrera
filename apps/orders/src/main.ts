import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { RmqService } from '@app/common';
async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.useGlobalPipes(new ValidationPipe());
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getRmqOptions('BOOKING'));
  app.connectMicroservice(rmqService.getRmqOptions('ITINERARY'));
  app.connectMicroservice(rmqService.getRmqOptions('BILLING'));

  await app.startAllMicroservices();
}
bootstrap();
