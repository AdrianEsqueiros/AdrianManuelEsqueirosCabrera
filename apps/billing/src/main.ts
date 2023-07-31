import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { BillingModule } from './billing.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ConfigService} from "@nestjs/config";
async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('BILLING'));
  const config = new DocumentBuilder()
      .setTitle('Nombre de tu API')
      .setDescription('Descripción de tu API')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  const configService = app.get(ConfigService);
  SwaggerModule.setup('api', app, document);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));

}
bootstrap();
