import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { CHAT, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  const sharedService = app.get(RmqService);
  app.connectMicroservice(sharedService.getRmqOptions(CHAT));
  await app.startAllMicroservices();

  await app.listen(8000);
}
bootstrap();
