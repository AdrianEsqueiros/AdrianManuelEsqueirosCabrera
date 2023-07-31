import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {RmqService} from "@app/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('BOOKING'));
  await app.startAllMicroservices();
  const config = new DocumentBuilder()
      .setTitle('Nombre de tu API')
      .setDescription('Descripción de tu API')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT'));}
bootstrap();
