import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  app.useGlobalPipes(new ValidationPipe());
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getRmqOptions('BUS'));
  app.connectMicroservice(rmqService.getRmqOptions('ITINERARY'));
  app.connectMicroservice(rmqService.getRmqOptions('BOOKING'));
  await app.startAllMicroservices();
}
bootstrap();
