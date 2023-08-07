import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.enableVersioning({
    defaultVersion: '1',
    type: 0,
  });
  const internalOptions = new DocumentBuilder()
    .setTitle('API - ONROAD')
    .addServer('http://localhost:5000')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const internalDocument = SwaggerModule.createDocument(app, internalOptions);

  SwaggerModule.setup('/', app, internalDocument, {
    customSiteTitle: 'API - ONROAD',
    swaggerOptions: {
      displayRequestDuration: true,
      persistAuthorization: true,
    },
  });
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getRmqOptions('BILLING'));
  app.connectMicroservice(rmqService.getRmqOptions('BOOKING'));
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
